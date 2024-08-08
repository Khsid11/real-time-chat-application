const socket = io();

const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message-button');
const sendFileButton = document.getElementById('send-file-button');
const fileInput = document.getElementById('file-input');
const clientTotal = document.getElementById('client-total');
const logoutButton = document.getElementById('logout-button');
const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-button');

let username = '';

// Event listener for logging in
loginButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    socket.emit('new-user', username);
  }
});

// Event listener for logging out
logoutButton.addEventListener('click', () => {
  socket.emit('disconnect');
  location.reload();
});

// Event listener for message sending
sendMessageButton.addEventListener('click', () => {
  sendMessage();
});

// Event listener for file sending
sendFileButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  sendFile();
});

// Function to send messages
const sendMessage = () => {
  if (messageInput.value.trim() === '') return;

  const data = {
    username: username,
    message: messageInput.value,
    dateTime: new Date(),
    type: 'text'
  };

  socket.emit('message', data);
  messageInput.value = '';
};

// Function to send files
const sendFile = () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const data = {
      username: username,
      message: reader.result,
      dateTime: new Date(),
      type: file.type.startsWith('image/') ? 'image' : 'file'
    };

    socket.emit('message', data);
    fileInput.value = '';
  };
  reader.readAsDataURL(file);
};

// Add received messages to the chat
socket.on('message', (data) => {
  addMessage(data);
});

// Add message to the container
const addMessage = (data) => {
  const element = `
    <li class="${data.username === username ? 'message-right' : 'message-left'}">
      <p class="message">
        ${data.type === 'image' ? `<img src="${data.message}" alt="image"/>` : data.type === 'file' ? `<a href="${data.message}" class="file" download>Download file</a>` : data.message}
        <span class="username" style="font-size: 0.7em; color: gray;">${data.username}</span>
      </p>
    </li>
  `;

  messageContainer.innerHTML += element;
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Update client total
socket.on('client-total', (total) => {
  clientTotal.textContent = `Total clients: ${total}`;
});
