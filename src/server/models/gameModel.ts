import { ActionModel } from "./actionModel";
import { Message } from "./message";
import { ParsableModels } from "./parsableModels";

//start the game
export class StartGameModel extends ParsableModels implements ActionModel {
    modelName = 'StartGameModel';
    properties: string[];
    startGame: boolean;

    constructor() {
      super(StartGameModel.name);
      this.properties = ['startGame'];
    }

    parse(message: Message) {
      if (!this.isValidModel(message)) {
        throw new Error("Malformed " + this.modelName);
      }

      this.startGame = message.objectData.startGame;

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
