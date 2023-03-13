const input = document.querySelector('input');
const autocomplete = document.querySelector('.autocomplete');
const repositoriesList = document.querySelector('.repositories');

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const getRepositories = async (query) => {
  const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
  const data = await response.json();
  return data.items;
};

const clearAutocomplete = () => {
  while (autocomplete.firstChild) {
    autocomplete.removeChild(autocomplete.firstChild);
  }
};

const renderAutocomplete = (repositories) => {
  clearAutocomplete();
  repositories.forEach((repository) => {
    const li = document.createElement('li');
    li.textContent = repository.full_name;
    li.addEventListener('click', () => {
      addRepository(repository);
      clearAutocomplete();
      input.value = '';
    });
    autocomplete.appendChild(li);
  });
};

const searchRepositories = debounce(async () => {
  const query = input.value.trim();
  if (query) {
    const repositories = await getRepositories(query);
    renderAutocomplete(repositories);
  } else {
    clearAutocomplete();
  }
}, 300);

const addRepository = (repository) => {
  const li = document.createElement('li');
  const title = document.createElement('h2');
  title.textContent = repository.name;
  const owner = document.createElement('p');
  owner.textContent = `Owner: ${repository.owner.login}`;
  const stars = document.createElement('p');
  stars.textContent = `Stars: ${repository.stargazers_count}`;
  const button = document.createElement('button');
  button.textContent = 'Remove';
  button.addEventListener('click', () => {
    li.remove();
  });
  li.appendChild(title);
  li.appendChild(owner);
  li.appendChild(stars);
  li.appendChild(button);
  repositoriesList.appendChild(li);
};

input.addEventListener('input', searchRepositories);