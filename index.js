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

const commentsList = document.getElementById('comments-list');

function formatTime(time) {
  const today = new Date();
  const date = new Date(time);
  const diffTime = Math.abs(today - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return 'сегодня ' + date.toLocaleTimeString();
  } else if (diffDays === 1) {
    return 'вчера ' + date.toLocaleTimeString();
  } else {
    return date.toLocaleString();
  }
}

function addComment(name, comment, date, id) {
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment');
  commentDiv.dataset.id = id;

  const nameSpan = document.createElement('span');
  const dateSpan = document.createElement('span');
  const commentP = document.createElement('p');

  nameSpan.textContent = name + ': ';
  dateSpan.textContent = formatTime(date);
  commentP.textContent = comment;

  commentDiv.appendChild(nameSpan);
  commentDiv.appendChild(dateSpan);
  commentDiv.appendChild(commentP);
  commentsList.appendChild(commentDiv);

  const commentActionsDiv = document.createElement('div');
  commentActionsDiv.classList.add('comment-actions');

  const likeButton = document.createElement('button');
  likeButton.textContent = '❤️';
  likeButton.addEventListener('click', () => {
    toggleLike(id);
  });
  commentActionsDiv.appendChild(likeButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Удалить';
  deleteButton.addEventListener('click', () => {
    deleteComment(id);
  });
  commentActionsDiv.appendChild(deleteButton);

  commentDiv.appendChild(commentActionsDiv);
}

function toggleLike(id) {
  const commentDiv = document.querySelector(`.comment[data-id="${id}"]`);
  const likeButton = commentDiv.querySelector('button:first-of-type');
  let likesSpan = commentDiv.querySelector('.likes');
  if (!likesSpan) {
    likesSpan = document.createElement('span');
    likesSpan.textContent = '1';
    likesSpan.classList.add('likes');
    likeButton.after(likesSpan);
  } else {
    likesSpan.remove();
  }
}

function deleteComment(id) {
  const commentDiv = document.querySelector(`.comment[data-id="${id}"]`);
  commentDiv.remove();
}

const commentForm = document.querySelector('#comment-form form');
let commentId = 0;

commentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const comment = document.getElementById('comment').value;
  const name = document.getElementById('name').value;
  const dateInput = document.getElementById('date');
  const dateValue = dateInput.value ? new Date(dateInput.value).toISOString() : new Date().toISOString();
  addComment(name, comment, dateValue, commentId++);
  commentForm.reset();
});