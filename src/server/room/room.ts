import { CreateRoomModel } from "../models/RoomModels";
import { PlayerManager } from "../player/playerManager";

export class Room {
  sockets: any[];
  roomName: string;
  playerManager: PlayerManager;
  gameName: string;
  password: string;
  hasGameStarted: boolean;
  game: any; // change to type game obj

  constructor(createRoomModel: CreateRoomModel, socket: any) {
    this.roomName = createRoomModel.roomName;
    this.gameName = createRoomModel.gameName;
    this.password = createRoomModel.password;
    this.sockets = [];
    this.playerManager = new PlayerManager();
    this.playerManager.addPlayer(socket, createRoomModel.playerName);
  }

  existsInRoom(searchSocket: any): boolean {
    let exists = this.playerManager.getPlayer(searchSocket);
    return exists ? true : false;
  }

  joinRoom(socket: any, name: string): boolean {
    return this.playerManager.addPlayer(socket, name)
  }

  exitRoom(socket: any): boolean {
    return this.playerManager.removePlayer(socket);
  }

  startGame(): boolean {
    //start the game
    return true;
  }
}