/* ==================================================
   CONFIGURAÇÕES E ELEMENTOS DO SITE
   ================================================== */

// Chaves usadas para guardar os dados no localStorage.
const CHAVE_CURSOS = "educasim_cursos";
const CHAVE_INSCRICOES = "educasim_inscricoes";
const CHAVE_EXEMPLOS_CURSOS = "educasim_exemplos_cursos_v1";
const IMAGENS_CURSOS_DEMONSTRATIVOS = {
    "exemplo-informatica": "imagens/informatica.png",
    "exemplo-administrativo": "imagens/administrativo.png",
    "exemplo-turismo": "imagens/turismo.png",
    "exemplo-saude": "imagens/saude.png"
};

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
const contadorCursos = document.getElementById("contadorCursos");

// Elementos do formulário de inscrição.
const formularioInscricao = document.getElementById("formularioInscricao");
const areaInscricao = document.getElementById("area-inscricao");
const cursoSelecionado = document.getElementById("cursoSelecionado");
const cursoIdInscricao = document.getElementById("cursoIdInscricao");
const botaoCancelarInscricao = document.getElementById("botaoCancelarInscricao");
const telefoneInscricao = document.getElementById("telefoneInscricao");

// Elementos da lista de inscrições e dos indicadores.
const listaInscricoes = document.getElementById("listaInscricoes");
const indicadorCursos = document.getElementById("indicadorCursos");
const indicadorVagas = document.getElementById("indicadorVagas");
const indicadorInscricoes = document.getElementById("indicadorInscricoes");
const indicadorCadastros = document.getElementById("indicadorCadastros");

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
            ? "O armazenamento deste navegador está cheio. As informações já salvas foram mantidas."
            : "Não foi possível salvar os dados neste navegador.";
        mostrarAviso(mensagem, "erro");
        return false;
    }
}

function lerCursos() {
    return lerLista(CHAVE_CURSOS);
}

