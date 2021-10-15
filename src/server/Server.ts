import express from "express";
import cors from "cors";
import * as http from "http";
import { Message } from "./models/message";
import { Parser } from "./parser/parser";

export class Server {
  public static readonly PORT:number = 3000;
  private app: express.Application;
  private server: http.Server;
  private io: any;
  private port: string | number;
  private parser: Parser;


  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
    this.parser = new Parser();
  }
  
  private createApp(): void {
    this.app = express();
    this.app.use(cors());
  }

  private createServer(): void {
    this.server = http.createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || Server.PORT;
  }

  private sockets(): void {
    this.io = require("socket.io").listen(this.server, { origins: '*:*'});
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.on("connect", (socket: any) => {
      console.log("Connected client on port %s.", this.port);


      
      socket.on("message", (msg: any) => {
        try {
          let parsedMessage = this.parser.parseMessage(new Message(msg));
          console.log(parsedMessage);
        } catch (e) {
          console.log(e);
        }
        this.io.emit("test")
      })
      /*
      socket.on("message", (m: Message) => {
        console.log("[server](message): %s", JSON.stringify(m));
        this.io.emit("message", m);
      });
      */

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

/*
const app = express();
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
  console.log("a user connected");
});

const server = http.listen(3000, function() {
  console.log("listening on *:3000");
});
*/