import { CreateRoomModel, JoinRoomModel } from "../models/RoomModels";
import { Room } from "./room";

export class RoomManager {

  rooms: Room[];

  constructor() {
    this.rooms = [];
  }

  createRoom(createRoomModel: CreateRoomModel, newPlayer: any): boolean {
    let existingRoom = this.getRoomBySocket(newPlayer);
    if (existingRoom) return false;
    this.rooms.push(new Room(createRoomModel, newPlayer));
    return true;
  }

  getRoomBySocket(searchSocket: any): any {
    let foundRoom = null;
    this.rooms.forEach(room => {
      if (room.existsInRoom(searchSocket)) {
        foundRoom = room;
      }
    });
    return foundRoom;
  }

  joinRoom(joinRoomModel: JoinRoomModel, newPlayer: any): boolean {
    let joinRoom = false;
    let alreadyInRoom = this.getRoomBySocket(newPlayer);
    if (alreadyInRoom) {
      return joinRoom;
    }

    this.rooms.forEach(room => {
      if (room.roomName == joinRoomModel.roomName && 
        room.password == joinRoomModel.password && 
        !room.hasGameStarted) {
          joinRoom = room.joinRoom(newPlayer, joinRoomModel.playerName);
      }
    });
    return joinRoom;
  }
}