// Display time
function displayTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  const timeString = `${formattedHours}:${minutes}:${seconds} ${period}`;
  document.getElementById('clock').textContent = timeString;
}

displayTime();
setInterval(displayTime, 1000);

// Load games
const gameList = document.getElementById('game-list');

async function loadGames() {
  try {
    const response = await fetch('games.json');
    const gamesData = await response.json();

    gamesData.forEach(game => {
      const gameId = game.id;
      const gameCategories = game.tags.map(tag => `#${tag}`).join(' ');

      const gameHtml = `
        <a onclick="addGameTab('${gameId}', '${game.title}')" class="game-btn" data-categories="${game.tags.join(',')}">
          <img src="./assets/images/${gameId.replace(/-/g, '')}.png" alt="${game.title}">
          <div class="content">
            <p class="title">${game.title}</p>
            <p class="category">${gameCategories}</p>
          </div>
        </a>
      `;

      gameList.innerHTML += gameHtml;
    });

    populateCategories();
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

loadGames();

// Add tags to game btn

function populateCategories() {
  gameList.querySelectorAll('.game-btn').forEach(game => {
    const categories = game.dataset.categories.split(',');
    const categoryText = categories.map(category => `#${category}`).join(' ');
    const categoryElement = game.querySelector('.category');
    if (categoryElement) {
      categoryElement.textContent = categoryText;
    }
  });
}

// Filter games

function filterGames() {
  const selectedCategory = categoryFilter.value.toLowerCase();
  const searchTerm = searchInput.value.toLowerCase();

  gameList.querySelectorAll('.game-btn').forEach(game => {
    const gameCategories = game.dataset.categories.split(',');
    const gameTitle = game.querySelector('.title').textContent.toLowerCase();

    const matchesCategory = selectedCategory === 'all' || gameCategories.includes(selectedCategory);
    const matchesSearch = gameTitle.includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      game.style.display = '';
    } else {
      game.style.display = 'none';
    }
  });
}


// Event listener for category filter

const categoryFilter = document.getElementById('category-filter');
categoryFilter.addEventListener('change', function () {
  const selectedCategory = this.value;
  filterGames(selectedCategory);
});

// Search for games

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', filterGames);

// Open page
let tabCounter = 1;

function openPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const embeds = document.querySelectorAll('#embed-container iframe');
  const embedContainer = document.getElementById('embed-container');

  embedContainer.style.display = pageId === 'home-page' ? 'none' : 'block';

  pages.forEach(page => {
    page.style.display = 'none';
  });
  embeds.forEach(embed => {
    embed.style.display = 'none';
  });

  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  }
}

// Add new tab
function addGameTab(gameId, gameName) {
  const tabsContainer = document.getElementById('tabs-container');
  const embedContainer = document.getElementById('embed-container');

  if (document.getElementById(`${gameId}-tab`)) {
    openPage(`${gameId}-embed`);
    return;
  }

  const newTab = document.createElement('button');
  newTab.classList.add('tab-btn');
  newTab.id = `${gameId}-tab`;

  newTab.innerHTML = `<div class="left"><i class="fa-solid fa-gamepad"></i><p>${gameName}</p></div> <button class="close-tab" onclick="closeTab('${gameId}')"><i class="fa-solid fa-xmark"></i></button>`;
  newTab.onclick = function () { openPage(`${gameId}-embed`); };

  tabsContainer.appendChild(newTab);

  const newEmbed = document.createElement('iframe');
  newEmbed.src = `./assets/games/${gameId}`;
  newEmbed.id = `${gameId}-embed`;
  newEmbed.classList.add('game-embed');
  newEmbed.style.display = 'none';

  embedContainer.appendChild(newEmbed);

  openPage(`${gameId}-embed`);

  tabCounter++;
}

// Close tab
function closeTab(gameId) {
  const tab = document.getElementById(`${gameId}-tab`);
  if (tab) tab.remove();

  const embed = document.getElementById(`${gameId}-embed`);
  if (embed) embed.remove();

  openPage('home-page');
}

// Fullscreen
const reqFs = (elem) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

const fullscreen = () => {
  const elem = document.getElementsByClassName("game-embed")[0];
  reqFs(elem);
};
