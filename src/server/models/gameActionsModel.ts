import { ActionModel } from "./actionModel";
import { Message } from "./message";
import { ParsableModels } from "./parsableModels";

//start the game
export class StartGameModel extends ParsableModels implements ActionModel {
    modelName = 'StartGameModel';
    static properties: ['startGame'];
    startGame: boolean;

    constructor() {
      super(StartGameModel.name, StartGameModel.properties);
    }

    parse(message: Message) {
      this.isValidModel(message);
      this.startGame = message.objectData.startGame;

      return this;
    }
}

/**
 * Play a move
 * Contains the player information
 * Contains the move played by the user (possible moves):
 *    - Play card
 *    - Draw card from deck
 */
export class PlayMoveModel extends ParsableModels implements ActionModel {
  modelName = 'PlayMoveModel';
  static properties: ['playerInfo', 'play', 'draw'];
  

  constructor() {
    super(PlayMoveModel.name, PlayMoveModel.properties);
  }

  parse(message: Message) {
    this.isValidModel(message);
    
    return this;
  }
}

