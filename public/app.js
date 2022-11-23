let socket = io("/publicSpace");
let userColour;

socket.on("connect", ()=> {
  console.log("Connection established to server via sockets");
})

//on getting info from server
socket.on("serverData", (data) => {
  drawPainting(data);
})

//on getting number of connections
socket.on("noConnections" ,(data) => {
  document.getElementById("total-people").innerHTML = data.noConnections;
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
  strokeWeight(5);
  stroke(data.lineColour,50,50);
  line(data.x, data.y, data.px, data.py);
}
