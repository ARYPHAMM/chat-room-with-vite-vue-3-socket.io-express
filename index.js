let app = require("express")();
let bodyParser = require("body-parser");
let cors = require("cors");
let CryptoJS = require("crypto-js"); // md password
let http = require("http").Server(app);
let mysql = require("./db.js");
let io = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"],
  },
  pingInterval: 1000,
  pingTimeout: 1000,
});
app.use(cors());
app.use(bodyParser());
app.get("/", (req, res) => {});
app.post("/api/user", (req, res) => {
  mysql
    .query(
      "SELECT * FROM users where token = '" +
        req.headers.authorization.split(" ")[1] +
        "' "
    )
    .then((item) => {
      if (item[0] != null) {
        delete item[0]["password"];
        res.json(item[0]).status(200);
      } else {
        res.status(400).json(false);
      }
    });
});
app.post("/api/register", (req, res) => {
  mysql
    .query(
      "SELECT * FROM users where email = '" +
        req.body.email +
        "' or username = '" +
        req.body.username +
        "' "
    )
    .then((item) => {
      if (item[0] != null) {
        res.json(false);
      } else {
        req.body.password = CryptoJS.MD5(req.body.password).toString();
        mysql.insert(req.body, "users").catch((error) => {
          res.json(false);
        });
        res.json(true);
      }
    });
});
app.post("/api/login", (req, res) => {
  mysql
    .query(
      "SELECT * FROM users where email = '" +
        req.body.email +
        "' and password = '" +
        CryptoJS.MD5(req.body.password).toString() +
        "' "
    )
    .then((item) => {
      if (item[0] != null) {
        let token = {
          accessToken: CryptoJS.MD5(
            req.body.email + req.body.password
          ).toString(),
        };
        mysql
          .update({ id: item[0].id }, { token: token.accessToken }, "users")
          .then((resuser) => {
            res.json(token);
          })
          .catch((error) => {
            res.json(false);
          });
      } else {
        res.json(false);
      }
    });
});
app.post("/api/logout", (req, res) => {
  mysql
    .query(
      "SELECT * FROM users where email = '" +
        req.body.email +
        "' and password = '" +
        CryptoJS.MD5(req.body.password).toString() +
        "' "
    )
    .then((item) => {
      if (item[0] != null) {
        let token = {
          accessToken: CryptoJS.MD5(
            req.body.email + req.body.password
          ).toString(),
        };
        mysql
          .update({ id: item[0].id }, { token: token.accessToken }, "users")
          .then((resuser) => {
            res.json(token);
          })
          .catch((error) => {
            res.json(false);
          });
      } else {
        res.json(false);
      }
    });
});
let host = "127.0.0.1";
let port = process.env.PORT || 8000;
http.listen(port, host, () => {
  console.log("Listening on port *: " + port);
});
io.on("connection", (socket) => {
  socket.on("room", (user) => {
    socket.join(user.room);
    mysql
      .query(
        "SELECT * FROM users where email = '" +
          user.email +
          "' and token = '" +
          user.token +
          "' "
      )
      .then((res) => {
        if (res[0] == null) {
          socket.emit("auth", false);
        } else {
          socket.emit("auth", { username: res[0].username });
          mysql
            .query(
              "SELECT IF(user_id = " +
                res[0].id +
                ", 1, 2) as type, u.username,c.* FROM chat c, users u where c.user_id = u.id and room = '" +
                user.room +
                "' order by id asc "
            )
            .then((messages) => {
              socket.emit(
                "connections",
                io.sockets.adapter.rooms.get(user.room).size,
                messages
              );
              socket
                .to(user.room)
                .emit(
                  "connections",
                  io.sockets.adapter.rooms.get(user.room).size
                );
            });
        }
      });
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
  socket.on("chat-message", (chat) => {
    mysql
      .query(
        "SELECT * FROM users where email = '" +
          chat.email +
          "' and token = '" +
          chat.token +
          "' "
      )
      .then((res) => {
        if (res[0] != null) {
          let chat_data = {
            user_id: res[0].id,
            room: chat.room,
            message: chat.message,
            time: chat.time,
          };
          mysql
            .insert(chat_data, "chat")
            .then((res) => res)
            .catch((error) => {
              socket.emit("auth", false);
              return;
            });
          socket.to(chat.room).emit("chat-message", chat);
        } else {
          socket.emit("auth", false);
        }
      });
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
