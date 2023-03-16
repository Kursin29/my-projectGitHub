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