const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: 'Username and room are required!'
    };
  }

  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: 'Username already exists!'
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const findUserIndex = users.findIndex(user => user.id === id);

  if (findUserIndex !== -1) {
    return users.splice(findUserIndex, 1)[0];
  }
};

const getUser = id => {
  const findUser = users.find(user => user.id === id);

  if (!findUser) {
    return {
      error: 'Cannot find user!'
    };
  }

  return findUser;
};

const getUserInRoom = room => users.filter(user => user.room === room)

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom
};
