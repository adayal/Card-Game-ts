import { CreateRoomModel } from "../models/RoomModels";

export class Room {
  sockets: any[];
  roomName: string;
  players: any[]; // change to type player obj
  gameName: string;
  password: string;
  hasGameStarted: boolean;
  game: any; // change to type game obj

  constructor(createRoomModel: CreateRoomModel, newPlayer: any) {
    this.roomName = createRoomModel.roomName;
    this.gameName = createRoomModel.gameName;
    this.password = createRoomModel.password;
    this.sockets = [];
    this.players = [];
    
    this.sockets.push(newPlayer);
  }

  existsInRoom(searchSocket: any) {
    let exists = false;
    this.sockets.forEach(socket => {
      if (socket.id == searchSocket.id) {
        exists = true;
      }
    });
    return exists;
  }

  joinRoom(socket: any): boolean {
    this.sockets.push(socket);
    return true;
  }

  exitRoom(socket: any): boolean {
    return true;
  }

  startGame(): boolean {
    //start the game
    return true;
  }
}