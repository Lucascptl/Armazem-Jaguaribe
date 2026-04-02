const produtosTintas = [
  { name: "Coral Coralar Duo", image: "../imagens/latao de tintas coral.jpeg" },
  { name: "Esmalte Sintético", image: "../imagens/latas de tinta.jpeg" },
  { name: "Verniz Marítimo", image: "../imagens/parede com tintas.jpeg" },
  { name: "Massa Corrida", image: "../imagens/texturas aplicadas.jpeg" },
  { name: "Vedacit Vedapren", image: "../imagens/baldes de vedacit.jpeg" },
  { name: "Tinta Acrílica Starlux", image: "../imagens/tintas latao starlux.jpeg" },
  { name: "Kit de Pincéis", image: "../imagens/pinceis.jpeg" },
  { name: "Bases p/ Tintas", image: "../imagens/bases tintometricas.jpeg" },
  { name: "Coral Rende Muito", image: "../imagens/parede com tintas 2.jpeg" },
  { name: "Textura Acrílica", image: "../imagens/parede com tintas 3.jpeg" },
  { name: "Selador Acrílico", image: "../imagens/parede com tintas 5.jpeg" },
  { name: "Coralit Esmalte", image: "../imagens/parede de tinta 4.jpeg" }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-produtos-pequenos');
    if (!container) return;

    produtosTintas.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'small-prod-card';
        card.innerHTML = `
            <div class="small-prod-img">
                <img src="${produto.image}" alt="${produto.name}" loading="lazy">
            </div>
            <div class="small-prod-info">
                <h4 class="small-prod-name">${produto.name}</h4>
            </div>
        `;
        container.appendChild(card);
    });
});
