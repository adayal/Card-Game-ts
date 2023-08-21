import { Message } from "./message";
import { ActionInterface } from './actionModel';
import { ParsableModels } from "./parsableModels";


export class CreateRoomModel extends ParsableModels implements ActionInterface {
        
    modelName = 'CreateRoomModel';
    static properties: string[] = ['roomName', 'gameName', 'password'];
    roomName: string;
    gameName: string;
    password: string;
    playerName: string;

    constructor(rawMessage: Message) {
        super(CreateRoomModel.name, CreateRoomModel.properties, rawMessage);
    }

    parse() {
      this.isValidModel(this.rawMessage);
      this.roomName = this.rawMessage.objectData.roomName;
      this.gameName = this.rawMessage.objectData.gameName;
      this.password = this.rawMessage.objectData.password;
      this.playerName = this.rawMessage.objectData.playerName;
      
      return this;
    }
}

export class JoinRoomModel extends ParsableModels implements ActionInterface {
  
  modelName = 'JoinRoomModel';
  static properties: string[] = ['roomName', 'password', 'playerName'];
  roomName: string;
  password: string;
  playerName: string;

  constructor(rawMessage: Message) {
    super(JoinRoomModel.name, JoinRoomModel.properties, rawMessage);
  }

  parse() {
    this.isValidModel(this.rawMessage);
    this.roomName = this.rawMessage.objectData.roomName;
    this.password = this.rawMessage.objectData.password;
    this.playerName = this.rawMessage.objectData.playerName;

    return this;
  }
}

export class ListRoomModel extends ParsableModels implements ActionInterface {
  modelName = 'ListRoomModel';
  static properties: string[] = [];
  constructor(rawMessage: Message) {
    super(ListRoomModel.name, ListRoomModel.properties, rawMessage);
  }

  parse() {
    this.isValidModel(this.rawMessage);
    return this;
  }
}