/* ==================================================
   CONFIGURAÇÕES E ELEMENTOS DO SITE
   ================================================== */

// Chaves usadas para guardar os dados no localStorage.
const CHAVE_CURSOS = "educasim_cursos";
const CHAVE_INSCRICOES = "educasim_inscricoes";
// Chave antiga dos exemplos (só é usada para limpar dados de versões anteriores).
const CHAVE_EXEMPLOS_CURSOS = "educasim_exemplos_cursos_v1";

// Arquivo com os cursos de exemplo.
const ARQUIVO_CURSOS = "cursos.json";

// Listas usadas nos filtros E no formulário de cadastro.
// Para criar uma categoria ou modalidade nova, basta mudar aqui.
const CATEGORIAS = ["Administrativo", "Informático", "Turismo", "Saúde"];
const MODALIDADES = ["Online", "Híbrido", "Presencial"];

// Nomes antigos de categoria (versões anteriores do site) e o nome atual.
const CORRECAO_CATEGORIAS = {
    "Administrativos": "Administrativo",
    "Informáticos": "Informático"
};

// Regras para a imagem do curso.
const TIPOS_IMAGEM_ACEITOS = ["image/png", "image/jpeg", "image/webp"];
const TAMANHO_MAXIMO_IMAGEM = 3 * 1024 * 1024; // 3 MB

// Situação de cada curso cadastrado pelos usuários.
const STATUS_PENDENTE = "pendente";
const STATUS_APROVADO = "aprovado";

// Elementos da navegação mobile.
const botaoMenu = document.getElementById("botaoMenu");
const menuPrincipal = document.getElementById("menuPrincipal");

// Elementos do cadastro e da listagem de cursos.
const formularioCadastroCurso = document.getElementById("formularioCadastroCurso");
const listaCursos = document.getElementById("listaCursos");
const imagemCurso = document.getElementById("imagemCurso");
const nomeImagemCurso = document.getElementById("nomeImagemCurso");
const previaImagemCurso = document.getElementById("previaImagemCurso");

// Elementos de busca e filtro.
const buscaCurso = document.getElementById("buscaCurso");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroModalidade = document.getElementById("filtroModalidade");
const filtroCidade = document.getElementById("filtroCidade");
const filtroGratuito = document.getElementById("filtroGratuito");
const contadorCursos = document.getElementById("contadorCursos");

// Elementos do formulário de inscrição.
const formularioInscricao = document.getElementById("formularioInscricao");
const areaInscricao = document.getElementById("area-inscricao");
const cursoSelecionado = document.getElementById("cursoSelecionado");
const cursoIdInscricao = document.getElementById("cursoIdInscricao");
const botaoCancelarInscricao = document.getElementById("botaoCancelarInscricao");
const telefoneInscricao = document.getElementById("telefoneInscricao");
const dataNascimentoInscricao = document.getElementById("dataNascimento");
const avisoMenorIdade = document.getElementById("avisoMenorIdade");

// Campos novos do cadastro de curso.
const contatoCurso = document.getElementById("contatoCurso");

// Elementos da lista de inscrições e dos indicadores.
const listaInscricoes = document.getElementById("listaInscricoes");
const indicadorCursos = document.getElementById("indicadorCursos");
const indicadorVagas = document.getElementById("indicadorVagas");
const indicadorInscricoes = document.getElementById("indicadorInscricoes");
const indicadorInstituicoes = document.getElementById("indicadorInstituicoes");
const botaoApagarInscricoes = document.getElementById("botaoApagarInscricoes");

// Elementos de avisos, confirmação e edição de curso.
const avisos = document.getElementById("avisos");
const dialogoConfirmacao = document.getElementById("dialogoConfirmacao");
const tituloDialogo = document.getElementById("tituloDialogo");
const textoDialogo = document.getElementById("textoDialogo");
const botaoConfirmarExclusao = document.getElementById("botaoConfirmarExclusao");
const botaoCancelarExclusao = document.getElementById("botaoCancelarExclusao");
const cursoIdEdicao = document.getElementById("cursoIdEdicao");
const tituloFormularioCurso = document.getElementById("tituloFormularioCurso");
const botaoSalvarCurso = document.getElementById("botaoSalvarCurso");
const botaoCancelarEdicao = document.getElementById("botaoCancelarEdicao");
const avisoModeracao = document.getElementById("avisoModeracao");


/* ==================================================
   MENU MOBILE
   Abre e fecha a navegação no celular.
   ================================================== */

const menuMobile = window.matchMedia("(max-width: 860px)");

function definirMenuAberto(aberto) {
    const menuInativo = menuMobile.matches && !aberto;
    if (menuInativo && menuPrincipal.contains(document.activeElement)) {
        botaoMenu.focus({ preventScroll: true });
    }

    menuPrincipal.classList.toggle("aberto", aberto);
    menuPrincipal.inert = menuInativo;
    botaoMenu.classList.toggle("aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute(
        "aria-label",
        aberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
}

function fecharMenuMobile() {
    definirMenuAberto(false);
}

// Abre ou fecha o menu quando o botão é clicado.
botaoMenu.addEventListener("click", function() {
    definirMenuAberto(!menuPrincipal.classList.contains("aberto"));
});

menuMobile.addEventListener("change", fecharMenuMobile);
fecharMenuMobile();

// Fecha o menu depois que um link é escolhido.
menuPrincipal.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", fecharMenuMobile);
});

// Fecha o menu quando a pessoa pressiona a tecla Escape.
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        fecharMenuMobile();
    }
});


/* ==================================================
   NAVBAR DURANTE A ROLAGEM
   Adiciona a aparência compacta definida no CSS.
   ================================================== */

const barraNavegacao = document.querySelector(".barra-navegacao");

function atualizarNavbar() {
    if (window.scrollY > 30) {
        barraNavegacao.classList.add("rolou");
    } else {
        barraNavegacao.classList.remove("rolou");
    }
}

atualizarNavbar();


/* ==================================================
   FUNÇÕES DO LOCALSTORAGE
   Lê e grava os dados no navegador.
   ================================================== */

function lerLista(chave) {
    const texto = localStorage.getItem(chave);

    if (!texto) {
        return [];
    }

    try {
        const lista = JSON.parse(texto);
        return Array.isArray(lista) ? lista : [];
    } catch (erro) {
        // Se houver um dado inválido, o site continua funcionando.
        return [];
    }
}

function gravarLista(chave, lista) {
    try {
        localStorage.setItem(chave, JSON.stringify(lista));
        return true;
    } catch (erro) {
        const mensagem = erro.name === "QuotaExceededError"
            ? "O navegador está sem espaço para salvar."
            : "Não deu para salvar neste navegador.";
        mostrarAviso(mensagem, "erro");
        return false;
    }
}

// Arruma cursos guardados por versões antigas do site e garante os campos básicos.
function normalizarCurso(curso) {
    return Object.assign({}, curso, {
        categoria: CORRECAO_CATEGORIAS[curso.categoria] || curso.categoria,
        // Versões antigas usavam "local"; agora o campo se chama "localOuLink".
        localOuLink: curso.localOuLink || curso.local || "",
        // Cursos antigos não tinham status: eram públicos.
        status: curso.status || STATUS_APROVADO
    });
}

// Cursos cadastrados neste navegador (aprovados ou pendentes).
function lerCursos() {
    return lerLista(CHAVE_CURSOS)
        .filter(function(curso) { return curso && typeof curso === "object"; })
        .map(normalizarCurso);
}

function gravarCursos(cursos) {
    return gravarLista(CHAVE_CURSOS, cursos);
}

// Cursos de exemplo vindos do arquivo cursos.json (somente leitura).
let cursosDoArquivo = [];
let arquivoCursosCarregado = false;

async function carregarCursosDoArquivo() {
    let lista = JSON.parse(document.getElementById("catalogoInicial").textContent);
    if (location.protocol !== "file:") {
        try {
            const resposta = await fetch(ARQUIVO_CURSOS, {cache:"no-cache"});
            if (resposta.ok) {
                const dados = await resposta.json();
                const atual = Array.isArray(dados) ? dados : dados.cursos;
                if (Array.isArray(atual)) lista = atual;
            }
        } catch {
            // A cópia incluída no HTML permite consultar os exemplos sem conexão.
        }
    }
    cursosDoArquivo = lista.map(curso => ({
        ...normalizarCurso(curso), origem:"arquivo", status:STATUS_APROVADO
    }));
    arquivoCursosCarregado = true;
}