function gravarCursos(cursos) {
    return gravarLista(CHAVE_CURSOS, cursos);
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
        return "Informe um valor de no máximo " + campo.max + ".";
    }
    if (validade.stepMismatch && campo.type === "number") {
        return "Informe um número inteiro.";
    }
    if (validade.tooLong) {
        return "Use no máximo " + campo.maxLength + " caracteres.";
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

    if (!arquivo.type.startsWith("image/")) {
        definirPreparacaoImagem(null);
        imagemCurso.value = "";
        mostrarAviso("Escolha um arquivo de imagem válido.", "erro");
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
            mostrarAviso("Imagem selecionada com sucesso.");
        }
    } catch (erro) {
        if (preparacaoImagem === preparacao) {
            imagemCurso.value = "";
            mostrarAviso("Não foi possível preparar esta imagem. Escolha outro arquivo.", "erro");
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

function criarDetalhesCurso(curso) {
    const conteudos = Array.isArray(curso.conteudos) ? curso.conteudos : [];
    const temDetalhes = conteudos.length > 0 || curso.duracao || curso.requisitos || curso.local;

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

    if (temDetalhes) {
        adicionarInformacao(corpo, "Duração", curso.duracao || "Não informado");
        adicionarInformacao(corpo, "Requisitos", curso.requisitos || "Não informado");
        adicionarLocal(corpo, curso.local);
    }

    const dataPublicacao = document.createElement("p");
    dataPublicacao.className = "data-cartao-curso";
    dataPublicacao.textContent = "Disponibilizado em " + formatarData(curso.data);
    corpo.appendChild(dataPublicacao);

    return detalhes;
}

function criarCartaoCurso(curso) {
    const vagasDisponiveis = calcularVagasDisponiveis(curso);
    const cartao = document.createElement("article");

    cartao.className = "cartao-curso";

    // Mostra a imagem somente quando o curso possui uma imagem salva.
    if (curso.imagem) {
        const imagem = document.createElement("img");
        imagem.className = "imagem-cartao-curso";
        imagem.alt = "Imagem do curso " + curso.titulo;
        imagem.loading = "lazy";
        imagem.decoding = "async";
        carregarImagemCurso(imagem, curso.imagem);
        cartao.appendChild(imagem);
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
    }

    const controles = document.createElement("div");
    controles.className = "controles-cartao-curso";
    controles.appendChild(botaoInscricao);

    const acoes = document.createElement("div");
    acoes.className = "acoes-cartao";
    acoes.appendChild(criarBotaoAcao("Editar", "editar", curso, "botao-editar"));
    acoes.appendChild(criarBotaoAcao("Excluir", "excluir", curso, "botao-excluir"));
    controles.appendChild(acoes);
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
        { elemento: buscaCurso, wrapper: buscaCurso.closest(".campo-filtro") },
        { elemento: filtroCategoria, wrapper: filtroCategoria.closest(".campo-filtro") },
        { elemento: filtroModalidade, wrapper: filtroModalidade.closest(".campo-filtro") }
    ];

    let existeFiltroAtivo = false;

    filtros.forEach(function(filtro) {
        const ativo = Boolean(filtro.elemento.value.trim());
        filtro.wrapper.classList.toggle("ativo", ativo);
        existeFiltroAtivo = existeFiltroAtivo || ativo;
    });

    document.querySelector(".filtros-cursos").classList.toggle("filtro-ativo", existeFiltroAtivo);
    return existeFiltroAtivo;
}

function mostrarCursos(animarLista) {
    const existeFiltroAtivo = atualizarEstadoFiltros();

    const cursos = lerCursos();
    const textoBusca = buscaCurso.value.trim().toLowerCase();
    const categoriaEscolhida = filtroCategoria.value;
    const modalidadeEscolhida = filtroModalidade.value;

    const cursosFiltrados = cursos.filter(function(curso) {
        const combinaBusca = curso.titulo.toLowerCase().includes(textoBusca);
        const combinaCategoria = !categoriaEscolhida || curso.categoria === categoriaEscolhida;
        const combinaModalidade = !modalidadeEscolhida || curso.modalidade === modalidadeEscolhida;

        return combinaBusca && combinaCategoria && combinaModalidade;
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
            ? "Nenhum curso encontrado para esses filtros"
            : "Nenhum curso disponível no momento.";
        estadoVazio.appendChild(mensagem);

        if (existeFiltroAtivo) {
            const botaoLimpar = document.createElement("button");
            botaoLimpar.type = "button";
            botaoLimpar.className = "botao-acao botao-limpar-filtros";
            botaoLimpar.textContent = "Limpar filtros";
            botaoLimpar.addEventListener("click", function() {
                buscaCurso.value = "";
                filtroCategoria.value = "";
                filtroModalidade.value = "";
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

filtroCategoria.addEventListener("change", function() {
    mostrarCursos(true);
});

filtroModalidade.addEventListener("change", function() {
    mostrarCursos(true);
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

    tituloFormularioCurso.textContent = "Disponibilizar um curso";
    botaoSalvarCurso.textContent = "Disponibilizar curso";
    botaoCancelarEdicao.hidden = true;
}

function iniciarEdicaoCurso(id) {
    if (salvandoCurso) {
        mostrarAviso("Aguarde a gravação do curso atual.", "info");
        return;
    }

    const curso = buscarCurso(id);

    if (!curso) {
        mostrarAviso("Não foi possível encontrar este curso.", "erro");
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
    document.getElementById("localCurso").value = curso.local || "";

    // Mantém a imagem atual, a menos que uma nova seja escolhida.
    imagemCurso.value = "";
    restaurarPreviaImagem(curso.imagem || "");

    tituloFormularioCurso.textContent = "Editar curso";
    botaoSalvarCurso.textContent = "Salvar alterações";
    botaoCancelarEdicao.hidden = false;

    definirCadastroAberto(true);
    document.getElementById("cadastro-curso").scrollIntoView({ behavior: "smooth" });
    document.getElementById("tituloCurso").focus({ preventScroll: true });
    mostrarAviso("Você está editando o curso. Salve ou cancele a edição.", "info");
}

async function excluirCurso(id) {
    const curso = buscarCurso(id);

    if (!curso) {
        mostrarAviso("Não foi possível encontrar este curso.", "erro");
        return;
    }

    const totalInscricoes = contarInscricoesDoCurso(id);
    const texto = totalInscricoes > 0
        ? "O curso \"" + curso.titulo + "\" tem " + totalInscricoes +
          " inscrição(ões) neste navegador, que também serão apagadas. Esta ação não pode ser desfeita."
        : "O curso \"" + curso.titulo + "\" será removido. Esta ação não pode ser desfeita.";

    const confirmou = await confirmarAcao(
        "Tem certeza de que deseja excluir este curso?",
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
    mostrarAviso("Curso excluído com sucesso.");
}

botaoCancelarEdicao.addEventListener("click", function() {
    sairModoEdicao();
    mostrarAviso("Edição cancelada.", "info");
});

formularioCadastroCurso.addEventListener("submit", async function(evento) {
    evento.preventDefault();

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
        local: document.getElementById("localCurso").value.trim(),
        imagem: ""
    };

    if (dados.vagas < 1) {
        mostrarAviso("A quantidade de vagas deve ser maior que zero.", "erro");
        return;
    }

    if (novaImagemCurso) {
        definirSalvamentoCurso(true);

        try {
            dados.imagem = await salvarImagemOriginal(novaImagemCurso);
        } catch (erro) {
            const mensagem = erro?.name === "QuotaExceededError"
                ? "O armazenamento deste navegador está cheio. As informações já salvas foram mantidas."
                : "Não foi possível guardar a imagem original neste navegador.";
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
                "Este curso já tem " + inscritos + " inscrição(ões). O total de vagas não pode ser menor que isso.",
                "erro"
            );
            return;
        }

        imagemAnterior = cursos[posicao].imagem || "";
        dados.imagem = referenciaNovaImagem || imagemAnterior;
        cursos[posicao] = Object.assign({}, cursos[posicao], dados);
    } else {
        cursos.unshift(Object.assign({
            id: criarId(),
            data: new Date().toISOString()
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
        mostrarAviso("Curso atualizado com sucesso.");
    } else {
        mostrarAviso("Curso cadastrado com sucesso.");
    }

    document.getElementById("cursos").scrollIntoView({ behavior: "smooth" });
});


/* ==================================================
   FORMULÁRIO DE INSCRIÇÃO
   Abre a inscrição e controla as vagas disponíveis.
   ================================================== */

function abrirFormularioInscricao(idCurso) {
    const curso = lerCursos().find(function(item) {
        return item.id === idCurso;
    });

    if (!curso) {
        mostrarAviso("Não foi possível encontrar este curso.", "erro");
        return;
    }

    const vagasDisponiveis = calcularVagasDisponiveis(curso);

    if (vagasDisponiveis === 0) {
        mostrarAviso("As vagas deste curso já estão esgotadas.", "erro");
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

botaoCancelarInscricao.addEventListener("click", function() {
    formularioInscricao.reset();
    fecharFormularioInscricao();
});

formularioInscricao.addEventListener("submit", function(evento) {
    evento.preventDefault();

    if (!validarFormulario(formularioInscricao)) {
        return;
    }

    const idCurso = cursoIdInscricao.value;
    const cursos = lerCursos();
    const curso = cursos.find(function(item) {
        return item.id === idCurso;
    });

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

    const inscricaoDuplicada = inscricoes.some(function(inscricao) {
        return inscricao.cursoId === idCurso && inscricao.email === email;
    });

    if (inscricaoDuplicada) {
        mostrarAviso("Este e-mail já está inscrito neste curso.", "erro");
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

    mostrarAviso("Inscrição realizada com sucesso!", "sucesso");
    document.getElementById("minhas-inscricoes").scrollIntoView({ behavior: "smooth" });
});


/* ==================================================
   LISTA DE INSCRIÇÕES
   Mostra as inscrições guardadas neste navegador.
   ================================================== */

function mostrarInscricoes() {
    const inscricoes = lerInscricoes();
    listaInscricoes.innerHTML = "";

    if (inscricoes.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "mensagem-vazia";
        mensagem.textContent = "Nenhuma inscrição realizada ainda.";
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

        listaInscricoes.appendChild(cartao);
    });

    atualizarIndicadores();
}


/* ==================================================
   INDICADORES
   Calcula números usando apenas os dados cadastrados.
   ================================================== */

function atualizarIndicadores() {
    const cursos = lerCursos();
    const inscricoes = lerInscricoes();

    const totalVagas = cursos.reduce(function(total, curso) {
        return total + calcularVagasDisponiveis(curso);
    }, 0);

    const agora = new Date();
    const oitoSemanas = 8 * 7 * 24 * 60 * 60 * 1000;
    const dataInicial = new Date(agora.getTime() - oitoSemanas);

    const cursosNasOitoSemanas = cursos.filter(function(curso) {
        const dataCurso = new Date(curso.data);
        return dataCurso >= dataInicial && dataCurso <= agora;
    });

    indicadorCursos.textContent = cursos.length;
    indicadorVagas.textContent = totalVagas;
    indicadorInscricoes.textContent = inscricoes.length;
    indicadorCadastros.textContent = cursosNasOitoSemanas.length;
}


/* ==================================================
   CURSOS DEMONSTRATIVOS
   Aparecem apenas no primeiro carregamento e não sobrescrevem cadastros reais.
   ================================================== */
function inserirCursosDemonstrativos() {
    if (localStorage.getItem(CHAVE_EXEMPLOS_CURSOS)) {
        return;
    }

    const cursosExistentes = lerCursos();

    if (cursosExistentes.length === 0) {
        const agora = new Date().toISOString();
        const cursosDemonstrativos = [
            {
                id: "exemplo-informatica",
                titulo: "Introdução à Informática",
                categoria: "Informáticos",
                vagas: 20,
                modalidade: "Online",
                descricao: "Aprenda os fundamentos do computador, internet, editores de texto e ferramentas digitais para o dia a dia.",
                conteudos: ["Uso do computador", "Internet e segurança digital", "Editores de texto", "E-mail e ferramentas online"],
                duracao: "40 horas",
                requisitos: "Conhecimentos básicos de leitura",
                local: "Aulas online",
                imagem: IMAGENS_CURSOS_DEMONSTRATIVOS["exemplo-informatica"],
                data: agora
            },
            {
                id: "exemplo-administrativo",
                titulo: "Auxiliar Administrativo",
                categoria: "Administrativos",
                vagas: 15,
                modalidade: "Híbrido",
                descricao: "Desenvolva habilidades de organização, atendimento, comunicação profissional e rotina de escritório.",
                conteudos: ["Organização de documentos", "Atendimento ao público", "Comunicação profissional", "Rotinas administrativas"],
                duracao: "60 horas",
                requisitos: "A partir de 14 anos",
                local: "Centro de formação EducaSim",
                imagem: IMAGENS_CURSOS_DEMONSTRATIVOS["exemplo-administrativo"],
                data: agora
            },
            {
                id: "exemplo-turismo",
                titulo: "Atendimento e Turismo Local",
                categoria: "Turismo",
                vagas: 18,
                modalidade: "Online",
                descricao: "Conheça práticas de atendimento, hospitalidade e divulgação das atrações turísticas da sua região.",
                conteudos: ["Hospitalidade", "Atendimento ao visitante", "Cultura e turismo local", "Divulgação de destinos"],
                duracao: "32 horas",
                requisitos: "Interesse em turismo e cultura",
                local: "Aulas online",
                imagem: IMAGENS_CURSOS_DEMONSTRATIVOS["exemplo-turismo"],
                data: agora
            },
            {
                id: "exemplo-saude",
                titulo: "Primeiros Cuidados em Saúde",
                categoria: "Saúde",
                vagas: 12,
                modalidade: "Híbrido",
                descricao: "Aprenda noções de prevenção, autocuidado e primeiros cuidados em situações do cotidiano.",
                conteudos: ["Prevenção de acidentes", "Sinais de alerta", "Noções de primeiros cuidados", "Autocuidado e bem-estar"],
                duracao: "24 horas",
                requisitos: "A partir de 14 anos",
                local: "Unidade parceira EducaSim",
                imagem: IMAGENS_CURSOS_DEMONSTRATIVOS["exemplo-saude"],
                data: agora
            }
        ];

        if (!gravarCursos(cursosDemonstrativos)) {
            return;
        }
    }

    try {
        localStorage.setItem(CHAVE_EXEMPLOS_CURSOS, "true");
    } catch (erro) {
        // Os cursos disponíveis podem ser exibidos sem esta marca de inicialização.
    }
}

function atualizarImagensDosExemplos() {
    const cursos = lerCursos();
    let alterou = false;

    const cursosAtualizados = cursos.map(function(curso) {
        const imagem = IMAGENS_CURSOS_DEMONSTRATIVOS[curso.id];

        if (imagem && (!curso.imagem || curso.imagem === imagem.replace(/\.png$/, ".svg"))) {
            alterou = true;
            return Object.assign({}, curso, { imagem: imagem });
        }

        return curso;
    });

    if (alterou) {
        gravarCursos(cursosAtualizados);
    }
}

/* ==================================================
   INICIALIZAÇÃO
   Carrega cursos, inscrições e indicadores ao abrir a página.
   ================================================== */

inserirCursosDemonstrativos();
atualizarImagensDosExemplos();
mostrarCursos();
mostrarInscricoes();
atualizarIndicadores();


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
