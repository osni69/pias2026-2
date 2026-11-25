const acessoResponsavel = {
    ativo() { return sessionStorage.getItem("educasim_sessao_demo") === "ativa"; },
    sair() { sessionStorage.removeItem("educasim_sessao_demo"); },
    async entrar(senha) {
        const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(senha));
        const assinatura = Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
        if (assinatura !== "1516b57044424e0366bf0a7a381ccc096a2cb644c147b722e5adf623c9ba69d4") return false;
        sessionStorage.setItem("educasim_sessao_demo", "ativa");
        return true;
    }
};
