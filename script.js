document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cards-container');
  const searchInput = document.getElementById('search-input');
  let allTechnologies = []; // Armazena todas as tecnologias para filtrar

  const fetchTechnologies = async () => {
    try {
      const response = await fetch('data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allTechnologies = await response.json();
      renderCards(allTechnologies); // Renderiza todos os cartões inicialmente
    } catch (error) {
      console.error('Erro ao carregar as tecnologias:', error);
      container.innerHTML =
        '<p style="color: red; text-align: center;">Falha ao carregar os dados. Verifique o console para mais detalhes.</p>';
    }
  };

  const renderCards = (technologies) => {
    if (!technologies || technologies.length === 0) {
      container.innerHTML = '<p>Nenhuma tecnologia encontrada.</p>';
      return;
    }

    container.innerHTML = ''; // Limpa o container antes de adicionar os novos cartões

    technologies.forEach((tech) => {
      const card = document.createElement('div');
      card.className = 'card';

      const tagsHtml = tech.tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join('');

      const recursosHtml = Object.entries(tech.recursos)
        .map(([key, value]) => {
          // Transforma 'primeiros_passos' em 'Primeiros Passos'
          const linkText = key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
          return `<a href="${value}" target="_blank" rel="noopener noreferrer" class="recurso-link">${linkText}</a>`;
        })
        .join('');

      card.innerHTML = `
                <h2>${tech.nome} <span style="font-size: 0.9rem; color: #aaa;">(${tech.data_criacao})</span></h2>
                <p>${tech.descricao}</p>
                <div class="tags">${tagsHtml}</div>
                <div class="recursos">${recursosHtml}</div>
            `;

      container.appendChild(card);
    });
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const filteredTechnologies = allTechnologies.filter((tech) => {
      const nameMatch = tech.nome.toLowerCase().includes(searchTerm);
      const tagMatch = tech.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm)
      );
      return nameMatch || tagMatch;
    });

    renderCards(filteredTechnologies);
  };

  searchInput.addEventListener('input', handleSearch);
  fetchTechnologies();
});
