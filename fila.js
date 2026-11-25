const chaveCursos = "educasim_cursos";
const lista = document.getElementById("listaPendentes");
const resumo = document.getElementById("resumoFila");

function lerCursosDaFila() {
    return JSON.parse(localStorage.getItem(chaveCursos) || "[]");
}

function atualizarFila(aviso = "") {
    if (!acessoResponsavel.ativo()) {
        document.getElementById("areaFila").hidden = true;
        location.replace("index.html#moderacao");
        return;
    }
    document.getElementById("areaFila").hidden = false;
    const cursos = lerCursosDaFila().filter(c => c.status === "pendente");
    lista.replaceChildren();
    resumo.textContent = [aviso, cursos.length ? cursos.length + (cursos.length === 1 ? " curso na fila." : " cursos na fila.") : "Nenhum curso na fila."].filter(Boolean).join(" ");
    for (const curso of cursos) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-pendente";
        const titulo = document.createElement("h2");
        titulo.textContent = curso.titulo;
        cartao.append(titulo);
        for (const texto of [curso.descricao, [curso.instituicao, curso.cidade, curso.modalidade].filter(Boolean).join(" · "), curso.vagas + " vagas", curso.contato]) {
            if (!texto) continue;
            const linha = document.createElement("p");
            linha.textContent = texto;
            cartao.append(linha);
        }
        const acoes = document.createElement("div");
        acoes.className = "acoes-pendente";
        for (const acao of ["Aceitar", "Recusar"]) {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = acao === "Aceitar" ? "botao-aprovar" : "botao-acao botao-rejeitar";
            botao.textContent = acao;
            botao.addEventListener("click", () => decidir(curso.id, acao));
            acoes.append(botao);
        }
        cartao.append(acoes);
        lista.append(cartao);
    }
}

function decidir(id, acao) {
    if (!acessoResponsavel.ativo()) return atualizarFila();
    if (acao === "Recusar" && !confirm("Recusar este curso?")) return;
    const cursos = lerCursosDaFila();
    const indice = cursos.findIndex(c => c.id === id && c.status === "pendente");
    if (indice < 0) return atualizarFila("Esse curso já saiu da fila.");
    const titulo = cursos[indice].titulo;
    if (acao === "Aceitar") cursos[indice].status = "aprovado";
    else cursos.splice(indice, 1);
    try { localStorage.setItem(chaveCursos, JSON.stringify(cursos)); }
    catch { resumo.textContent = "Não deu para salvar. Tente de novo."; return; }
    atualizarFila(titulo + (acao === "Aceitar" ? " foi aceito." : " foi recusado."));
}

document.getElementById("sair").addEventListener("click", () => {
    acessoResponsavel.sair();
    location.replace("index.html#links-rodape");
});
window.addEventListener("storage", evento => {
    if (!evento.key || evento.key === chaveCursos) atualizarFila();
});
window.addEventListener("pageshow", () => atualizarFila());
atualizarFila();
