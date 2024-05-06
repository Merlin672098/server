const WebSocket = require("ws");
const { Linea } = require("../models/linea");
const { Location } = require("../models/ubicacion");

const checkAndSendChanges = async (lineasWss) => {
  try {
    const lineas = await Linea.find({});
    const jsonData = JSON.stringify(lineas);
    lineasWss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonData);
      }
    });
    console.log("When la mandas");
  } catch (error) {
    console.error("Error:", error);
  }
};
const checkAndSendChanges2 = async (locationWss) => {
  try {
    const locations = await Location.find({});
    const jsonData = JSON.stringify(locations);
    locationWss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonData);
      }
    });
    console.log("When la mandas2");
  } catch (error) {
    console.error("Error2:", error);
  }
};

const handleWebSocketConnection = (wss) => {
  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");

    ws.on("message", (message) => {
      console.log(`Received: ${message}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected from WebSocket");
    });
  });
};

module.exports = { checkAndSendChanges,checkAndSendChanges2, handleWebSocketConnection };

