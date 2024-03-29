import CONSTANTS from "../../common/CONSTANTS";
import { Card } from "../games/CardGames/Card";
import { SyncPlayerModel } from "../models/gameActionsModel";
import { ParsableModels } from "../models/parsableModels";

export class Player {
    private _points: number;
    private _playerNumber: number;
    private _socket: any;
    private _playerName: string;
    private _hand: Card[];
    private _openField: Card[];
    private _previousSockets: any[];
    private _lastSentMessage: SyncPlayerModel | null;

    constructor(socket: any, playerName: string, playerNumber: number) {
        this._socket = socket;
        this._playerName = playerName;
        this._previousSockets = [];
        this._hand = [];
        this._previousSockets.push(socket);
        this._points = 0;
        this._playerNumber = playerNumber;
        this._openField = [];
    }

    getPlayerName() {
        return this._playerName;
    }

    getPlayerNumber(): number {
        return this._playerNumber;
    }

    getPoints() {
        return this._points;
    }

    getSocketId() {
        return this._socket.id;
    }

    getSocket() {
        return this._socket;
    }

    getPreviousSocketConnections() {
        return this._previousSockets;
    }

    getCards() {
        return this._hand;
    }

    getOpenField() {
        return this._openField;
    }

    setOpenField(field: Card[]) {
        this._openField = field;
    }

    setPoints(pts: number) {
        this._points = pts;
    }

    setCards(giveHand: Card[]) {
        this._hand = giveHand;
    }

    clearHand() {
        this._hand = [];
    }

    resetPlayerState() {
        this._hand = [];
        this._points = 0;
        this._openField = [];
        this.deleteHistory();
    }

    addCardToHand(c: Card) {
        c.setOwner(this);
        this._hand.push(c);
    }

    addCardToField(c: Card) {
        c.setOwner(this);
        this._openField.push(c);
    }

    playCard(cardToRemove: Card): any {
        for (let i = 0; i < this._hand.length; i++) {
            if (this._hand[i].isEqual(cardToRemove)) {
                return this._hand.splice(i, 1)[0];
            }
        }

        for (let i = 0; i < this._openField.length; i++) {
            if (this._openField[i].isEqual(cardToRemove)) {
                return this._openField.splice(i, 1)[0];
            }
        }

        return null;
    }

    removeCardAtIndex(idx: number): any {
        if (idx >= this._hand.length) return null;
        return this._hand.splice(idx, 1)[0];
    }

    equals(player2: Player) {
        return this.getSocketId() == player2.getSocketId()
    }

    //todo add layer of encryption here
    //has to be stringified if it's too big of an object (:facepalm:)
    sendToPlayer(typeOfMsg: string, msg: any) {
        this._socket.emit(typeOfMsg, JSON.stringify(msg));
    }

    updateOpponentPlayedCard(opponentPlayedCard: Card[], shouldForceSync: boolean, keepPreviousValues: boolean) {
        let opponentOpenField = null;
        let visiblePile = null;
        if (keepPreviousValues && this._lastSentMessage) {
            opponentOpenField = <Card[]>this._lastSentMessage.getJsonObject().opponent.opponentOpenField;
            visiblePile = <Card[]>this._lastSentMessage.getJsonObject().sharedVisiblePile;
        }
        let model = new SyncPlayerModel(this._hand, this._openField, opponentOpenField, opponentPlayedCard, visiblePile, this._points, shouldForceSync);
        let msg = model.getJsonObject();
        this._lastSentMessage = model;
        this.sendToPlayer(CONSTANTS.ACTIONS.UPDATE_PLAYER, msg);
    }

    updatePlayerHand(opponentOpenField: Card[] | null, opponentPlayedCard: Card[] | null, visiblePile: Card[] | null, shouldForceSync: boolean) {
        //send update hand message
        //send current hand of player
        let model = new SyncPlayerModel(this._hand, this._openField, opponentOpenField, opponentPlayedCard, visiblePile, this._points, shouldForceSync);
        let msg = model.getJsonObject();
        this._lastSentMessage = model;
        this.sendToPlayer(CONSTANTS.ACTIONS.UPDATE_PLAYER, msg);
    }

    doesHandContainSuite(suite: string, checkOpenOnly: boolean) {
        let found = false;
        this._hand.forEach(x => {
            if (x.suite == suite) {
                found = true;
            }
        });
        this._openField.forEach(x => {
            if (checkOpenOnly && x.state == Card._STATES.OPEN) {
                if (x.suite == suite) found = true;
            } else {
                if (x.suite == suite) found = true;
            }
        });
        return found;
    }

    getCardFromHand(card: Card, value: string, suite: string): Card | undefined {
        let cardFound = undefined;
        cardFound = this._hand.find((x) => {
            return x.isEqual(card);
        });
        if (!cardFound) {
            cardFound = this._openField.find((x) => {
                return x.isEqual(card);
            });
        }
        return cardFound;
    }

    deleteHistory() {
        this._lastSentMessage = null;
    }

    //send the last message if not null
    resyncPlayer(): boolean{
        if (!this._lastSentMessage) return false;
        
        let message = this._lastSentMessage.forceSync().getJsonObject();
        this.sendToPlayer(CONSTANTS.ACTIONS.UPDATE_PLAYER, message);
        this._lastSentMessage.unsetForceSync();
        return true;
    }
}