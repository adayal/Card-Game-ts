import { Message } from "./message";
import { ParsableModels } from "./parsableModels";
import { ActionInterface } from './actionModel';


export class CreateRoomModel extends ParsableModels implements ActionInterface {
        
    modelName = 'CreateRoomModel';
    properties: string[];
    roomName: string;
    gameName: string;
    password: string;

    constructor() {
        super(CreateRoomModel.name);
        this.properties = ['roomName', 'gameName', 'password'];
    }

    parse(message: Message) {
      if (!this.isValidModel(message)) {
        throw new Error("Malformed " + this.modelName);
      }

      this.roomName = message.objectData.roomName;
      this.gameName = message.objectData.gameName;
      this.password = message.objectData.password;
      
      return this;
    }

    isValidModel(message: Message) {
      let isValid = true;
      if (message.objectType != this.modelName) {
        return false;
      }
  
      this.properties.forEach(prop => {
        if (!message.objectData.hasOwnProperty(prop)) {
          isValid = false;
        }
      });
  
      return isValid;
    }
}

export class JoinRoomModel extends ParsableModels implements ActionModel {
  
  modelName = 'JoinRoomModel';
  properties: string[];
  roomName: string;
  password: string;

  constructor() {
    super(JoinRoomModel.name);
    this.properties = ['roomName', 'password'];
  }

  parse(message: Message) {
    if (!this.isValidModel(message)) {
      throw new Error("Malformed " + this.modelName);
    }
    this.roomName = message.objectData.roomName;
    this.password = message.objectData.password;

    return this;
  }

  isValidModel(message: Message) {
    let isValid = true;
    if (message.objectType != this.modelName) {
      return false;
    }

    this.properties.forEach(prop => {
      if (!message.objectData.hasOwnProperty(prop)) {
        isValid = false;
      }
    });

    return isValid;
  }


}