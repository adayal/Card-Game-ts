import CONSTANTS from "../../common/CONSTANTS";
import { PlayMoveModel, WaitingForActionModel } from "../models/gameActionsModel";
import { Player } from "../player/player";
import { PlayerManager } from "../player/playerManager";
import { Deck } from "./CardGames/Deck";

export abstract class GameRulesAbstract {
    protected _turnCounter: number;
    protected _actionNames: any;
    protected _deck: Deck;
    protected _hasGameStarted: boolean;
    protected _waitingForAction: WaitingForActionModel;
    protected _gameName: string;
    protected _gameState: any;

    //is it the current Player's turn
    abstract canPlayerplay(player: Player): boolean;
    
    //start the game
    abstract startGame(players: PlayerManager): boolean;
    
    //evaluate the rules of the game given a player and their move
    abstract evaluateRules(player: Player, move: PlayMoveModel): boolean;

    isWaitingForThisAction(caller: WaitingForActionModel) {
        return this._waitingForAction.isEqual(caller);
    }

    runGameChecks(currentAction: WaitingForActionModel) {
        if (!this._hasGameStarted || 
            !this.isWaitingForThisAction(currentAction) || 
            !this._actionNames[currentAction.getActionName()])
            throw new Error(CONSTANTS.CLIENT_MSG.ERROR_ILLEGAL_MOVE);
    }

    constructor(gameName: string, gameState: any, actionNames: any) {
        this._turnCounter = 0;
        this._deck = new Deck();
        this._actionNames = actionNames;
        this._gameName = gameName;
        this._gameState = gameState;
        this._hasGameStarted = false;
    }

}