// Versões antigas copiavam os exemplos para o localStorage.
// Agora eles vêm do cursos.json, então removemos a cópia para não duplicar.
function removerExemplosAntigos() {
    const idsDoArquivo = new Set(cursosDoArquivo.map(function(curso) { return curso.id; }));
    const cursos = lerCursos();
    // Exemplos descontinuados também podem existir em cópias locais antigas.
    idsDoArquivo.add("exemplo-presencial-informatica");
    idsDoArquivo.add("exemplo-pago-administrativo");
    const restantes = cursos.filter(function(curso) { return !idsDoArquivo.has(curso.id); });

    if (restantes.length !== cursos.length) {
        gravarCursos(restantes);
    }

    try {
        localStorage.removeItem(CHAVE_EXEMPLOS_CURSOS);
    } catch (erro) {
        // Não é um problema se a chave antiga não puder ser removida.
    }
}

// Cursos que aparecem na lista pública: os aprovados do navegador + os do arquivo.
function lerCursosPublicos() {
    const aprovados = lerCursos().filter(function(curso) {
        return curso.status === STATUS_APROVADO;
    });
    return aprovados.concat(cursosDoArquivo);
}

// Cursos que aguardam a análise do responsável.
function lerCursosPendentes() {
    return lerCursos().filter(function(curso) {
        return curso.status === STATUS_PENDENTE;
    });
}

function buscarCursoPublico(id) {
    return lerCursosPublicos().find(function(curso) {
        return curso.id === id;
    });
}

function lerInscricoes() {
    return lerLista(CHAVE_INSCRICOES);
}

function gravarInscricoes(inscricoes) {
    return gravarLista(CHAVE_INSCRICOES, inscricoes);
}


/* ==================================================
   FUNÇÕES AUXILIARES
   Reúnem tarefas usadas em várias partes do programa.
   ================================================== */

function criarId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}

function formatarData(data) {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date(data));
}

function criarTexto(texto) {
    const elemento = document.createElement("span");
    elemento.textContent = texto;
    return elemento;
}

function adicionarInformacao(cartao, nome, valor) {
    const paragrafo = document.createElement("p");
    const destaque = document.createElement("strong");

    destaque.textContent = nome + ": ";
    paragrafo.appendChild(destaque);
    paragrafo.appendChild(criarTexto(valor));
    cartao.appendChild(paragrafo);
}

function contarInscricoesDoCurso(cursoId) {
    return lerInscricoes().filter(function(inscricao) {
        return inscricao.cursoId === cursoId;
    }).length;
}

function calcularVagasDisponiveis(curso) {
    const vagasOcupadas = contarInscricoesDoCurso(curso.id);
    return Math.max(0, Number(curso.vagas) - vagasOcupadas);
}

// Transforma "2027-02-08" em "08/02/2027" (sem erro de fuso horário).
function formatarDataInicio(dataIso) {
    const partes = String(dataIso || "").split("-");

    if (partes.length !== 3) {
        return dataIso || "";
    }

    return partes[2].slice(0, 2) + "/" + partes[1] + "/" + partes[0];
}

function dataValida(valor) {
    return Boolean(valor) && !Number.isNaN(new Date(valor).getTime());
}

// Descobre se o contato é um e-mail ou um telefone (WhatsApp) com DDD.
// Devolve null quando não é nenhum dos dois.
function identificarContato(texto) {
    const contato = String(texto || "").trim();

    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contato)) {
        return { tipo: "email", valor: contato };
    }

    if (/^[\d\s()+-]+$/.test(contato)) {
        let digitos = contato.replace(/\D/g, "");

        // Aceita o código do Brasil (55) na frente.
        if (digitos.startsWith("55") && digitos.length >= 12) {
            digitos = digitos.slice(2);
        }

        if (digitos.length === 10 || digitos.length === 11) {
            return { tipo: "telefone", valor: "55" + digitos };
        }
    }

    return null;
}

// Calcula a idade a partir de uma data no formato AAAA-MM-DD.
function calcularIdade(dataIso) {
    const partes = String(dataIso || "").split("-").map(Number);

    if (partes.length !== 3 || !partes[0]) {
        return null;
    }

    const hoje = new Date();
    let idade = hoje.getFullYear() - partes[0];
    const mes = hoje.getMonth() + 1;

    if (mes < partes[1] || (mes === partes[1] && hoje.getDate() < partes[2])) {
        idade--;
    }

    return idade;
}

// Preenche um <select> com as opções de uma lista.
function preencherSelect(select, itens) {
    itens.forEach(function(item) {
        const opcao = document.createElement("option");
        opcao.value = item;
        opcao.textContent = item;
        select.appendChild(opcao);
    });
}

// Cria as listas fixas (categorias e modalidades) nos filtros e no formulário.
function preencherListasFixas() {
    preencherSelect(filtroCategoria, CATEGORIAS);
    preencherSelect(filtroModalidade, MODALIDADES);
    preencherSelect(document.getElementById("categoriaCurso"), CATEGORIAS);
    preencherSelect(document.getElementById("modalidadeCurso"), MODALIDADES);
}


/* ==================================================
   VALIDAÇÃO DOS FORMULÁRIOS
   Apresenta as mensagens próximas aos campos.
   ================================================== */

const mensagensCamposObrigatorios = {
    tituloCurso: "Informe o título do curso.",
    categoriaCurso: "Selecione a categoria do curso.",
    vagasCurso: "Informe a quantidade de vagas.",
    modalidadeCurso: "Selecione a modalidade do curso.",
    descricaoCurso: "Informe a descrição do curso.",
    instituicaoCurso: "Informe o nome da instituição.",
    cidadeCurso: "Informe a cidade do curso.",
    gratuitoCurso: "Informe se o curso é gratuito.",
    faixaEtariaCurso: "Informe a faixa etária do curso.",
    certificadoCurso: "Informe se o curso entrega certificado.",
    dataInicioCurso: "Informe a data de início do curso.",
    contatoCurso: "Informe um WhatsApp ou e-mail de contato.",
    nomeCompleto: "Informe seu nome completo.",
    dataNascimento: "Informe sua data de nascimento.",
    emailInscricao: "Informe seu e-mail.",
    telefoneInscricao: "Informe seu telefone.",
    cidadeInscricao: "Informe sua cidade.",
    escolaridadeInscricao: "Selecione sua escolaridade.",
    aceiteInscricao: "Confirme as informações para continuar."
};

const errosCampos = new WeakMap();

function obterMensagemValidacao(campo) {
    const validade = campo.validity;

    if (validade.badInput) {
        return campo.type === "date" ? "Informe uma data válida." : "Informe um número válido.";
    }
    if (validade.valueMissing) {
        return mensagensCamposObrigatorios[campo.id] || "Preencha este campo.";
    }
    if (validade.typeMismatch && campo.type === "email") {
        return "Informe um e-mail válido, como nome@exemplo.com.";
    }
    if (validade.rangeUnderflow) {
        return "Informe um valor de pelo menos " + campo.min + ".";
    }
    if (validade.rangeOverflow) {
        return campo.id === "dataNascimento"
            ? "A data de nascimento não pode estar no futuro."
            : "Informe um valor de no máximo " + campo.max + ".";
    }
    if (validade.stepMismatch && campo.type === "number") {
        return "Informe um número inteiro.";
    }
    if (validade.tooLong) {
        return "Use no máximo " + campo.maxLength + " caracteres.";
    }
    if (validade.customError) {
        // Mensagem definida por nós com setCustomValidity (contato e telefone).
        return campo.validationMessage;
    }

    return validade.valid ? "" : "Confira o valor informado neste campo.";
}

function limparErroCampo(campo) {
    const erro = errosCampos.get(campo);
    if (!erro) {
        return;
    }

    erro.elemento.remove();
    errosCampos.delete(campo);

    const descricoes = (campo.getAttribute("aria-describedby") || "").split(/\s+/).filter(function(id) {
        return id && id !== erro.elemento.id;
    });
    if (descricoes.length) {
        campo.setAttribute("aria-describedby", descricoes.join(" "));
    } else {
        campo.removeAttribute("aria-describedby");
    }

    if (erro.ariaInvalidAnterior === null) {
        campo.removeAttribute("aria-invalid");
    } else {
        campo.setAttribute("aria-invalid", erro.ariaInvalidAnterior);
    }
}

function atualizarErroCampo(campo, mensagem) {
    if (!mensagem) {
        limparErroCampo(campo);
        return;
    }

    const erro = errosCampos.get(campo);
    if (erro) {
        erro.elemento.textContent = mensagem;
        return;
    }

    const elemento = document.createElement("p");
    elemento.id = campo.id + "-erro";
    elemento.className = "erro-campo";
    elemento.textContent = mensagem;
    campo.closest(".campo").appendChild(elemento);

    errosCampos.set(campo, { elemento: elemento, ariaInvalidAnterior: campo.getAttribute("aria-invalid") });
    const descricoes = campo.getAttribute("aria-describedby");
    campo.setAttribute("aria-describedby", descricoes ? descricoes + " " + elemento.id : elemento.id);
    campo.setAttribute("aria-invalid", "true");
}

