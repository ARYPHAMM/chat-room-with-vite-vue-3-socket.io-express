let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"],
  },
  pingInterval: 1000,
  pingTimeout: 1000,
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
let host = "127.0.0.1";
let port = process.env.PORT || 8000;
http.listen(port, host, () => {
  console.log("Listening on port *: " + port);
});
io.on("connection", (socket) => {
  socket.on("room", (room) => {
    socket.join(room);
    socket.emit("connections", io.sockets.adapter.rooms.get(room).size);
    socket
      .to(room)
      .emit("connections", io.sockets.adapter.rooms.get(room).size);
  });
  // socket.emit('123',socket.client.conn.server.clientsCount); // user current
  //   socket.broadcast.emit("123", socket.client.conn.server.clientsCount); // all user
  socket.on("disconnect", (res) => {
    // socket.emit("disconnect", io.sockets.adapter.rooms.get(room).size);
  });
  socket.on("disconnecting", () => {
    let room = Array.from(socket.rooms);
    room = room[1];
    let size = 0;
    try {
      size =
        io.sockets.adapter.rooms.get(room).size == undefined
          ? 1
          : io.sockets.adapter.rooms.get(room).size;
    } catch (error) {
      size = 1;
    }
    socket.to(room).emit("disconnectroom", size - 1);

    //   socket.broadcast.emit("123", socket.client.conn.server.clientsCount); // all user
    // let rooms = Object.keys(io.sockets.adapter.rooms);
    // socket.emit("disconnect", io.sockets.adapter.rooms.get(room).size);
  });
  socket.on("chat-message", (data) => {
    socket.to(data.room).emit("chat-message", data);
  });
});
// io.on('disconnect', (res) => {
// });
// const express = require('express');
// const app = express();
// const port = 443;
// app.get('/',(reg,res)=>{
//   res.json(window.location.href);
// });
// app.listen(port,()=>{
//   console.log(`server started on port ${port} `);
// })
// app.get('/', function(req, res) {
//     res.send('Howdy! req.url: '+req.url);
// });
// app.get('/users', function(req, res) {
//     res.send('Should send a bunch of users!');
// });
// app.get('/things/:name/:id', function(req, res) {
//     res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
// });
// app.listen(443,()=>{});