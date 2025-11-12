
document.addEventListener('DOMContentLoaded', () => {
  initLatestGamesWidget();
  initTopRatedGamesWidget();
  initGameSearchWidget();
  initGenreFilterWidget();
});

function renderGameList(container, games) {
    if (!games || games.length === 0) {
        container.innerHTML = '<p>No games found.</p>';
        return;
    }

    let html = '<ul>';
    games.forEach(game => {
        html += `<li><a href="/games/${game.id}">${game.name}</a></li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
}


async function initLatestGamesWidget() {
  const container = document.querySelector('[data-widget="latest-games"]');
  if (!container) return;

  try {
    const tournaments = await getTournaments({ ordering: '-start_date', page_size: 5 });
    if (!tournaments.results) {
        container.innerHTML = '<p>No games found.</p>';
        return;
    }
    const games = tournaments.results.map(t => t.game).filter((g, i, self) => i === self.findIndex(s => s.id === g.id));
    renderGameList(container, games.slice(0, 5));

  } catch (error) {
    container.innerHTML = '<p>Could not load latest games.</p>';
  }
}

async function initTopRatedGamesWidget() {
  const container = document.querySelector('[data-widget="top-rated-games"]');
  if (!container) return;

  try {
    const tournaments = await getTournaments({ ordering: '-prize_pool', page_size: 5 });
     if (!tournaments.results) {
        container.innerHTML = '<p>No games found.</p>';
        return;
    }
    const games = tournaments.results.map(t => t.game).filter((g, i, self) => i === self.findIndex(s => s.id === g.id));

    renderGameList(container, games.slice(0, 5));

  } catch (error) {
    container.innerHTML = '<p>Could not load top rated games.</p>';
  }
}

function initGameSearchWidget() {
  const container = document.querySelector('[data-widget="game-search"]');
  if (!container) return;

  container.innerHTML = `
    <form id="game-search-form">
      <input type="search" id="game-search-input" placeholder="Search for games...">
      <button type="submit">Search</button>
    </form>
    <div id="game-search-results"></div>
  `;

  const form = document.getElementById('game-search-form');
  const input = document.getElementById('game-search-input');
  const resultsContainer = document.getElementById('game-search-results');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    try {
      const tournaments = await getTournaments({ name: query });
      const games = tournaments.results.map(t => t.game).filter((g, i, self) => i === self.findIndex(s => s.id === g.id));

      renderGameList(resultsContainer, games);

    } catch (error) {
      resultsContainer.innerHTML = '<p>Search failed.</p>';
    }
  });
}

async function initGenreFilterWidget() {
    const container = document.querySelector('[data-widget="genre-filter"]');
    if (!container) return;

    // Add a container for the results
    container.innerHTML += '<div id="genre-filter-results"></div>';
    const resultsContainer = document.getElementById('genre-filter-results');

    try {
        const categories = await fetchFromApi('/blog/categories/');
        if (!categories || categories.length === 0) {
            container.insertAdjacentHTML('afterbegin', '<p>No genres found.</p>');
            return;
        }

        let selectHtml = '<select id="genre-filter-select">';
        selectHtml += '<option value="">All Genres</option>';
        categories.forEach(category => {
            selectHtml += `<option value="${category.id}">${category.name}</option>`;
        });
        selectHtml += '</select>';
        container.insertAdjacentHTML('afterbegin', selectHtml);

        const select = document.getElementById('genre-filter-select');

        select.addEventListener('change', async (e) => {
            const selectedCategoryId = e.target.value;
            if (selectedCategoryId) {
                try {
                    const tournaments = await getTournaments({ game: selectedCategoryId });
                    const games = tournaments.results.map(t => t.game).filter((g, i, self) => i === self.findIndex(s => s.id === g.id));
                    renderGameList(resultsContainer, games);
                } catch (error) {
                    resultsContainer.innerHTML = '<p>Could not load games for this genre.</p>';
                }
            } else {
                resultsContainer.innerHTML = '';
            }
        });

    } catch (error) {
        container.insertAdjacentHTML('afterbegin', '<p>Could not load genres.</p>');
    }
}