function limparErrosFormulario(formulario) {
    Array.from(formulario.elements).forEach(limparErroCampo);
}

function validarFormulario(formulario) {
    let primeiroInvalido = null;

    for (const campo of formulario.elements) {
        const mensagem = campo.willValidate ? obterMensagemValidacao(campo) : "";
        atualizarErroCampo(campo, mensagem);
        if (mensagem && !primeiroInvalido) {
            primeiroInvalido = campo;
        }
    }

    if (primeiroInvalido) {
        primeiroInvalido.focus({ preventScroll: true });
        primeiroInvalido.closest(".campo").scrollIntoView({ block: "center" });
    }

    return primeiroInvalido === null;
}

[formularioCadastroCurso, formularioInscricao].forEach(function(formulario) {
    formulario.noValidate = true;

    function revalidarCampo(evento) {
        const campo = evento.target;
        if (errosCampos.has(campo)) {
            atualizarErroCampo(campo, campo.willValidate ? obterMensagemValidacao(campo) : "");
        }
    }

    formulario.addEventListener("input", revalidarCampo);
    formulario.addEventListener("change", revalidarCampo);
    formulario.addEventListener("reset", function() {
        limparErrosFormulario(formulario);
    });
});


/* ==================================================
   AVISOS E CONFIRMAÇÃO
   Mensagens dentro da página e janela de confirmação.
   ================================================== */

function mostrarAviso(mensagem, tipo) {
    const tipoAviso = tipo || "sucesso";
    const aviso = document.createElement("div");
    aviso.className = "aviso aviso-" + tipoAviso;

    // O símbolo reforça o tipo do aviso, sem depender só da cor.
    const simbolo = document.createElement("span");
    simbolo.className = "aviso-simbolo";
    simbolo.setAttribute("aria-hidden", "true");
    simbolo.textContent = tipoAviso === "erro" ? "!" : (tipoAviso === "info" ? "i" : "✓");

    const texto = document.createElement("span");
    texto.className = "aviso-texto";
    texto.textContent = mensagem;

    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "aviso-fechar";
    fechar.setAttribute("aria-label", "Fechar aviso");
    fechar.textContent = "×";
    fechar.addEventListener("click", function() {
        aviso.remove();
    });

    aviso.appendChild(simbolo);
    aviso.appendChild(texto);
    aviso.appendChild(fechar);
    avisos.appendChild(aviso);

    setTimeout(function() {
        aviso.remove();
    }, tipoAviso === "erro" ? 8000 : 5000);
}

function confirmarAcao(titulo, texto, rotuloConfirmar) {
    return new Promise(function(resolver) {
        tituloDialogo.textContent = titulo;
        textoDialogo.textContent = texto;
        botaoConfirmarExclusao.textContent = rotuloConfirmar;
        dialogoConfirmacao.returnValue = "";

        function aoFechar() {
            dialogoConfirmacao.removeEventListener("close", aoFechar);
            resolver(dialogoConfirmacao.returnValue === "sim");
        }

        dialogoConfirmacao.addEventListener("close", aoFechar);
        dialogoConfirmacao.showModal();
    });
}

botaoConfirmarExclusao.addEventListener("click", function() {
    dialogoConfirmacao.close("sim");
});

botaoCancelarExclusao.addEventListener("click", function() {
    dialogoConfirmacao.close("nao");
});


/* ==================================================
   IMAGEM DO CURSO
   Guarda os arquivos originais no IndexedDB e suas referências nos cursos.
   ================================================== */

const BANCO_IMAGENS_CURSOS = "educasim_imagens_cursos";
const LOJA_IMAGENS_CURSOS = "imagens";
const PREFIXO_IMAGEM_ORIGINAL = "imagem-original:";
const urlsImagensCurso = new WeakMap();
const textoSemArquivo = nomeImagemCurso.textContent;

let bancoImagensCursos = null;
let novaImagemCurso = null;
let preparacaoImagem = null;
let salvandoCurso = false;

function abrirBancoImagensCursos() {
    if (!bancoImagensCursos) {
        bancoImagensCursos = new Promise(function(resolver, rejeitar) {
            const pedido = indexedDB.open(BANCO_IMAGENS_CURSOS, 1);

            pedido.onupgradeneeded = function() {
                pedido.result.createObjectStore(LOJA_IMAGENS_CURSOS);
            };
            pedido.onsuccess = function() {
                const banco = pedido.result;
                banco.onversionchange = function() {
                    banco.close();
                    bancoImagensCursos = null;
                };
                resolver(banco);
            };
            pedido.onerror = function() {
                rejeitar(pedido.error);
            };
            pedido.onblocked = function() {
                pedido.onsuccess = function() { pedido.result.close(); };
                rejeitar(new Error("O armazenamento de imagens está ocupado."));
            };
        }).catch(function(erro) {
            bancoImagensCursos = null;
            throw erro;
        });
    }

    return bancoImagensCursos;
}

async function acessarImagemOriginal(modo, operacao) {
    const banco = await abrirBancoImagensCursos();

    return new Promise(function(resolver, rejeitar) {
        const transacao = banco.transaction(LOJA_IMAGENS_CURSOS, modo);
        const pedido = operacao(transacao.objectStore(LOJA_IMAGENS_CURSOS));

        transacao.oncomplete = function() {
            resolver(pedido?.result);
        };
        transacao.onabort = function() {
            rejeitar(transacao.error || pedido?.error);
        };
    });
}

function ehReferenciaImagemOriginal(origem) {
    return typeof origem === "string" && origem.startsWith(PREFIXO_IMAGEM_ORIGINAL);
}

async function salvarImagemOriginal(arquivo) {
    const referencia = PREFIXO_IMAGEM_ORIGINAL + criarId();

    await acessarImagemOriginal("readwrite", function(imagens) {
        return imagens.add(arquivo, referencia);
    });

    return referencia;
}

function descartarImagemOriginal(origem) {
    if (!ehReferenciaImagemOriginal(origem)) {
        return;
    }

    acessarImagemOriginal("readwrite", function(imagens) {
        if (!lerCursos().some(function(curso) { return curso.imagem === origem; })) {
            return imagens.delete(origem);
        }
    }).catch(function() {
        // A remoção da cópia sem curso associado pode falhar sem afetar os cursos salvos.
    });
}

function mostrarArquivoNaImagem(imagem, arquivo) {
    const url = URL.createObjectURL(arquivo);
    urlsImagensCurso.set(imagem, url);
    imagem.src = url;
}

async function carregarImagemCurso(imagem, origem) {
    if (origem instanceof Blob) {
        mostrarArquivoNaImagem(imagem, origem);
        return;
    }

    if (!ehReferenciaImagemOriginal(origem)) {
        imagem.src = origem;
        return;
    }

    try {
        const arquivo = await acessarImagemOriginal("readonly", function(imagens) {
            return imagens.get(origem);
        });

        if (imagem.isConnected) {
            if (arquivo instanceof Blob) {
                mostrarArquivoNaImagem(imagem, arquivo);
            } else {
                imagem.hidden = true;
            }
        }
    } catch (erro) {
        imagem.hidden = true;
    }
}

function liberarUrlsImagensCurso(container) {
    container.querySelectorAll("img").forEach(function(imagem) {
        const url = urlsImagensCurso.get(imagem);

        if (url) {
            URL.revokeObjectURL(url);
            urlsImagensCurso.delete(imagem);
        }
    });
}

function exibirPrevia(origem) {
    liberarUrlsImagensCurso(previaImagemCurso);
    previaImagemCurso.innerHTML = "";

    if (!origem) {
        return;
    }

    const imagem = document.createElement("img");
    imagem.alt = "Prévia da imagem do curso";

    previaImagemCurso.appendChild(imagem);
    carregarImagemCurso(imagem, origem);
}

function definirPreparacaoImagem(preparacao) {
    preparacaoImagem = preparacao;
    botaoSalvarCurso.disabled = Boolean(preparacao) || salvandoCurso;
}

function definirSalvamentoCurso(gravando) {
    salvandoCurso = gravando;
    formularioCadastroCurso.inert = gravando;
    botaoSalvarCurso.disabled = Boolean(preparacaoImagem) || gravando;
}

function restaurarPreviaImagem(origem) {
    definirPreparacaoImagem(null);
    novaImagemCurso = null;
    nomeImagemCurso.textContent = textoSemArquivo;
    exibirPrevia(origem);
}

function restaurarImagemSalva() {
    const curso = cursoIdEdicao.value ? buscarCurso(cursoIdEdicao.value) : null;
    imagemCurso.value = "";
    restaurarPreviaImagem(curso?.imagem || "");
}

