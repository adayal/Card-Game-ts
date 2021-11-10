import { Card } from "../games/CardGames/Card";
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
  private _playerNumber: number;
  private _actionName: string;
  private _action: ActionPlayModel;
  
  //nested objects
  static properties: ['playerNumber', 'actionName', '_action'];
  

  constructor() {
    super(PlayMoveModel.name, PlayMoveModel.properties);
  }

  getPlayerNumber(): number{
    return this._playerNumber;
  }

  getActionName(): string{
    return this._actionName.toUpperCase();
  }

  getAction(): ActionPlayModel{
    return this._action;
  }

  parse(message: Message) {
    this.isValidModel(message);
    let actionMessage = new ActionPlayModel().parse(<Message>message.objectData.actionMessage);
    this._playerNumber = message.objectData.playerNumber;
    this._actionName = message.objectData.actionName;
    this._action = actionMessage;

    return this;
  }

  getWaiterRepresentation(): WaitingForActionModel {
    return new WaitingForActionModel(this._playerNumber, this._actionName)
  }
}

export class ActionPlayModel extends ParsableModels implements ActionModel {
  modelName = 'ActionPlayModel';
  static properties: ['pickedTrump', 'playedCard', 'offerDraw', 'offerResign'];
  private _pickedTrump: string;
  private _playedCard: Card | null;
  private _offerDraw: boolean;
  private _offerResign: boolean;
  
  constructor() {
    super(ActionPlayModel.name, ActionPlayModel.properties);
  }

  parse(message: Message) {
    this.isValidModel(message);
    this._offerDraw = message.objectData.offerDraw ?? false;
    this._offerResign = message.objectData.offerResign ?? false;
    this._pickedTrump = message.objectData.pickedTrump;
    this._playedCard = message.objectData.playedCard ?? null;
    return this;
  }

  getPickedTrump() {
    return this._pickedTrump;
  }

  getPlayedCard() {
    return this._playedCard;
  }
}

export class WaitingForActionModel extends ParsableModels implements ActionModel {
  modelName = 'WaitingAction';
  static properties: ['playerNumber', 'actionName'];
  private _playerNumber: number;
  private _actionName: string;

  constructor(playerNumber: number, actionName: string) {
    super(WaitingForActionModel.name, WaitingForActionModel.properties);
    this._playerNumber = playerNumber;
    this._actionName = actionName;
  }
  
  parse(message: Message) {
    this.isValidModel(message);
    
    this._playerNumber = message.objectData.playerNumber;
    this._actionName = message.objectData.actionName;
    return this;
  }

  getActionName(): string{
    return this._actionName;
  }

  isEqual(waiter: WaitingForActionModel) {
    return this._playerNumber == waiter._playerNumber && this._actionName == waiter._actionName;
  }
}

//sync player model
/**
 * This object is sending data to a player. It will not be used for sending data back
 * Sending data just needs to be able to turn into a json format
 * Format is: 
 *    {
 *      playerHand: Card[]
 *      playerOpenField: Card[]
 *      opponentOpenField: Card[]
 *      opponentPlayedCard: Card[]
 *      visiblePile: Card[] (shared)
 *      points: number
 *      forceSync: boolean
 *    }
 * 
 */
export class SyncPlayerModel {
    private _playerHand: any[];
    private _playerOpenField: any[] | null;
    private _opponentOpenField: any[] | null;
    private _opponentPlayedCard: any[] | null;
    private _visiblePile: any[] | null;
    private _points: number;
    private _forceSync: boolean;
    
    constructor(playerHand: Card[], playerOpenField: Card[] | null, opponentOpenField: Card[] | null, opponentPlayedCard: Card[] | null, visiblePile: Card[] | null, points: number, forceSync: boolean) {
      this._playerHand = playerHand;
      this._playerOpenField = playerOpenField;
      this._opponentOpenField = opponentOpenField;
      this._opponentPlayedCard = opponentPlayedCard;
      this._visiblePile = visiblePile;
      this._points = points;
      this._forceSync = forceSync;
    }

    public forceSync() {
      this._forceSync = true;
      return this;
    }

    public getJsonObject() {
      return {
        playerHand: this._playerHand,
        playerOpenField: this._playerOpenField,
        opponent: {
          opponentOpenField: this._opponentOpenField,
          opponentPlayedCards: this._opponentPlayedCard
        },
        sharedVisiblePile: this._visiblePile,
        points: this._points,
        forceSync: this._forceSync
      };
    }
}