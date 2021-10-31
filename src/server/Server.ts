import express from "express";
import cors from "cors";
import * as http from "http";
import { Message } from "./models/message";
import { Parser } from "./parser/parser";
import { CreateRoomModel, JoinRoomModel } from "./models/RoomModels";
import CONSTANTS from "../common/CONSTANTS";
import { RoomManager } from "./room/roomManager";
import { StartGameModel } from "./models/gameModel";

export class Server {
  public static readonly PORT:number = 3000; //config file
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
        this.handleMessage(msg, socket);
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  private handleMessage(msg: any, socket: any): any{
    try {
      let selectedRoom = this.roomManager.getRoomBySocket(socket);
      let parsedMessage = this.parser.parseMessage(new Message(msg));
      if (parsedMessage.getType() == CreateRoomModel.name) {
        if (!this.roomManager.createRoom(parsedMessage as CreateRoomModel, socket)) {
          socket.emit(CONSTANTS.MSG_TYPES.ALREADY_JOINED_ROOM);
        }
      }
      else if (parsedMessage.getType() == JoinRoomModel.name) {
        if (!this.roomManager.joinRoom(parsedMessage as JoinRoomModel, socket)) {
          socket.emit(CONSTANTS.MSG_TYPES.ROOM_NOT_JOINED);
        }
      }
      else if (parsedMessage.getType() == StartGameModel.name) {
        if (!selectedRoom || selectedRoom.hasGameStarted) {
          socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
        }
        selectedRoom.startGame();
      }
      socket.emit(CONSTANTS.CLIENT_MSG.ACKNOWLEDGED, {});
    } catch (e) {
      console.log(e);
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}