async function validarImagemCurso(arquivo) {
    const url = URL.createObjectURL(arquivo);

    try {
        const imagem = new Image();
        imagem.src = url;
        await imagem.decode();
    } finally {
        URL.revokeObjectURL(url);
    }
}

imagemCurso.addEventListener("change", async function() {
    const arquivo = imagemCurso.files[0];

    if (!arquivo) {
        restaurarImagemSalva();
        return;
    }

    if (!TIPOS_IMAGEM_ACEITOS.includes(arquivo.type)) {
        definirPreparacaoImagem(null);
        imagemCurso.value = "";
        mostrarAviso("Escolha uma imagem PNG, JPG ou WebP.", "erro");
        return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
        definirPreparacaoImagem(null);
        imagemCurso.value = "";
        mostrarAviso(
            "Escolha uma imagem de até " +
            (TAMANHO_MAXIMO_IMAGEM / 1024 / 1024) + " MB.",
            "erro"
        );
        return;
    }

    const preparacao = validarImagemCurso(arquivo);
    definirPreparacaoImagem(preparacao);

    try {
        await preparacao;

        if (preparacaoImagem === preparacao) {
            novaImagemCurso = arquivo;
            nomeImagemCurso.textContent = arquivo.name;
            exibirPrevia(arquivo);
            mostrarAviso("Imagem selecionada.");
        }
    } catch (erro) {
        if (preparacaoImagem === preparacao) {
            imagemCurso.value = "";
            mostrarAviso("Essa imagem não abriu. Escolha outra.", "erro");
        }
    } finally {
        if (preparacaoImagem === preparacao) {
            definirPreparacaoImagem(null);
        }
    }
});


/* ==================================================
   CARTÕES DE CURSO
   Cria o cartão visual de cada oportunidade cadastrada.
   ================================================== */

function ehLinkSeguro(texto) {
    try {
        const endereco = new URL(texto);
        return endereco.protocol === "https:" || endereco.protocol === "http:";
    } catch (erro) {
        return false;
    }
}

function adicionarLocal(container, texto) {
    const paragrafo = document.createElement("p");
    const destaque = document.createElement("strong");

    destaque.textContent = "Local ou link das aulas: ";
    paragrafo.appendChild(destaque);

    if (texto && ehLinkSeguro(texto)) {
        const link = document.createElement("a");
        link.href = texto;
        link.textContent = texto;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        paragrafo.appendChild(link);
    } else {
        paragrafo.appendChild(criarTexto(texto || "Não informado"));
    }

    container.appendChild(paragrafo);
}

function criarBotaoAcao(texto, acao, curso, classe) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "botao-acao " + classe;
    botao.dataset.acao = acao;
    botao.dataset.id = curso.id;
    botao.textContent = texto;
    botao.setAttribute("aria-label", texto + " o curso " + curso.titulo);

    return botao;
}

// Imagem simples usada quando o curso não tem foto (ou quando a foto não carrega).
function criarImagemPadrao(curso) {
    const padrao = document.createElement("div");

    padrao.className = "imagem-cartao-curso imagem-padrao";
    // É apenas decorativa: o nome do curso já aparece no título do cartão.
    padrao.setAttribute("aria-hidden", "true");
    padrao.textContent = curso.categoria || "Curso";

    return padrao;
}

// Adiciona um par "nome / valor" na lista de dados do cartão.
function criarDadoCurso(lista, nome, valor) {
    const grupo = document.createElement("div");
    const termo = document.createElement("dt");
    const descricao = document.createElement("dd");

    termo.textContent = nome;
    descricao.textContent = valor;
    grupo.append(termo, descricao);
    lista.appendChild(grupo);
}

// Dados principais que aparecem direto no cartão.
function criarDadosCurso(curso) {
    const lista = document.createElement("dl");
    lista.className = "dados-curso";

    if (curso.duracao) {
        criarDadoCurso(lista, "Duração", curso.duracao);
    }
    if (typeof curso.gratuito === "boolean") {
        criarDadoCurso(lista, "Valor", curso.gratuito ? "Gratuito" : "Pago");
    }
    if (curso.faixaEtaria) {
        criarDadoCurso(lista, "Faixa etária", curso.faixaEtaria);
    }
    if (curso.cidade) {
        criarDadoCurso(lista, "Cidade", curso.cidade);
    }
    if (typeof curso.certificado === "boolean") {
        criarDadoCurso(lista, "Certificado", curso.certificado ? "Sim" : "Não");
    }
    if (curso.dataInicio) {
        criarDadoCurso(lista, "Início", formatarDataInicio(curso.dataInicio));
    }

    return lista;
}

// Botão/link de contato direto com a instituição (WhatsApp ou e-mail).
function criarLinkContato(curso) {
    const contato = identificarContato(curso.contato);

    if (!contato) {
        return null;
    }

    const link = document.createElement("a");
    link.className = "botao-contato";

    if (contato.tipo === "email") {
        link.href = "mailto:" + contato.valor;
        link.textContent = "Enviar e-mail";
    } else {
        const mensagem = "Olá! Tenho interesse no curso " + curso.titulo + ".";
        link.href = "https://wa.me/" + contato.valor + "?text=" + encodeURIComponent(mensagem);
        link.textContent = "Falar no WhatsApp";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }

    link.setAttribute(
        "aria-label",
        link.textContent + " com " + (curso.instituicao || "a instituição") +
        " sobre o curso " + curso.titulo
    );

    return link;
}

function criarDetalhesCurso(curso) {
    const conteudos = Array.isArray(curso.conteudos) ? curso.conteudos : [];

    const detalhes = document.createElement("details");
    detalhes.className = "detalhes-curso";

    const resumo = document.createElement("summary");
    resumo.textContent = "Ver detalhes do curso";
    detalhes.appendChild(resumo);

    const corpo = document.createElement("div");
    corpo.className = "conteudo-detalhes-curso";
    detalhes.appendChild(corpo);

    if (conteudos.length > 0) {
        const subtitulo = document.createElement("h4");
        subtitulo.textContent = "Conteúdos aprendidos";
        corpo.appendChild(subtitulo);

        const lista = document.createElement("ul");

        conteudos.forEach(function(conteudo) {
            const item = document.createElement("li");
            item.textContent = conteudo;
            lista.appendChild(item);
        });

        corpo.appendChild(lista);
    }

    adicionarInformacao(corpo, "Requisitos", curso.requisitos || "Não informado");
    adicionarLocal(corpo, curso.localOuLink);

    if (curso.instituicao) {
        adicionarInformacao(corpo, "Instituição", curso.instituicao);
    }

    if (curso.contato) {
        adicionarInformacao(corpo, "Contato", curso.contato);
    }

    if (dataValida(curso.data)) {
        const dataPublicacao = document.createElement("p");
        dataPublicacao.className = "data-cartao-curso";
        dataPublicacao.textContent = "Disponibilizado em " + formatarData(curso.data);
        corpo.appendChild(dataPublicacao);
    }

    return detalhes;
}

