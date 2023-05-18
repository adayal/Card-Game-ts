import { Card } from "../games/CardGames/Card";
import { ActionModel } from "./actionModel";
import { Message } from "./message";
import { ParsableModels } from "./parsableModels";

//start the game
export class StartGameModel extends ParsableModels implements ActionModel {
    modelName = 'StartGameModel';
    static properties: string[] = ['startGame'];
    startGame: boolean;

    constructor(rawMessage: Message) {
      super(StartGameModel.name, StartGameModel.properties, rawMessage);
    }

    parse() {
      this.isValidModel(this.rawMessage);
      this.startGame = this.rawMessage.objectData.startGame;

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
  static properties: string[] = ['playerNumber', 'actionName', 'action'];
  

  constructor(rawMessage: Message) {
    super(PlayMoveModel.name, PlayMoveModel.properties, rawMessage);
    this._action = new ActionPlayModel(new Message(this.rawMessage.objectData.action));
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

  parse() {
    this.isValidModel(this.rawMessage);
    this._action.parse();
    this._playerNumber = this.rawMessage.objectData.playerNumber;
    this._actionName = this.rawMessage.objectData.actionName;
``
    return this;
  }

  getWaiterRepresentation(): WaitingForActionModel {
    return new WaitingForActionModel(this._playerNumber, this._actionName, new Message(null))
  }
}

export class ActionPlayModel extends ParsableModels implements ActionModel {
  modelName = 'ActionPlayModel';
  static properties: string[] = ['pickedTrump', 'playedCard', 'offerDraw', 'offerResign'];
  private _pickedTrump: string;
  private _playedCard: any;
  private _offerDraw: boolean;
  private _offerResign: boolean;
  
  constructor(rawMessage: Message) {
    super(ActionPlayModel.name, ActionPlayModel.properties, rawMessage);
  }

  parse() {
    this.isValidModel(this.rawMessage, true);
    this._offerDraw = this.rawMessage.objectData.offerDraw ?? false;
    this._offerResign = this.rawMessage.objectData.offerResign ?? false;
    this._pickedTrump = this.rawMessage.objectData.pickedTrump;
    this._playedCard = this.rawMessage.objectData.playedCard ?? null;
    return this;
  }

  getPickedTrump() {
    return this._pickedTrump;
  }

  getPlayedCard(): Card {
    return Card.constructCardFromJson(this._playedCard.name, this._playedCard.suite)
  }
}

export class WaitingForActionModel extends ParsableModels implements ActionModel {
  modelName = 'WaitingAction';
  static properties: string[] = ['playerNumber', 'actionName'];
  private _playerNumber: number;
  private _actionName: string;

  constructor(playerNumber: number, actionName: string, rawMessage: Message) {
    super(WaitingForActionModel.name, WaitingForActionModel.properties, rawMessage);
    this._playerNumber = playerNumber;
    this._actionName = actionName;
  }
  
  parse() {
    this.isValidModel(this.rawMessage);
    
    this._playerNumber = this.rawMessage.objectData.playerNumber;
    this._actionName = this.rawMessage.objectData.actionName;
    return this;
  }

  getActionName(): string{
    return this._actionName;
  }

  isEqual(waiter: WaitingForActionModel) {
    return this._playerNumber == waiter._playerNumber && this._actionName == waiter._actionName;
  }
}

//Request the server to rsync player data
export class RequestPlayerSyncModel extends ParsableModels implements ActionModel {
  modelName = "RequestPlayerSyncModel";
  static properties: string[] = ['playerNumber'];
  private _playerNumber: Number;

  constructor(rawMessage: Message) {
    super(RequestPlayerSyncModel.name, RequestPlayerSyncModel.properties, rawMessage);
  }

  parse() {
    this.isValidModel(this.rawMessage, false);
    this._playerNumber = this.rawMessage.objectData.playerNumber;
    return this;
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

    public unsetForceSync() {
      this._forceSync = false;
      return this;
    }

    public getJsonObject() {
      //foreach player hand, convert the cards to a card json object
      //hack to get around circular reference error
      return {
        playerHand: this.getCardJsonObject(this._playerHand),
        playerOpenField: this.getCardJsonObject(this._playerOpenField),
        opponent: {
          opponentOpenField: this.getCardJsonObject(this._opponentOpenField),
          opponentPlayedCards: this.getCardJsonObject(this._opponentPlayedCard),
        },
        sharedVisiblePile: this.getCardJsonObject(this._visiblePile),
        points: this._points,
        forceSync: this._forceSync
      };
    }

    private getCardJsonObject(cards: Card[] | null) {
      let convertCardsToObjects: Object[] = [];
      cards?.forEach((card) => {
        convertCardsToObjects.push((<Card>card).getJsonObject());
      })
      return convertCardsToObjects;
    }
}