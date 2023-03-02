const loginScreen = document.querySelector('.login-screen');
const chatScreen = document.querySelector('.chat-container');
const conectedUsersArea = document.querySelector('.chat-container');
chatScreen.style.display = 'none';
conectedUsersArea.style.display = 'none';
const conectedUsers = document.getElementById('user_list');


const socket = io();

socket.on('connected', ( users ) => {
    conectedUsers.innerHTML = '';
    for (const user in users) {
        conectedUsers.insertAdjacentHTML('beforeend',`<li>${user}</li>`);
    }
})

socket.on('login', ( ) => {
    alert('Bienvenido al Chat, respeta las reglas!')
    loginScreen.style.display = 'none';
    chatScreen.style.display = 'inline';
    conectedUsersArea.style.display = 'inline';
})

socket.on('login-issue', () => {
    alert('El nombre que intentas usar no esta disponible, intenta uno nuevo');
    usernameInput.value = '';
})

usernameButton.addEventListener('click', ()=>{
    let username = usernameInput.value;
    socket.emit('register', username);
});

      /*const username = window.prompt("Usuario:");
      socket.emit("new user", username);*/
      
     // let selectedUser = null;
          
      /*const userForm = document.getElementById("user_form");
      const userTextAreaLogin = document.getElementById("text_area_login");
      userForm.addEventListener("submit", function (e) {
        e.preventDefault();
        socket.emit("new user", userTextAreaLogin.value);
      });*/

      //const userList = document.getElementById("user_list");

      socket.on("user list", (users) => {
        const userList = document.getElementById("user_list");
        userList.innerHTML = "";
        for (let i = 0; i < users.length; i++) {
          if (users[i] !== userTextAreaLogin.value) {
            const userItem = document.createElement("li");
            //console,log(userItem)
            //userItem.classList.add("user_item");
            userItem.textContent = users[i];
            userItem.addEventListener("click", () => {
                selectedUser = users[i];
                const title = document.getElementById("text_area");
                title.textContent = "Chat con " + selectedUser.value;
                textArea.appendChild(title)
              });
            userList.appendChild(userItem);
          }
        }

        const userItems = document.querySelectorAll(".user_item");
          userItems.forEach((userItem) => {
            userItem.addEventListener("click", () => {
              userItems.forEach((item) => item.classList.remove("selected-user"));
              userItem.classList.add("selected-user");
            });
          });
      });

      /*const username = window.prompt("Usuario:");
      socket.emit("new user", username);*/

      const messageForm = document.getElementById("message_form");
      const textInput = document.getElementById("text_area");
      const fileInput = document.getElementById("file_input");


      fileInput.addEventListener('change', function(e) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
          const fileContent = event.target.result;
          //fileDisplayArea.innerText = fileContent;
        }

        reader.readAsText(file);
      });

      messageForm.addEventListener("submit", function (e) {
        const file = fileInput.files[0];

        e.preventDefault();
        if (textInput.value || fileInput.files.length > 0) {
          const reader = new FileReader();

        reader.onload = function(e) {
          const fileContent = e.target.result;
          let  data = {
            "message":textInput.value,
            "file":fileContent,
            "user":selectedUser
          }
          socket.emit("new message", data);
          //fileDisplayArea.innerText = fileContent;
        }

        reader.readAsText(file);
         // const formData = new FormData();
          /*let  data = {
            "message":textInput.value,
            "file":fileContent,
            "user":selectedUser
          }*/
          /*if (textInput.value) {
            formData.append("message", textInput.value);
          }
          if (fileInput.files.length > 0) {
            formData.append("file", fileInput.files[0]);
          }
          if(textInput.value && fileInput.files.length > 0){
            selectedUser && formData.append("to", selectedUser);
          }
          console.log(data)*/
          //socket.emit("new message", data);
          textInput.value = "";
          selectedUser = null;
          fileInput.value = "";
          //fileDisplayArea.innerText = "";
        }
      });

      socket.on("send message", (data) => {
        const messageList = document.getElementById("message_list");
        const chatItem = document.createElement("textarea");
        const chatItemFile = document.createElement("div");
        /*const chatItemFile = document.createElement("file");
        const chatItemFile2 = document.createElement("text");*/
        //chatItem.classList.add("message_list_textarea");
        //console.log(data.message)
        chatItem.textContent = data.user + ": " + data.message;
        chatItemFile = data.file;
        //chatItemFile.textContent = data.file;
        /*if (data.file) {
          const link = document.createElement("a");
          link.href = data.file;
          link.download = data.filename || "file";
          link.innerText = "Descargar archivo";
          chatItemFile.appendChild(link);
        }*/
        //chatItemFile2.textContent = data. file;
        //chatItemFile2.file = data.file;
        messageList.appendChild(chatItem);
        messageList.appendChild(chatItemFile);
        //messageList.appendChild(chatItemFile2);
        window.scrollTo(0, document.body.scrollHeight);
      });

      socket.on("private message", (data) => {
        const messageList = document.getElementById("message_list");
        const chatItem = document.createElement("li");
        chatItem.textContent = `De ${data.from}: ${data.message}`;
        messageList.appendChild(chatItem);
        window.scrollTo(0, document.body.scrollHeight);
      });

      socket.on("new message", (data) => {
        const file = data.get("file");
        if (file) {
          console.log("Received file:", file.name);
          // Do something with the file, e.g. save it to disk
        }
        const message = data.get("message");
        if (message) {
          if (data.has("to")) {
            const toSocket =
              io.sockets.connected[
                connectedUsers.find((user) => user === data.get("to"))?.socketId
              ];
            if (toSocket) {
              toSocket.emit("private message", {
                from: socket.username,
                message,
              });
              socket.emit("private message", {
                from: socket.username,
                message,
                to: data.get("to"),
              });
            } else {
              socket.emit("send message", {
                message: "Usuario no encontrado",
                user: "Sistema",
              });
            }
          } else {
            io.emit("send message", { message, user: socket.username });
          }
        }
      });
      