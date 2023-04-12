import CONSTANTS from "../../common/CONSTANTS";
import { PlayMoveModel, RequestPlayerSyncModel, StartGameModel } from "../models/gameActionsModel";
import { ParsableModels } from "../models/parsableModels";
import { CreateRoomModel, JoinRoomModel, ListRoomModel } from "../models/RoomModels";
import { Room } from "./room";

export class RoomManager {

  rooms: Room[];

  constructor() {
    this.rooms = [];
  }

  handleIncomingRoomMessage(model: ParsableModels, socket: any): void {
    switch (model.getType()) {
      case CreateRoomModel.name:
        this.createRoom(<CreateRoomModel>model, socket);
      case ListRoomModel.name:
        this.emitAllPublicRoomData(socket);
      case JoinRoomModel.name:
        this.joinRoom(<JoinRoomModel> model, socket);
      case StartGameModel.name:
        this.startGame(<StartGameModel> model, socket);
      case PlayMoveModel.name:
        this.playMoveInGame(<PlayMoveModel> model, socket);
      case RequestPlayerSyncModel.name:
        this.playerSync(<RequestPlayerSyncModel> model, socket);
      default:
        socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
    }
  }

  createRoom(createRoomModel: CreateRoomModel, newPlayer: any): boolean {
    let existingRoom = this.getRoomBySocket(newPlayer);
    if (existingRoom) return false;
    this.rooms.push(new Room(createRoomModel, newPlayer));
    return true;
  }

  playMoveInGame(playRoom: PlayMoveModel, socket: any): void {
    let selectedRoom = this.getRoomBySocket(socket);
    if (!selectedRoom || !selectedRoom.getHasGameStarted()) {
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
      return;
    }
    let player = selectedRoom.getPlayerManager().getPlayer(socket);
    if (!selectedRoom.playGameAction(player, playRoom)) {
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
      return;
    }
  }

  playerSync(model: RequestPlayerSyncModel, socket: any): void {
    let selectedRoom = this.getRoomBySocket(socket);
    if (!selectedRoom || !selectedRoom.getHasGameStarted()) {
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
    }
    let player = selectedRoom.getPlayerManager().getPlayer(socket);
    if (!player.resyncPlayer()) {
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
      return;
    }
  }

  startGame(game: StartGameModel, socket: any): void {
    let selectedRoom = this.getRoomBySocket(socket);
    if (!selectedRoom || selectedRoom.getHasGameStarted()) {
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
      return;
    }
    if (!(<Room>selectedRoom).startGame()) {
      socket.emit(CONSTANTS.CLIENT_MSG.GENERIC_ERROR, {});
    }
  }
  

  getRoomBySocket(searchSocket: any): Room | any {
    let foundRoom = null;
    this.rooms.forEach(room => {
      if (room.existsInRoom(searchSocket)) {
        foundRoom = room;
      }
    });
    return foundRoom;
  }

  

  //@Deprecate
  getAllPublicRoomData(): any[] {
    let allRoomData: any[] = [];
    this.rooms.forEach(room => {
      allRoomData.push(room.getPublicData());
    });
    return allRoomData;
  }

  emitAllPublicRoomData(socket: any): void {
    let allRoomData: any[] = [];
    this.rooms.forEach(room => {
      allRoomData.push(room.getPublicData());
    });
    socket.emit(CONSTANTS.CLIENT_MSG.ACKNOWLEDGED_LIST_ROOM, allRoomData);
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