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
    this.app.get('/', (req, res) => res.sendFile(__dirname + '../ui/public/index.html'));
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

  private handleMessage(msg: any, socket: any): any {
    try {
      let selectedRoom = this.roomManager.getRoomBySocket(socket);
      let parsedMessage = this.parser.parseMessage(new Message(msg));
      
      //create room
      if (parsedMessage.getType() == CreateRoomModel.name) {
        if (!this.roomManager.createRoom(parsedMessage as CreateRoomModel, socket)) {
          socket.emit(CONSTANTS.MSG_TYPES.ALREADY_JOINED_ROOM);
          return;
        }
      }
      //list rooms
      else if (parsedMessage.getType() == ListRoomModel.name) {
        socket.emit(CONSTANTS.CLIENT_MSG.ACKNOWLEDGED_LIST_ROOM, this.roomManager.getAllPublicRoomData())
        return;
      }
      //join room
      else if (parsedMessage.getType() == JoinRoomModel.name) {
        if (!this.roomManager.joinRoom(parsedMessage as JoinRoomModel, socket)) {
          socket.emit(CONSTANTS.MSG_TYPES.ROOM_NOT_JOINED);
          return;
        }
      }
      //start game
      else if (parsedMessage.getType() == StartGameModel.name) {
        if (!selectedRoom || selectedRoom.hasGameStarted) {
          socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
          return;
        }
        if (!(<Room>selectedRoom).startGame()) {
          socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
          return;
        }
      }

      //play move
      else if (parsedMessage.getType() == PlayMoveModel.name) {
        if (!selectedRoom || !selectedRoom.hasGameStarted) {
          socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
          return;
        }
        let player = selectedRoom.getPlayerManager().getPlayer(socket);
        if (!selectedRoom.playGameAction(player, parsedMessage as PlayMoveModel)) {
          socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
          return;
        }
      }

      //sync player hand
      else if (parsedMessage.getType() == RequestPlayerSyncModel.name) {
        if (!selectedRoom || !selectedRoom.hasGameStarted) {
          socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
        }
        let player = selectedRoom.getPlayerManager().getPlayer(socket);
        if (!player.resyncPlayer()) {
          socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
          return;
        }
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