const users = [];

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  //Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  //Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }
  //Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  //Validate username
  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }
  //Store user
  const user = { id, username, room };
  users.push(user);
  return {
    user,
  };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    //splice method adds or removes elements from an array
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => {
    return user.room === room;
  });
};

// addUser({ id: 22, username: "Christelleke   ", room: "A3" });
// addUser({ id: 32, username: "Philiberke   ", room: "A3" });
// addUser({ id: 42, username: "Michietje    ", room: "A4" });

// console.log(users);

// // const removedUser = removeUser(22);
// // console.log(removedUser);
// // console.log(users);

// console.log(getUser(22));
// console.log(getUsersInRoom("A3"));

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
