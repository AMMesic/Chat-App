const socket = io();

const messageFormButton = document.querySelector('#message-button');
const messageFormInput = document.querySelector('input');
const messageForm = document.querySelector('#message-form');
const locationButton = document.querySelector('#send-location');
const messages = document.querySelector('#messages');
const sidebar = document.querySelector('#sidebar');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
  '#location-message-template'
).innerHTML;
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoscroll = inputMessage => {
  const newMessage = messages.lastElementChild;

  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = messages.offsetHeight;

  const contentHeight = messages.scrollHeight;

  const scrollOffset = messages.scrollTop + visibleHeight;

  if (contentHeight - newMessageHeight <= scrollOffset || inputMessage) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on('message', message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: moment(message.createdAt).format('h:mm A  ')
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscroll(message.text);
});

socket.on('locationMessage', message => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    url: message.url,
    username: message.username,
    createdAt: moment(message.createdAt).format('h:mm A  ')
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscroll(message.url);
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users
  });
  sidebar.innerHTML = html;
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();

  messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, error => {
    messageFormButton.removeAttribute('disabled');
    messageFormInput.value = '';
    messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered!');
  });
});

locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }

  locationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        locationButton.removeAttribute('disabled');
        console.log('Location shared!');
      }
    );
  });
});

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