function criarCartaoCurso(curso) {
    const vagasDisponiveis = calcularVagasDisponiveis(curso);
    const cartao = document.createElement("article");

    cartao.className = "cartao-curso";

    // Mostra a imagem do curso ou, se não existir, uma imagem padrão.
    if (curso.imagem) {
        const imagem = document.createElement("img");
        imagem.className = "imagem-cartao-curso";
        imagem.alt = "Imagem do curso " + curso.titulo;
        imagem.loading = "lazy";
        imagem.decoding = "async";

        // Se o arquivo da imagem não carregar, troca pela imagem padrão.
        imagem.addEventListener("error", function() {
            if (imagem.isConnected) {
                imagem.replaceWith(criarImagemPadrao(curso));
            }
        });

        carregarImagemCurso(imagem, curso.imagem);
        cartao.appendChild(imagem);
    } else {
        cartao.appendChild(criarImagemPadrao(curso));
    }

    const conteudo = document.createElement("div");
    conteudo.className = "conteudo-cartao-curso";
    cartao.appendChild(conteudo);

    const cabecalho = document.createElement("header");
    cabecalho.className = "cabecalho-cartao-curso";

    const categoria = document.createElement("p");
    categoria.className = "categoria-curso";
    categoria.textContent = curso.categoria;
    cabecalho.appendChild(categoria);

    const titulo = document.createElement("h3");
    titulo.textContent = curso.titulo;
    cabecalho.appendChild(titulo);
    conteudo.appendChild(cabecalho);

    if (curso.descricao) {
        const descricao = document.createElement("p");
        descricao.className = "descricao-curso";
        descricao.textContent = curso.descricao;
        conteudo.appendChild(descricao);
    }

    const informacoes = document.createElement("p");
    informacoes.className = "informacoes-curso";

    const modalidade = document.createElement("span");
    modalidade.textContent = curso.modalidade;

    const vagas = document.createElement("span");
    vagas.textContent = vagasDisponiveis === 1 ? "1 vaga" : vagasDisponiveis + " vagas";

    informacoes.append(modalidade, vagas);
    conteudo.appendChild(informacoes);
    conteudo.appendChild(criarDadosCurso(curso));
    conteudo.appendChild(criarDetalhesCurso(curso));

    const botaoInscricao = document.createElement("button");
    botaoInscricao.type = "button";
    botaoInscricao.className = "botao-inscricao";
    botaoInscricao.dataset.acao = "inscrever";
    botaoInscricao.dataset.id = curso.id;

    if (vagasDisponiveis === 0) {
        botaoInscricao.textContent = "Vagas esgotadas";
        botaoInscricao.disabled = true;
    } else {
        botaoInscricao.textContent = "Quero me inscrever";
        botaoInscricao.setAttribute("aria-label", "Quero me inscrever no curso " + curso.titulo);
    }

    const controles = document.createElement("div");
    controles.className = "controles-cartao-curso";
    controles.appendChild(botaoInscricao);

    const linkContato = criarLinkContato(curso);
    if (linkContato) {
        controles.appendChild(linkContato);
    }

    // Cursos do arquivo cursos.json são só de leitura: não podem ser editados nem excluídos.
    if (curso.origem !== "arquivo") {
        const acoes = document.createElement("div");
        acoes.className = "acoes-cartao";
        acoes.appendChild(criarBotaoAcao("Editar", "editar", curso, "botao-editar"));
        acoes.appendChild(criarBotaoAcao("Excluir", "excluir", curso, "botao-excluir"));
        controles.appendChild(acoes);
    }

    conteudo.appendChild(controles);

    return cartao;
}


/* ==================================================
   LISTAGEM, BUSCA E FILTROS
   Exibe os cursos conforme a pesquisa do visitante.
   ================================================== */

let idsCursosExibidos = [];

function atualizarEstadoFiltros() {
    const filtros = [
        { ativo: Boolean(buscaCurso.value.trim()), wrapper: buscaCurso.closest(".campo-filtro") },
        { ativo: Boolean(filtroCategoria.value), wrapper: filtroCategoria.closest(".campo-filtro") },
        { ativo: Boolean(filtroModalidade.value), wrapper: filtroModalidade.closest(".campo-filtro") },
        { ativo: Boolean(filtroCidade.value), wrapper: filtroCidade.closest(".campo-filtro") },
        { ativo: filtroGratuito.checked, wrapper: filtroGratuito.closest(".campo-filtro") }
    ];

    let existeFiltroAtivo = false;

    filtros.forEach(function(filtro) {
        filtro.wrapper.classList.toggle("ativo", filtro.ativo);
        existeFiltroAtivo = existeFiltroAtivo || filtro.ativo;
    });

    document.querySelector(".filtros-cursos").classList.toggle("filtro-ativo", existeFiltroAtivo);
    return existeFiltroAtivo;
}

// Cria as opções do filtro de cidade a partir dos cursos que existem.
function atualizarOpcoesCidade(cursos) {
    const cidades = Array.from(new Set(
        cursos.map(function(curso) { return curso.cidade; }).filter(Boolean)
    )).sort(function(a, b) { return a.localeCompare(b, "pt-BR"); });

    const atuais = Array.from(filtroCidade.options).slice(1).map(function(opcao) {
        return opcao.value;
    });

    const iguais = cidades.length === atuais.length && cidades.every(function(cidade, indice) {
        return cidade === atuais[indice];
    });

    if (iguais) {
        return;
    }

    const escolhida = filtroCidade.value;
    filtroCidade.length = 1;
    preencherSelect(filtroCidade, cidades);
    filtroCidade.value = cidades.includes(escolhida) ? escolhida : "";
}

function limparFiltros() {
    buscaCurso.value = "";
    filtroCategoria.value = "";
    filtroModalidade.value = "";
    filtroCidade.value = "";
    filtroGratuito.checked = false;
}

function mostrarCursos(animarLista) {
    const cursos = lerCursosPublicos();
    atualizarOpcoesCidade(cursos);

    const existeFiltroAtivo = atualizarEstadoFiltros();

    const textoBusca = buscaCurso.value.trim().toLowerCase();
    const categoriaEscolhida = filtroCategoria.value;
    const modalidadeEscolhida = filtroModalidade.value;
    const cidadeEscolhida = filtroCidade.value;
    const somenteGratuitos = filtroGratuito.checked;

    const cursosFiltrados = cursos.filter(function(curso) {
        const combinaBusca = String(curso.titulo || "").toLowerCase().includes(textoBusca);
        const combinaCategoria = !categoriaEscolhida || curso.categoria === categoriaEscolhida;
        const combinaModalidade = !modalidadeEscolhida || curso.modalidade === modalidadeEscolhida;
        const combinaCidade = !cidadeEscolhida || curso.cidade === cidadeEscolhida;
        const combinaGratuito = !somenteGratuitos || curso.gratuito === true;

        return combinaBusca && combinaCategoria && combinaModalidade && combinaCidade && combinaGratuito;
    });

    const ids = cursosFiltrados.map(function(curso) { return curso.id; });
    const mudouResultado = ids.length !== idsCursosExibidos.length ||
        ids.some(function(id, indice) { return id !== idsCursosExibidos[indice]; });

    idsCursosExibidos = ids;
    if (animarLista && mudouResultado) {
        listaCursos.classList.add("atualizando");
    }

    const total = cursosFiltrados.length;
    const contagem = total === 1 ? "1 curso encontrado" : total + " cursos encontrados";
    if (contadorCursos.textContent !== contagem) {
        contadorCursos.textContent = contagem;
    }

    liberarUrlsImagensCurso(listaCursos);
    listaCursos.innerHTML = "";

    if (total === 0) {
        const estadoVazio = document.createElement("div");
        estadoVazio.className = "estado-vazio-cursos";
        const mensagem = document.createElement("p");
        mensagem.className = "mensagem-vazia";
        mensagem.textContent = existeFiltroAtivo
            ? "Nenhum curso com esses filtros."
            : "Ainda não há cursos disponíveis.";
        estadoVazio.appendChild(mensagem);

        if (existeFiltroAtivo) {
            const botaoLimpar = document.createElement("button");
            botaoLimpar.type = "button";
            botaoLimpar.className = "botao-acao botao-limpar-filtros";
            botaoLimpar.textContent = "Limpar filtros";
            botaoLimpar.addEventListener("click", function() {
                limparFiltros();
                mostrarCursos(true);
                buscaCurso.focus();
            });
            estadoVazio.appendChild(botaoLimpar);
        }

        listaCursos.appendChild(estadoVazio);
        atualizarIndicadores();
        return;
    }

    cursosFiltrados.forEach(function(curso) {
        listaCursos.appendChild(criarCartaoCurso(curso));
    });

    atualizarIndicadores();
}

listaCursos.addEventListener("animationend", function(evento) {
    if (evento.target === listaCursos && evento.animationName === "atualizar-lista-cursos") {
        listaCursos.classList.remove("atualizando");
    }
});

buscaCurso.addEventListener("input", function() {
    mostrarCursos(true);
});

[filtroCategoria, filtroModalidade, filtroCidade, filtroGratuito].forEach(function(filtro) {
    filtro.addEventListener("change", function() {
        mostrarCursos(true);
    });
});


/* ==================================================
   CADASTRO, EDIÇÃO E EXCLUSÃO DE CURSOS
   Salva, altera e remove os cursos do localStorage.
   ================================================== */

function buscarCurso(id) {
    return lerCursos().find(function(curso) {
        return curso.id === id;
    });
}

function sairModoEdicao() {
    cursoIdEdicao.value = "";
    formularioCadastroCurso.reset();
    restaurarPreviaImagem("");

    atualizarValidadeContato();

    tituloFormularioCurso.textContent = "Disponibilizar um curso";
    botaoSalvarCurso.textContent = "Disponibilizar curso";
    botaoCancelarEdicao.hidden = true;
    avisoModeracao.hidden = false;
}

