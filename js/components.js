/**
 * components.js — Armazém Jaguaribe
 * Carrega componentes reutilizáveis (Header/Footer) em todas as páginas.
 */

async function loadComponent(placeholderId, componentPath) {
    try {
        // Determina o prefixo do caminho com base na profundidade da página atual
        // Se estiver dentro da pasta /pages/, recua um nível (../)
        const isSubPage = window.location.pathname.includes('/pages/');
        const prefix = isSubPage ? '../' : './';
        
        const response = await fetch(prefix + componentPath);
        if (!response.ok) throw new Error('Não foi possível carregar o componente: ' + componentPath);
        
        let html = await response.text();
        
        // Ajusta caminhos de links e imagens se for uma subpágina
        if (isSubPage) {
            // Ajusta src="..."
            html = html.replace(/src="(?!http|https|\/)/g, 'src="../');
            // Ajusta href="..."
            html = html.replace(/href="(?!http|https|\/|#)/g, 'href="../');
        }

        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
        }
    } catch (error) {
        console.error('Erro ao carregar componente:', error);
    }
}

// Inicia o carregamento quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', 'components/header.html');
    loadComponent('footer-placeholder', 'components/footer.html');
});
