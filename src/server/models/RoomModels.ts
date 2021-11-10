import { Message } from "./message";
import { ParsableModels } from "./parsableModels";
import { ActionInterface } from './actionModel';


export class CreateRoomModel extends ParsableModels implements ActionInterface {
        
    modelName = 'CreateRoomModel';
    static properties: string[] = ['roomName', 'gameName', 'password'];
    roomName: string;
    gameName: string;
    password: string;
    playerName: string;

    constructor() {
        super(CreateRoomModel.name, CreateRoomModel.properties);
    }

    parse(message: Message) {
      this.isValidModel(message);
      this.roomName = message.objectData.roomName;
      this.gameName = message.objectData.gameName;
      this.password = message.objectData.password;
      this.playerName = message.objectData.playerName;
      
      return this;
    }
}

export class JoinRoomModel extends ParsableModels implements ActionInterface {
  
  modelName = 'JoinRoomModel';
  static properties: string[] = ['roomName', 'password', 'playerName'];
  roomName: string;
  password: string;
  playerName: string;

  constructor() {
    super(JoinRoomModel.name, JoinRoomModel.properties);
  }

  parse(message: Message) {
    this.isValidModel(message);
    this.roomName = message.objectData.roomName;
    this.password = message.objectData.password;
    this.playerName = message.objectData.playerName;

    return this;
  }

}