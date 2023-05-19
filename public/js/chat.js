const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Object.fromEntries(
  new URLSearchParams(location.search)
);

const autoscroll = () => {
  //New message element
  const $newMessage = $messages.lastElementChild;
  //Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
  //Visible height
  const visibleHeight = $messages.offsetHeight;
  //Height of messages container
  const containerHeight = $messages.scrollHeight;
  //How far have I scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    usernameVar: message.username,
    messageVar: message.text,
    timestampVar: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (locationMessage) => {
  console.log(locationMessage);
  const html = Mustache.render(locationMessageTemplate, {
    usernameVar: locationMessage.username,
    urlVar: locationMessage.url,
    timestampVar: moment(locationMessage.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    roomVar: room,
    usersVar: users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //disable form
  $messageFormButton.setAttribute(`disabled`, `disabled`);
  //   const message = document.querySelector("input").value;
  const message = e.target.elements.message.value;
  //   console.log(message);
  socket.emit("sendMessage", message, (callbackError) => {
    //reenable form
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (callbackError) {
      return console.log(callbackError);
    }
    console.log(`Message delivered`);
  });
});

// socket.on("countUpdated", (count) => {
//   console.log("The count has been updated!", count);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   console.log("Clicked");
//   socket.emit("increment");
// });

$sendLocationButton.addEventListener("click", () => {
  //using the browser's geolocation API if it is supported by the browser
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  $sendLocationButton.setAttribute("disabled", "disabled");
  //currently does not support the promise API so we cannot use promises or asyn/await
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      },
      () => {
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location shared");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
