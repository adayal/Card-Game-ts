import express from "express";
import cors from "cors";
import * as http from "http";
import { Message } from "./models/message";
import { Parser } from "./parser/parser";
import { CreateRoomModel } from "./models/createRoomModel";
import CONSTANTS from "../common/CONSTANTS";
import { RoomManager } from "./room/roomManager";

export class Server {
  public static readonly PORT:number = 3000; //config file
  private app: express.Application;
  private server: http.Server;
  private io: any;
  private port: string | number;
  private parser: Parser;
  private rooms: RoomManager[];


  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
    this.parser = new Parser();
    this.rooms = [];
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
      let parsedMessage = this.parser.parseMessage(new Message(msg));
      if (parsedMessage.getType() == CreateRoomModel.name) {
        if (!this.createRoom(parsedMessage as CreateRoomModel, socket)) {
          socket.emit(CONSTANTS.MSG_TYPES.ALREADY_JOINED_ROOM);
        }
      }
      socket.emit(CONSTANTS.CLIENT_MSG.ACKNOWLEDGED, {});
    } catch (e) {
      console.log(e);
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
    }
  }

  private createRoom(createRoomMsg: CreateRoomModel, socket: any): boolean{
    if (this.existsInRoom(socket)) {
      return false;
    }
    console.log("creating room");
    this.rooms.push(new RoomManager(createRoomMsg, socket));
    return true;
  }

  private existsInRoom(socket: any): any{
    let exists = false;
    this.rooms.forEach(room => {
      if (room.existsInRoom(socket)) {
        exists = true;
      }
    });
    return exists;
  }

  public getApp(): express.Application {
    return this.app;
  }
}