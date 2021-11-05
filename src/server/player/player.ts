import { Card } from "../games/CardGames/Card";

export class Player {
    private _points: number;

    socket: any;
    playerName: string;
    hand: Card[];
    previousSockets: any[];

    constructor(socket: any, playerName: string) {
        this.socket = socket;
        this.playerName = playerName;
        this.previousSockets = [];
        this.hand = [];
        this.previousSockets.push(socket);
        this._points = 0;
    }

    getPoints() {
        return this._points;
    }

    setPoints(pts: number) {
        this._points = pts;
    }

    getSocketId() {
        return this.socket.id;
    }

    getSocket() {
        return this.socket;
    }

    getPreviousSocketConnections() {
        return this.previousSockets;
    }

    setCards(giveHand: Card[]) {
        this.hand = giveHand;
    }

    getCards() {
        return this.hand;
    }

    clearHand() {
        this.hand = [];
    }



    playCard(cardToRemove: Card): any {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i].isEqual(cardToRemove)) {
                return this.hand.splice(i, 1)[0];
            }
        }

        return null;
    }

    removeCardAtIndex(idx: number): any {
        if (idx >= this.hand.length) return null;
        return this.hand.splice(idx, 1)[0];
    }

    equals(player2: Player) {
        return this.getSocketId() == player2.getSocketId()
    }
}