function iniciarEdicaoCurso(id) {
    if (salvandoCurso) {
        mostrarAviso("Aguarde enquanto o curso é salvo.", "info");
        return;
    }

    const curso = buscarCurso(id);

    if (!curso) {
        mostrarAviso("Curso não encontrado.", "erro");
        return;
    }

    limparErrosFormulario(formularioCadastroCurso);
    cursoIdEdicao.value = curso.id;
    document.getElementById("tituloCurso").value = curso.titulo;
    document.getElementById("categoriaCurso").value = curso.categoria;
    document.getElementById("vagasCurso").value = curso.vagas;
    document.getElementById("modalidadeCurso").value = curso.modalidade;
    document.getElementById("descricaoCurso").value = curso.descricao || "";
    document.getElementById("conteudosCurso").value = (curso.conteudos || []).join("\n");
    document.getElementById("duracaoCurso").value = curso.duracao || "";
    document.getElementById("requisitosCurso").value = curso.requisitos || "";
    document.getElementById("localCurso").value = curso.localOuLink || "";
    document.getElementById("instituicaoCurso").value = curso.instituicao || "";
    document.getElementById("cidadeCurso").value = curso.cidade || "";
    document.getElementById("gratuitoCurso").value = curso.gratuito === true ? "sim" : (curso.gratuito === false ? "nao" : "");
    document.getElementById("faixaEtariaCurso").value = curso.faixaEtaria || "";
    document.getElementById("certificadoCurso").value = curso.certificado === true ? "sim" : (curso.certificado === false ? "nao" : "");
    document.getElementById("dataInicioCurso").value = curso.dataInicio || "";
    contatoCurso.value = curso.contato || "";
    atualizarValidadeContato();

    // Mantém a imagem atual, a menos que uma nova seja escolhida.
    imagemCurso.value = "";
    restaurarPreviaImagem(curso.imagem || "");

    tituloFormularioCurso.textContent = "Editar curso";
    botaoSalvarCurso.textContent = "Salvar alterações";
    botaoCancelarEdicao.hidden = false;
    avisoModeracao.hidden = true;

    definirCadastroAberto(true);
    document.getElementById("cadastro-curso").scrollIntoView({ behavior: "smooth" });
    document.getElementById("tituloCurso").focus({ preventScroll: true });
    mostrarAviso("Edite o curso e salve as mudanças.", "info");
}

async function excluirCurso(id) {
    const curso = buscarCurso(id);

    if (!curso) {
        mostrarAviso("Curso não encontrado.", "erro");
        return;
    }

    const totalInscricoes = contarInscricoesDoCurso(id);
    const texto = totalInscricoes > 0
        ? "O curso \"" + curso.titulo + "\" tem " + totalInscricoes +
          " inscrição(ões) neste navegador, que também serão apagadas. Esta ação não pode ser desfeita."
        : "O curso \"" + curso.titulo + "\" será removido. Esta ação não pode ser desfeita.";

    const confirmou = await confirmarAcao(
        "Excluir este curso?",
        texto,
        "Sim, excluir"
    );

    if (!confirmou) {
        return;
    }

    // Anima a saída do cartão antes de remover o curso.
    const botaoExcluir = listaCursos.querySelector(
        'button[data-acao="excluir"][data-id="' + id + '"]'
    );
    const cartaoCurso = botaoExcluir ? botaoExcluir.closest(".cartao-curso") : null;

    if (cartaoCurso) {
        cartaoCurso.classList.add("saindo");
        await new Promise(function(resolver) {
            setTimeout(resolver, 350);
        });
    }

    const cursos = lerCursos();
    const cursoRemovido = cursos.find(function(item) { return item.id === id; });
    const cursosRestantes = cursos.filter(function(item) {
        return item.id !== id;
    });

    if (!gravarCursos(cursosRestantes)) {
        cartaoCurso?.classList.remove("saindo");
        return;
    }

    descartarImagemOriginal(cursoRemovido?.imagem);

    if (totalInscricoes > 0) {
        gravarInscricoes(lerInscricoes().filter(function(inscricao) {
            return inscricao.cursoId !== id;
        }));
    }

    // Fecha formulários que ainda usavam o curso excluído.
    if (cursoIdEdicao.value === id) {
        sairModoEdicao();
    }

    if (cursoIdInscricao.value === id) {
        formularioInscricao.reset();
        fecharFormularioInscricao();
    }

    mostrarCursos();
    mostrarInscricoes();
    mostrarAviso("Curso excluído.");
}

botaoCancelarEdicao.addEventListener("click", function() {
    sairModoEdicao();
    mostrarAviso("Edição cancelada.", "info");
});

formularioCadastroCurso.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    atualizarValidadeContato();

    if (preparacaoImagem || salvandoCurso || !validarFormulario(formularioCadastroCurso)) {
        return;
    }

    const idEdicao = cursoIdEdicao.value;

    const dados = {
        titulo: document.getElementById("tituloCurso").value.trim(),
        categoria: document.getElementById("categoriaCurso").value,
        vagas: Number(document.getElementById("vagasCurso").value),
        modalidade: document.getElementById("modalidadeCurso").value,
        descricao: document.getElementById("descricaoCurso").value.trim(),
        conteudos: document.getElementById("conteudosCurso").value
            .split("\n")
            .map(function(linha) { return linha.trim(); })
            .filter(function(linha) { return linha !== ""; }),
        duracao: document.getElementById("duracaoCurso").value.trim(),
        requisitos: document.getElementById("requisitosCurso").value.trim(),
        localOuLink: document.getElementById("localCurso").value.trim(),
        instituicao: document.getElementById("instituicaoCurso").value.trim(),
        cidade: document.getElementById("cidadeCurso").value.trim(),
        gratuito: document.getElementById("gratuitoCurso").value === "sim",
        faixaEtaria: document.getElementById("faixaEtariaCurso").value.trim(),
        certificado: document.getElementById("certificadoCurso").value === "sim",
        dataInicio: document.getElementById("dataInicioCurso").value,
        contato: contatoCurso.value.trim(),
        imagem: ""
    };

    if (dados.vagas < 1) {
        mostrarAviso("Informe pelo menos uma vaga.", "erro");
        return;
    }

    if (novaImagemCurso) {
        definirSalvamentoCurso(true);

        try {
            dados.imagem = await salvarImagemOriginal(novaImagemCurso);
        } catch (erro) {
            const mensagem = erro?.name === "QuotaExceededError"
                ? "O navegador está sem espaço para salvar."
                : "Não deu para salvar a imagem.";
            mostrarAviso(mensagem, "erro");
            return;
        } finally {
            definirSalvamentoCurso(false);
        }
    }

    const referenciaNovaImagem = dados.imagem;
    const cursos = lerCursos();
    let imagemAnterior = "";

    if (idEdicao) {
        const posicao = cursos.findIndex(function(curso) {
            return curso.id === idEdicao;
        });

        if (posicao === -1) {
            descartarImagemOriginal(referenciaNovaImagem);
            mostrarAviso("Este curso não existe mais.", "erro");
            sairModoEdicao();
            mostrarCursos();
            return;
        }

        // O total de vagas não pode ficar menor que as inscrições já feitas.
        const inscritos = contarInscricoesDoCurso(idEdicao);

        if (dados.vagas < inscritos) {
            descartarImagemOriginal(referenciaNovaImagem);
            mostrarAviso(
                "Informe pelo menos " + inscritos + (inscritos === 1 ? " vaga. Já há uma inscrição." : " vagas para quem já se inscreveu."),
                "erro"
            );
            return;
        }

        imagemAnterior = cursos[posicao].imagem || "";
        dados.imagem = referenciaNovaImagem || imagemAnterior;
        cursos[posicao] = Object.assign({}, cursos[posicao], dados);
    } else {
        // Cursos novos ficam "pendentes" até o responsável aprovar.
        cursos.unshift(Object.assign({
            id: criarId(),
            data: new Date().toISOString(),
            status: STATUS_PENDENTE
        }, dados));
    }

    if (!gravarCursos(cursos)) {
        descartarImagemOriginal(referenciaNovaImagem);
        return;
    }

    if (referenciaNovaImagem) {
        descartarImagemOriginal(imagemAnterior);
    }

    if (idEdicao) {
        // Mantém o nome do curso atualizado nas inscrições já feitas.
        const inscricoes = lerInscricoes();

        inscricoes.forEach(function(inscricao) {
            if (inscricao.cursoId === idEdicao) {
                inscricao.cursoTitulo = dados.titulo;
            }
        });

        gravarInscricoes(inscricoes);
    }

    sairModoEdicao();
    mostrarCursos();

    if (idEdicao) {
        mostrarInscricoes();
        mostrarAviso("Alterações salvas.");
        document.getElementById("cursos").scrollIntoView({ behavior: "smooth" });
    } else {
        // O curso novo ainda não aparece na lista pública: precisa de aprovação.
        mostrarAviso("Curso enviado! Agora é só aguardar a aprovação.");
        definirCadastroAberto(false);
    }
});

// Confere se o contato é um e-mail ou um WhatsApp válido.
function atualizarValidadeContato() {
    const texto = contatoCurso.value.trim();

    if (texto && !identificarContato(texto)) {
        contatoCurso.setCustomValidity("Informe um e-mail válido ou um WhatsApp com DDD, como (45) 99999-9999.");
    } else {
        contatoCurso.setCustomValidity("");
    }
}

