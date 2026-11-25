import http from 'node:http';
import { spawn } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, createHash, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const passwordSalt = 'bc571b8e5c46e03c7ee3914d1feecbd1';
const passwordKey = process.env.EDUCASIM_SENHA
    ? scryptSync(process.env.EDUCASIM_SENHA, passwordSalt, 64)
    : Buffer.from('b6536d1af59a9990317723def5ab438012e2e6cca6b8cf075c1938b97fefb3aa981d8c9489ddbc12a305890c7dda47b7be865f0c583ce74777d3cc2a5a20a5b5', 'hex');
const root = fileURLToPath(new URL('./public/', import.meta.url));
const dir = process.env.DATA_DIR || fileURLToPath(new URL('./dados/', import.meta.url));
mkdirSync(dir, { recursive: true });
const db = new DatabaseSync(join(dir, 'educasim.sqlite'));
db.exec(`PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS cursos(id TEXT PRIMARY KEY, status TEXT NOT NULL, dados TEXT NOT NULL, imagem BLOB, tipo TEXT);
CREATE TABLE IF NOT EXISTS sessoes(token TEXT PRIMARY KEY, expira INTEGER NOT NULL);`);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
const attempts = new Map();
const hash = s => createHash('sha256').update(s).digest();
function fail(code, message) { throw Object.assign(new Error(message), {code}); }
async function body(req) {
    if (req.headers['content-type']?.split(';')[0] !== 'application/json') fail(415,'Envie JSON.');
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
        size += chunk.length;
        if (size > 4300000) fail(413,'Arquivo muito grande.');
        chunks.push(chunk);
    }
    try { return JSON.parse(Buffer.concat(chunks)); } catch { fail(400,'Dados inválidos.'); }
}
function course(raw) {
    const fields = {};
    for (const key of ['titulo','categoria','modalidade','descricao','instituicao','cidade','faixaEtaria','dataInicio','contato','duracao','requisitos','localOuLink']) {
        const value = raw?.[key] ?? '';
        if (typeof value !== 'string' || value.length > 1000) fail(400,'Campo inválido: '+key);
        fields[key] = value.trim();
        if (!fields[key] && !['duracao','requisitos','localOuLink'].includes(key)) fail(400,'Preencha o campo '+key);
    }
    if (!['Administrativo','Informático','Turismo','Saúde'].includes(fields.categoria) ||
        !['Online','Híbrido','Presencial'].includes(fields.modalidade) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fields.dataInicio) || !Number.isFinite(Date.parse(fields.dataInicio)) ||
        !Number.isSafeInteger(raw.vagas) || raw.vagas < 1 ||
        typeof raw.certificado !== 'boolean' || typeof raw.gratuito !== 'boolean' ||
        !Array.isArray(raw.conteudos) || raw.conteudos.length > 200 ||
        raw.conteudos.some(s=>typeof s !== 'string' || s.length > 2000)) fail(400,'Confira os dados do curso.');
    return {...fields, vagas:raw.vagas, certificado:raw.certificado, gratuito:raw.gratuito, conteudos:raw.conteudos, data:new Date().toISOString()};
}
function photo(value) {
    if (!value) return [null,null];
    const m = typeof value === 'string' && value.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+=*)$/);
    if (!m) fail(400,'Imagem inválida.');
    const bytes = Buffer.from(m[2],'base64');
    const matches = {jpeg:bytes.subarray(0,3).toString('hex')==='ffd8ff', png:bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a', webp:bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP'};
    if (bytes.length>3145728 || !matches[m[1]]) fail(400,'Imagem inválida ou maior que 3 MB.');
    return [bytes,'image/'+m[1]];
}
const server = http.createServer(async (req,res)=>{
    const path = new URL(req.url,'http://localhost').pathname;
    const token = req.headers.cookie?.match(/(?:^|;\s*)educasim=([0-9a-f]{64})(?:;|$)/)?.[1] || '';
    const digest = hash(token).toString('hex');
    const admin = !!db.prepare('SELECT 1 FROM sessoes WHERE token=? AND expira>?').get(digest,Date.now());
    const json = (obj,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'}); res.end(JSON.stringify(obj));};
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    try {
        if (req.method==='POST') {
            if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) fail(403,'Origem inválida.');
            const input = await body(req);
            if (path==='/api/login') {
                const ip = req.socket.remoteAddress;
                const now = Date.now();
                for (const [key,entry] of attempts) if (entry.until<=now) attempts.delete(key);
                const record = attempts.get(ip) || {count:0,until:now+600000};
                if (record.count>=10) fail(429,'Muitas tentativas. Aguarde dez minutos.');
                if (typeof input?.senha !== 'string' || Buffer.byteLength(input.senha) > 1024 || !timingSafeEqual(scryptSync(input.senha,passwordSalt,64),passwordKey)) {
                    record.count++; attempts.set(ip,record); fail(401,'Senha incorreta.');
                }
                attempts.delete(ip);
                const key = randomBytes(32).toString('hex');
                db.prepare('DELETE FROM sessoes WHERE expira<=? OR token=?').run(now,digest);
                db.prepare('INSERT INTO sessoes VALUES (?,?)').run(hash(key).toString('hex'),now+8*3600000);
                const secure = process.env.NODE_ENV==='production' ? '; Secure' : '';
                res.setHeader('Set-Cookie','educasim='+key+'; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800'+secure);
                return json({ok:true});
            }
            if (path==='/api/cursos') {
                const data = course(input);
                const [image,type] = photo(input.imagem);
                const id = randomUUID();
                data.id = id;
                data.imagem = image ? '/api/imagens/'+id : '';
                db.prepare('INSERT INTO cursos VALUES (?,?,?,?,?)').run(id,'pendente',JSON.stringify(data),image,type);
                return json({id},201);
            }
            if (!admin) fail(401,'Entre na área do responsável.');
            if (path==='/api/sair') {
                db.prepare('DELETE FROM sessoes WHERE token=?').run(digest);
                res.setHeader('Set-Cookie','educasim=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
                return json({ok:true});
            }
            if (path==='/api/decisao') {
                const query = {aprovar:"UPDATE cursos SET status='aprovado' WHERE id=? AND status='pendente'",rejeitar:"DELETE FROM cursos WHERE id=? AND status='pendente'"}; 
                if (!Object.hasOwn(query,input?.acao) || typeof input.id!=='string') fail(400,'Decisão inválida.');
                if (!db.prepare(query[input.acao]).run(input.id).changes) fail(409,'Este curso já saiu da fila.');
                return json({ok:true});
            }
        }
        if (req.method!=='GET') fail(404,'Recurso indisponível.');
        if (path==='/api/sessao') return json({autenticado:admin});
        if (path==='/api/cursos' || path==='/api/pendentes') {
            const pending = path.endsWith('pendentes');
            if (pending && !admin) fail(401,'Entre na área do responsável.');
            return json(db.prepare('SELECT dados FROM cursos WHERE status=? ORDER BY rowid DESC').all(pending?'pendente':'aprovado').map(row=>JSON.parse(row.dados)));
        }
        if (path.startsWith('/api/imagens/')) {
            const row = db.prepare("SELECT imagem,tipo FROM cursos WHERE id=? AND (status='aprovado' OR ?=1)").get(path.split('/').pop(),Number(admin));
            if (!row?.imagem) fail(404,'Imagem indisponível.');
            res.setHeader('Content-Type',row.tipo);
            return res.end(Buffer.from(row.imagem));
        }
        const file = path==='/'?'index.html':path.slice(1);
        if (!['index.html','privacidade.html','style.css','script.js','cursos.json'].includes(file) && !/^imagens\/[\w.-]+\.(png|jpg|webp)$/i.test(file)) fail(404,'Página indisponível.');
        const bytes = readFileSync(join(root,file));
        res.setHeader('Content-Type',mime[extname(file)]); res.end(bytes);
    } catch (e) {
        const status = Number.isInteger(e.code)?e.code:e.code==='ENOENT'?404:500;
        json({erro:status===500?'Falha no servidor.':status===404?'Recurso indisponível.':e.message},status);
    }
});
const abrirNoWindows = process.platform === 'win32' && process.argv.includes('--abrir');
server.listen(Number(process.env.PORT || 3000), () => {
    const url = 'http://localhost:' + server.address().port;
    console.log('EducaSim disponível em ' + url);
    if (abrirNoWindows) {
        const browser = spawn('explorer.exe', [url], {detached:true, stdio:'ignore'});
        browser.on('error', () => console.log('Abra ' + url + ' no navegador.'));
        browser.unref();
    }
});
