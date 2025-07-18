const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

io.on("connection", (socket) => {
  console.log("🟢 New client:", socket.id);

  socket.on("fromESP", (msg) => {
    console.log("ESP → Browser:", msg);
    io.emit("fromESP", msg);
  });

  socket.on("toESP", (msg) => {
    console.log("Browser → ESP:", msg);
    io.emit("toESP", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