// Este listener fica no próprio campo, então roda antes da revalidação do formulário.
contatoCurso.addEventListener("input", atualizarValidadeContato);


/* ==================================================
   FORMULÁRIO DE INSCRIÇÃO
   Abre a inscrição e controla as vagas disponíveis.
   ================================================== */

function abrirFormularioInscricao(idCurso) {
    // Só é possível se inscrever em cursos que aparecem na lista pública.
    const curso = buscarCursoPublico(idCurso);

    if (!curso) {
        mostrarAviso("Curso não encontrado.", "erro");
        return;
    }

    const vagasDisponiveis = calcularVagasDisponiveis(curso);

    if (vagasDisponiveis === 0) {
        mostrarAviso("As vagas deste curso acabaram.", "erro");
        mostrarCursos();
        return;
    }

    limparErrosFormulario(formularioInscricao);
    cursoIdInscricao.value = curso.id;
    cursoSelecionado.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = curso.titulo;

    const informacoes = document.createElement("p");
    informacoes.textContent =
        curso.categoria + " • " + curso.modalidade + " • " +
        vagasDisponiveis + " vaga(s) disponível(is)";

    cursoSelecionado.appendChild(titulo);
    cursoSelecionado.appendChild(informacoes);

    areaInscricao.hidden = false;
    areaInscricao.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("nomeCompleto").focus();
}

listaCursos.addEventListener("click", function(evento) {
    const botao = evento.target.closest("button[data-acao]");

    if (!botao || botao.disabled) {
        return;
    }

    const id = botao.dataset.id;
    const acao = botao.dataset.acao;

    if (acao === "inscrever") {
        abrirFormularioInscricao(id);
    } else if (acao === "editar") {
        iniciarEdicaoCurso(id);
    } else if (acao === "excluir") {
        excluirCurso(id);
    }
});

function fecharFormularioInscricao() {
    limparErrosFormulario(formularioInscricao);
    areaInscricao.hidden = true;
    cursoSelecionado.innerHTML = "";
    cursoIdInscricao.value = "";
    atualizarAvisoMenor();
}

// Mostra o aviso quando a data de nascimento indica menos de 18 anos.
function atualizarAvisoMenor() {
    const idade = calcularIdade(dataNascimentoInscricao.value);
    avisoMenorIdade.hidden = !(idade !== null && idade >= 0 && idade < 18);
}

dataNascimentoInscricao.addEventListener("input", atualizarAvisoMenor);
dataNascimentoInscricao.addEventListener("change", atualizarAvisoMenor);

// O telefone precisa ter DDD + número (10 ou 11 dígitos).
function atualizarValidadeTelefone() {
    const digitos = telefoneInscricao.value.replace(/\D/g, "");

    if (digitos && (digitos.length < 10 || digitos.length > 11)) {
        telefoneInscricao.setCustomValidity("Informe um telefone com DDD, como (45) 99999-9999.");
    } else {
        telefoneInscricao.setCustomValidity("");
    }
}

telefoneInscricao.addEventListener("input", function(evento) {
    const valor = telefoneInscricao.value;
    const codigoPais = /^\s*\+55/.exec(valor);
    const inicioNumero = codigoPais ? codigoPais[0].length : 0;
    const digitos = valor.slice(inicioNumero).replace(/\D/g, "").slice(0, 11);
    const ddd = digitos.slice(0, 2);
    const corte = digitos.length === 11 ? 7 : 6;
    const prefixo = digitos.slice(2, corte);
    const sufixo = digitos.slice(corte);
    let telefoneFormatado = ddd ? "(" + ddd : "";

    if (prefixo) {
        telefoneFormatado += ") " + prefixo;
    }

    if (sufixo) {
        telefoneFormatado += "-" + sufixo;
    }

    if (valor === telefoneFormatado) {
        return;
    }

    const cursor = telefoneInscricao.selectionStart;
    telefoneInscricao.value = telefoneFormatado;

    if (cursor !== null && cursor < valor.length) {
        // Mantém o cursor junto ao mesmo dígito ao editar no meio do número.
        const digitosAntesDoCursor = valor.slice(inicioNumero, cursor).replace(/\D/g, "").length;
        const posicoesDosDigitos = Array.from(telefoneFormatado.matchAll(/\d/g));
        const digitoAnterior = posicoesDosDigitos[digitosAntesDoCursor - 1];
        const proximoDigito = posicoesDosDigitos[digitosAntesDoCursor];
        let novaPosicao = digitoAnterior ? digitoAnterior.index + 1 : 0;
        if (evento.inputType === "deleteContentForward" && proximoDigito) {
            novaPosicao = proximoDigito.index;
        }
        telefoneInscricao.setSelectionRange(novaPosicao, novaPosicao);
    }
});

// Roda depois da máscara do telefone (que está logo acima), pois usa o valor já formatado.
telefoneInscricao.addEventListener("input", atualizarValidadeTelefone);

botaoCancelarInscricao.addEventListener("click", function() {
    formularioInscricao.reset();
    fecharFormularioInscricao();
});

formularioInscricao.addEventListener("submit", function(evento) {
    evento.preventDefault();

    atualizarValidadeTelefone();

    if (!validarFormulario(formularioInscricao)) {
        return;
    }

    const idCurso = cursoIdInscricao.value;
    const curso = buscarCursoPublico(idCurso);

    if (!curso) {
        mostrarAviso("Curso não encontrado.", "erro");
        return;
    }

    if (calcularVagasDisponiveis(curso) === 0) {
        mostrarAviso("As vagas deste curso acabaram.", "erro");
        fecharFormularioInscricao();
        mostrarCursos();
        return;
    }

    const email = document.getElementById("emailInscricao").value.trim().toLowerCase();
    const inscricoes = lerInscricoes();

    // Impede inscrição repetida no mesmo curso pelo mesmo e-mail OU pelo mesmo telefone.
    const digitosTelefone = telefoneInscricao.value.replace(/\D/g, "");

    const inscricaoDuplicada = inscricoes.some(function(inscricao) {
        const mesmoEmail = inscricao.email === email;
        const mesmoTelefone = Boolean(digitosTelefone) &&
            String(inscricao.telefone || "").replace(/\D/g, "") === digitosTelefone;

        return inscricao.cursoId === idCurso && (mesmoEmail || mesmoTelefone);
    });

    if (inscricaoDuplicada) {
        mostrarAviso("Já existe uma inscrição neste curso com esse e-mail ou telefone.", "erro");
        return;
    }

    const novaInscricao = {
        id: criarId(),
        cursoId: idCurso,
        cursoTitulo: curso.titulo,
        nome: document.getElementById("nomeCompleto").value.trim(),
        dataNascimento: document.getElementById("dataNascimento").value,
        email: email,
        telefone: telefoneInscricao.value.trim(),
        cidade: document.getElementById("cidadeInscricao").value.trim(),
        escolaridade: document.getElementById("escolaridadeInscricao").value,
        data: new Date().toISOString()
    };

    inscricoes.unshift(novaInscricao);

    if (!gravarInscricoes(inscricoes)) {
        return;
    }

    formularioInscricao.reset();
    fecharFormularioInscricao();
    mostrarCursos();
    mostrarInscricoes();

    mostrarAviso("Inscrição confirmada!", "sucesso");
    document.getElementById("minhas-inscricoes").scrollIntoView({ behavior: "smooth" });
});


/* ==================================================
   LISTA DE INSCRIÇÕES
   Mostra as inscrições guardadas neste navegador.
   ================================================== */

function mostrarInscricoes() {
    const inscricoes = lerInscricoes();
    listaInscricoes.innerHTML = "";

    // O botão de apagar só faz sentido quando existem inscrições salvas.
    botaoApagarInscricoes.hidden = inscricoes.length === 0;

    if (inscricoes.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "mensagem-vazia";
        mensagem.textContent = "Você ainda não se inscreveu em nenhum curso.";
        listaInscricoes.appendChild(mensagem);
        atualizarIndicadores();
        return;
    }

    inscricoes.forEach(function(inscricao) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-inscricao";

        const titulo = document.createElement("h3");
        titulo.textContent = inscricao.cursoTitulo;
        cartao.appendChild(titulo);

        adicionarInformacao(cartao, "Nome", inscricao.nome);
        adicionarInformacao(cartao, "E-mail", inscricao.email);
        adicionarInformacao(cartao, "Cidade", inscricao.cidade);
        adicionarInformacao(cartao, "Inscrição realizada em", formatarData(inscricao.data));

        // Permite cancelar apenas esta inscrição.
        const botaoCancelar = document.createElement("button");
        botaoCancelar.type = "button";
        botaoCancelar.className = "botao-acao botao-cancelar-inscricao";
        botaoCancelar.dataset.inscricaoId = inscricao.id;
        botaoCancelar.textContent = "Cancelar inscrição";
        botaoCancelar.setAttribute("aria-label", "Cancelar inscrição no curso " + inscricao.cursoTitulo);
        cartao.appendChild(botaoCancelar);

        listaInscricoes.appendChild(cartao);
    });

    atualizarIndicadores();
}

