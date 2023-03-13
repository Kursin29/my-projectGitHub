const searchInput = document.querySelector("input");
const autocomplete = document.querySelector(".autocomplete");
const repositoriesList = document.querySelector(".repositories");

let debounceTimer;

function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => func(), delay);
}

async function getRepositories(searchTerm) {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${searchTerm}&per_page=5`
    );
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error(error);
  }
}

function showAutocomplete(repositories) {
    const autocomplete = document.querySelector('.autocomplete');
    autocomplete.innerHTML = '';
    repositories.slice(0, 5).forEach((repository) => {
    const li = document.createElement('li');
    li.textContent = repository.name;
    li.addEventListener('click', () => {
    addRepository(repository);
    clearInput();
    });
    autocomplete.appendChild(li);
    });
    }

function showRepositories(repositories) {
    const repositoriesList = document.querySelector('.repositories');
    repositoriesList.innerHTML = '';
        
    repositories.forEach((repository) => {
    const li = document.createElement('li');
    li.textContent = `${repository.name} - ${repository.owner.login} - ${repository.stargazers_count} stars;`
    const button = document.createElement('button');
button.textContent = 'Remove';
button.addEventListener('click', () => {
  removeRepository(repository);
});

li.appendChild(button);
repositoriesList.appendChild(li);
});
}