const application = require('express')();
const server = require('http').createServer(application)
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000

const usuarios = {};

application.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
   console.log('Servidor ejecutando en puerto: ' + PORT);
});

io.on('connection', (socket) => {

    socket.on('register', ( username ) => {
       if ( usuarios[username] ) {
          socket.emit('login-issue');
          return;
       } else {
          usuarios[username] = socket.id;
          socket.username = username;
          socket.emit('login');
          io.emit('user-connected', usuarios);
       }
    });
 
    socket.on('send-message', ({message, image}) => {
       io.emit('send-message', {message, user: socket.username, image});
    });
 
    socket.on('send-private-message', ({targetUser, message, image}) => {
       if ( usuarios[targetUser] ) {
          io.to(usuarios[targetUser]).emit('send-private-message', { from: socket.username, message, image });
          io.to(usuarios[socket.username]).emit('send-private-message', { from: socket.username, message, image });
       }else {
          socket.emit('send-private-message-issue');
       }
    });
 
    socket.on('disconnect', () => {
       delete usuarios[socket.username];
       io.emit('user-connected', usuarios);
    }); 
 });
 
 
 

/*io.on('connection', (socket) => {

    socket.on('register', ( username ) => {
        if ( connectedUsers[username] ) {
           socket.emit('login-failed');
           console.log('Usuario ya esta conectado - Usuario: ' + username);
           return;
        } else {
           connectedUsers[username] = socket.id;
           socket.username = username;
           socket.emit('login');
           console.log(connectedUsers)
           socket.emit('user-connected', connectedUsers);
           console.log('Usuario conectado - Usuario: ' + socket.username)
        }
     });
  

   socket.on('disconnect', () => {
       console.log('Usuario desconectado - Usuario: ' + socket.username);
       connectedUsers = connectedUsers.filter(user => user !== socket.username);
       io.emit('connected', connectedUsers);
   });

   socket.on('new message', (msg) => {
       if (msg.user != null) {
           const toSocket = io.sockets.connected[connectedUsers.find(user => user === msg.to)?.socketId];
           if (toSocket) {
               toSocket.emit('private message', { from: socket.username, message: msg.message });
               socket.emit('private message', { from: socket.username, message: msg.message, to: msg.to });
           } else {
               socket.emit('send message', { message: 'Usuario no encontrado', user: 'Sistema' });
           }
       } else {
            console.log(msg.user)
            console.log(msg.message)
            console.log(msg.file)
           io.emit('send message', { message: msg.message, user: socket.username, file: msg.file});
       }
   });*/

   /*socket.on('new user', (usr) => {
    const userExists = connectedUsers.find((user) => user.toLowerCase() === usr.toLowerCase());
    if (userExists) {
        const validation = true
        io.emit('user validation', validation)
        console.log('Usuario ya esta conectado - Usuario: ' + usr);
    } else {
        const validation = false
        socket.username = usr;
        connectedUsers.push(usr);
        io.emit('user list', connectedUsers);
        console.log('Usuario conectado - Usuario: ' + socket.username);
        io.emit('user validation', validation)
    }
  });*/

//});
    /*setInterval(() => {
        io.emit('user list', connectedUsers);
        }, 1000);*/
    /*let ws;
let chatForm = document.getElementById("chat-form");
let chatMessages = document.getElementById("chat-messages");
let chatInput = document.getElementById("chat-input");

function connect() {
    ws = new WebSocket("ws://" + document.location.host + "/chat");
    ws.onmessage = function(event) {
        let message = JSON.parse(event.data);
        showMessage(message);
    }
}

function sendMessage() {
    let message = {
        name: "User",
        message: chatInput.value
    }
    ws.send(JSON.stringify(message));
    chatInput.value = "";
}

function showMessage(message) {
    let messageElement = document.createElement("div");
    messageElement.innerHTML = "<strong>" + message.name + ": </strong>" + message.message;
    chatMessages.appendChild(messageElement);
}

chatForm.addEventListener("submit", function(event) {
    event.preventDefault();
    sendMessage();
});

connect();*/