// Cancela uma inscrição específica.
listaInscricoes.addEventListener("click", async function(evento) {
    const botao = evento.target.closest("button[data-inscricao-id]");

    if (!botao) {
        return;
    }

    const id = botao.dataset.inscricaoId;
    const inscricao = lerInscricoes().find(function(item) { return item.id === id; });

    if (!inscricao) {
        return;
    }

    const confirmou = await confirmarAcao(
        "Cancelar esta inscrição?",
        "Sua inscrição no curso \"" + inscricao.cursoTitulo + "\" será apagada e a vaga ficará livre para outra pessoa.",
        "Sim, cancelar"
    );

    if (!confirmou) {
        return;
    }

    const restantes = lerInscricoes().filter(function(item) { return item.id !== id; });

    if (!gravarInscricoes(restantes)) {
        return;
    }

    mostrarCursos();
    mostrarInscricoes();
    mostrarAviso("Inscrição cancelada.");
});

// Apaga todas as inscrições salvas neste navegador (direito de exclusão da LGPD).
botaoApagarInscricoes.addEventListener("click", async function() {
    const confirmou = await confirmarAcao(
        "Apagar todas as suas inscrições?",
        "Isso apaga as inscrições deste navegador e libera as vagas. Não dá para desfazer.",
        "Sim, apagar tudo"
    );

    if (!confirmou) {
        return;
    }

    if (!gravarInscricoes([])) {
        return;
    }

    mostrarCursos();
    mostrarInscricoes();
    mostrarAviso("Inscrições apagadas.");
});


/* ==================================================
   INDICADORES
   Calcula números usando apenas os cursos aprovados.
   ================================================== */

function atualizarIndicadores() {
    const cursos = lerCursosPublicos();
    const inscricoes = lerInscricoes();

    const totalVagas = cursos.reduce(function(total, curso) {
        return total + calcularVagasDisponiveis(curso);
    }, 0);

    // Instituições diferentes que oferecem cursos (ignora maiúsculas e minúsculas).
    const instituicoes = new Set(
        cursos
            .map(function(curso) { return String(curso.instituicao || "").trim().toLowerCase(); })
            .filter(Boolean)
    );

    indicadorCursos.textContent = cursos.length;
    indicadorVagas.textContent = totalVagas;
    indicadorInscricoes.textContent = inscricoes.length;
    indicadorInstituicoes.textContent = instituicoes.size;
}


/* ==================================================
   MODERAÇÃO DE CURSOS (SIMULAÇÃO)
   O responsável aprova ou rejeita os cursos pendentes.
   Lembrete: sem servidor, isto NÃO é segurança de verdade.
   ================================================== */

const secaoModeracao = document.getElementById("moderacao");
const loginResponsavel = document.getElementById("formularioModeracao");
const senhaResponsavel = document.getElementById("senhaModeracao");
const erroLogin = document.getElementById("erroSenhaModeracao");

function abrirLogin() {
    if (acessoResponsavel.ativo()) {
        location.assign("responsavel.html");
        return;
    }
    secaoModeracao.hidden = false;
    secaoModeracao.scrollIntoView({block:"center"});
    senhaResponsavel.focus({preventScroll:true});
}
document.getElementById("botaoAbrirModeracao").addEventListener("click", abrirLogin);
document.getElementById("botaoFecharModeracao").addEventListener("click", () => {
    secaoModeracao.hidden = true;
    erroLogin.hidden = true;
    loginResponsavel.reset();
    document.getElementById("botaoAbrirModeracao").focus();
});
loginResponsavel.addEventListener("submit", async evento => {
    evento.preventDefault();
    try {
        if (await acessoResponsavel.entrar(senhaResponsavel.value)) {
            senhaResponsavel.value = "";
            location.assign("responsavel.html");
            return;
        }
        erroLogin.textContent = "Senha incorreta. Tente de novo.";
    } catch {
        erroLogin.textContent = "Abra o link HTTPS do site e permita o armazenamento no navegador.";
    }
    erroLogin.hidden = false;
    senhaResponsavel.select();
});
if (location.hash === "#moderacao") abrirLogin();
function atualizarAoVoltar() {
    mostrarCursos();
    mostrarInscricoes();
}
window.addEventListener("pageshow", atualizarAoVoltar);
window.addEventListener("storage", evento => {
    if (!evento.key || [CHAVE_CURSOS, CHAVE_INSCRICOES].includes(evento.key)) atualizarAoVoltar();
});

/* ==================================================
   INICIALIZAÇÃO
   Carrega cursos, inscrições e indicadores ao abrir a página.
   ================================================== */

// Data de hoje no formato AAAA-MM-DD (usada para bloquear nascimento no futuro).
function dataDeHoje() {
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
    return agora.toISOString().slice(0, 10);
}

async function iniciarSite() {
    preencherListasFixas();
    dataNascimentoInscricao.max = dataDeHoje();

    // Busca os cursos de exemplo no cursos.json e junta com os do navegador.
    await carregarCursosDoArquivo();

    if (arquivoCursosCarregado) {
        removerExemplosAntigos();
    }

    mostrarCursos();
    mostrarInscricoes();
}

iniciarSite();


/* ==================================================
   ABERTURA DO FORMULÁRIO DE CURSO
   ================================================== */
const botaoAbrirCadastro = document.getElementById("botaoAbrirCadastro");
const painelCadastro = document.querySelector(".cadastro-painel");
const superficieCadastro = document.getElementById("superficieCadastroCurso");
const rotuloBotaoCadastro = botaoAbrirCadastro.querySelector(".cadastro-toggle-label");

function definirCadastroAberto(aberto) {
    if (!aberto && superficieCadastro.contains(document.activeElement)) {
        botaoAbrirCadastro.focus({ preventScroll: true });
    }

    painelCadastro.classList.toggle("aberto", aberto);
    superficieCadastro.inert = !aberto;
    botaoAbrirCadastro.setAttribute("aria-expanded", String(aberto));
    rotuloBotaoCadastro.textContent = aberto ? "Fechar formulário" : "Abrir formulário";
}

botaoAbrirCadastro.addEventListener("click", function() {
    definirCadastroAberto(!painelCadastro.classList.contains("aberto"));
});


/* ==================================================
   NAVEGAÇÃO ATIVA
   Mantém o link correspondente à seção atual destacado.
   ================================================== */
const linksMenu = Array.from(document.querySelectorAll(".menu a"));
const secoesNavegacao = ["cursos", "cadastro-curso", "impacto"]
    .map(function(id) { return document.getElementById(id); })
    .filter(Boolean);

function marcarLinkAtivo(id) {
    linksMenu.forEach(function(link) {
        const corresponde = link.getAttribute("href") === "#" + id;
        link.classList.toggle("ativo", corresponde);

        if (corresponde) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function atualizarLinkAtivo() {
    if (window.scrollY < 180) {
        marcarLinkAtivo("topo");
        return;
    }

    let secaoAtual = "cursos";

    secoesNavegacao.forEach(function(secao) {
        if (secao.getBoundingClientRect().top <= 150) {
            secaoAtual = secao.id;
        }
    });

    marcarLinkAtivo(secaoAtual);
}

linksMenu.forEach(function(link) {
    link.addEventListener("click", function() {
        const destino = link.getAttribute("href").slice(1);
        marcarLinkAtivo(destino);
    });
});

// Um único listener de rolagem, executado no máximo uma vez por quadro.
let rolagemPendente = false;

function aoRolar() {
    if (rolagemPendente) {
        return;
    }

    rolagemPendente = true;

    requestAnimationFrame(function() {
        rolagemPendente = false;
        atualizarNavbar();
        atualizarLinkAtivo();
    });
}

window.addEventListener("scroll", aoRolar, { passive: true });
atualizarLinkAtivo();


/* ==================================================
   MENU MOBILE: AJUSTES EXTRAS
   Fecha ao tocar fora do menu e ao voltar para tela grande.
   ================================================== */
document.addEventListener("click", function(evento) {
    if (!menuPrincipal.classList.contains("aberto")) {
        return;
    }

    if (menuPrincipal.contains(evento.target) || botaoMenu.contains(evento.target)) {
        return;
    }

    fecharMenuMobile();
});