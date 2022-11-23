let socket = io("/privateSpace");
let userColour;

let roomName = window.prompt("Enter the room name");
console.log("ROOM : ", roomName);
window.addEventListener("load", () => {
  document.getElementById("room-name").innerHTML = "Current Room: " + roomName;
})

socket.on("connect", ()=> {
  console.log("Connection established to server via sockets");
  if(roomName) {
    let roomData = {
      name : roomName 
    }
    socket.emit("roomJoin", roomData);
  } else {
    alert("refresh and ENTER A NAME!!!")
  }
  
})


//on getting number of connections
socket.on("noConnections" ,(data) => {
  document.getElementById("total-people").innerHTML = data;
})

//on getting info from server
socket.on("serverData", (data) => {
  drawPainting(data);
})

function setup() {
  colorMode(RGB);
  createCanvas(800,500);
  background(255);
  colorMode(HSB);
  userColour = random(0,360);
  // noStroke();
}

function mouseDragged() {
  // ellipse(mouseX, mouseY, 10);
  let mouseObj = {
    x : mouseX,
    y : mouseY,
    px : pmouseX,
    py : pmouseY,
    lineColour : userColour
  }
  socket.emit("mouseData", mouseObj);

}

function drawPainting(data) {
  strokeWeight(7);
  stroke(data.lineColour,50,50);
  line(data.x, data.y, data.px, data.py);
}
