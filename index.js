//initialising express app
let express = require("express");
let app = express();
app.use("/", express.static("public"));


//creating an http server ON the express app
let http = require("http");
let server = http.createServer(app);
server.listen(5000, () => {
  console.log("listening on 5000");
})

//add sockets on top of the http server
let io = require("socket.io");
io = new io.Server(server);

//create variable for public namespace
let publicSockets = io.of("/publicSpace");
let publicConnections = 0;

//logic for public namespace
publicSockets.on("connect", (socket) => {
  publicConnections++;
  console.log("New Connection : ", socket.id);
  let noConnectionsData = {
    noConnections : publicConnections
  }
  publicSockets.emit("noConnections", noConnectionsData);
  //when server gets data from C
  socket.on("mouseData", (data) => {
    console.log(data);
    //emitting info only to public namespace
    publicSockets.emit("serverData", data);
    privateSockets.emit("serverData", data);
  })

  //for when C disconnects
  socket.on("disconnect", () => {
    noConnectionsData = {
      noConnections : publicConnections
    }
    publicSockets.emit("noConnections", noConnectionsData);
    console.log("Socket Disconnected : ", socket.id);
    publicConnections--;
  })

})



//create variable for private namespace
let privateSockets = io.of("/privateSpace");
let privateConnections = {};

//logic for private namespace
privateSockets.on("connect", (socket) => {
  
  console.log("New Connection : ", socket.id);

  //when C sends request to join a room
  socket.on("roomJoin", (data) => {
    socket.roomName = data.name;
    socket.join(socket.roomName);
    //did that room already exist?
    if(privateConnections[socket.roomName]) {
      privateConnections[socket.roomName]++;
    } else {
      privateConnections[socket.roomName] = 1;
    }
    privateSockets.emit("noConnections", privateConnections[socket.roomName])
  })
  
  //when server gets data from C
  socket.on("mouseData", (data) => {
    console.log(data);
    //emitting info only to public namespace
    privateSockets.to(socket.roomName).emit("serverData", data);
  })

  //for when C disconnects
  socket.on("disconnect", () => {
    console.log("Socket Disconnected : ", socket.id);
    privateConnections[socket.roomName]--;
    privateSockets.emit("noConnections", privateConnections[socket.roomName])
  })

})

