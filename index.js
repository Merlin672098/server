const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const ubiRouter = require("./routes/ubicacion");
const cors = require('cors');
const lineaRouter = require("./routes/linea");
const http = require("http");
const url = require("url");
const { Server: WebSocketServer } = require("ws");
const { checkAndSendChanges,checkAndSendChanges2, handleWebSocketConnection } = require("./routes/websocket");


const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const DB = "mongodb://cltq8o17p00p0cgpmf8xnaclv:LnHnPzBzdnPK4nEDUCiA0IyK@181.188.156.195:18010/?readPreference=primary&ssl=false";
app.use(cors());
app.use(express.json());
app.use(authRouter);
//app.use(productRouter);
app.use(ubiRouter);
app.use(lineaRouter);

mongoose

  .connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log("Error connecting to MongoDB:", e);
  });

const lineasWss = new WebSocketServer({ noServer: true });
const locationsWss = new WebSocketServer({ noServer: true });

handleWebSocketConnection(lineasWss);
handleWebSocketConnection(locationsWss);

setInterval(() => checkAndSendChanges(lineasWss), 5000);
setInterval(() => checkAndSendChanges2(locationsWss), 5000);

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/lineas') {
    lineasWss.handleUpgrade(request, socket, head, (ws) => {
      lineasWss.emit('connection', ws, request);
    });
  } else if (pathname === '/locations') {
    locationsWss.handleUpgrade(request, socket, head, (ws) => {
      locationsWss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
