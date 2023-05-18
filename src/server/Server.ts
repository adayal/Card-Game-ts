import express from "express";
import cors from "cors";
import * as http from "http";
import { Message } from "./models/message";
import { Parser } from "./parser/parser";
import { CreateRoomModel, JoinRoomModel, ListRoomModel } from "./models/RoomModels";
import CONSTANTS from "../common/CONSTANTS";
import { RoomManager } from "./room/roomManager";
import { PlayMoveModel, RequestPlayerSyncModel, StartGameModel, SyncPlayerModel } from "./models/gameActionsModel";
import { Room } from "./room/room";

export class Server {
  public static readonly PORT:number = 3001; //config file
  private app: express.Application;
  private server: http.Server;
  private io: any;
  private port: string | number;
  private parser: Parser;
  private roomManager: RoomManager;


  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
    this.parser = new Parser();
    this.roomManager = new RoomManager();
  }
  
  private createApp(): void {
    this.app = express();
    this.app.use(cors());
    this.app.get('/', (req, res) => res.sendFile('App.js', {'root': __dirname + '/../ui/src/'}));
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
          this.handleMessage(new Message(msg), socket);
        }
        catch (e) {
          console.debug(e);
          socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, (new Message()).toError(e).toJson());
        }
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  private handleMessage(msg: Message, socket: any): any {
    try {
      let parsedMessage = this.parser.parseMessage(msg);
      this.roomManager.handleIncomingRoomMessage(parsedMessage, socket);
      socket.emit(CONSTANTS.CLIENT_MSG.ACKNOWLEDGED, msg.toSuccess().toJson());
    } catch (e) {
      console.debug(e);
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, msg.toError(e).toJson());
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}