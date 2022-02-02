import CONSTANTS from "../../common/CONSTANTS";
import { PlayMoveModel, WaitingForActionModel } from "../models/gameActionsModel";
import { Player } from "../player/player";
import { PlayerManager } from "../player/playerManager";
import { Card } from "./CardGames/Card";
import { GameRulesAbstract } from "./gameRulesAbstract";

export class SaathAath extends GameRulesAbstract {

    //the game expects these action names to handle.
    //anything else will error out
    public static readonly _actionNames = { 
        PICKED_TRUMP: "PICKED_TRUMP",
        SELCTING_OPPONENT_CARD: "SELCTING_OPPONENT_CARD",
        PLAY_CARD: "PLAY_CARD",
        OFFER_DRAW: "OFFER_DRAW", 
        OFFER_RESTART: "OFFER_RESTART"}; 

    //managers the players in the game
    private _playerManager: PlayerManager;

    //manages the field shared by the players (if a card is thrown from an opponent)
    private _field: Card[];

    private _trumpType: string;

    constructor() {
        super(SaathAath.name, null, SaathAath._actionNames);
    }

    canPlayerplay(player: Player): boolean {
        throw new Error("Method not implemented.");
    }

    //must have 2 players in game
    //split deck
    //shuffle deck
    startGame(playerManager: PlayerManager): boolean {
        if (playerManager.players.length != 2) {
            return false;
        }

        if (this._hasGameStarted) {
            return false;
        }

        //initialize game lock
        this._hasGameStarted = true;

        this._field = [];
        this._playerManager = playerManager;
        this._playerManager.resetAllHands();
        this._deck.resetDeck();
        this.discardHalfDeck();
        this._deck.shuffleDeck();
        let didDeal = this.dealCardsToPlayer(0, 5, false, false) && this.dealCardsToPlayer(1, 5, false, false);
        if (didDeal) {

            //set wait action lock
            this._waitingForAction = new WaitingForActionModel(0, this._actionNames.PICKED_TRUMP);
            
            //set turn counter to 0
            this._turnCounter = 0;

            //inform player 1 has to pick the trump
            (<Player>this._playerManager.getPlayerByNumber(0)).sendToPlayer(CONSTANTS.CLIENT_MSG.PICK_TRUMP, null);

            return true;
        }

        //release game lock
        this._hasGameStarted = false;

        return false;
    }

    //deal cards to player
    //player number is assigned directly to player object
    private dealCardsToPlayer(playerNumber: number, numberOfCards: number, dealToPlayerField: boolean, isFacedDown: boolean): boolean {
        if (numberOfCards >= this._deck.getDeck().length || playerNumber > 1) {
            return false;
        }
        let current = this._playerManager.getPlayerByNumber(playerNumber);
        let other = this._playerManager.getPlayerByNumber(Number(!playerNumber));
        if (!current || !other) {
            return false;
        }

        let currentPlayer = (<Player>current);
        let opponentPlayer = (<Player>other);

        for (let i = 0; i < numberOfCards; i++) {
            let drawnCard = this._deck.drawCard(false);
            if (drawnCard == null) {
                //no more cards in deck
                return false;
            }
            if (isFacedDown) {
                //closed means nobody can see
                drawnCard.setState(Card._STATES.CLOSED);
            } else {
                drawnCard.setState(Card._STATES.OPEN);  
            }

            if (dealToPlayerField) {
                currentPlayer.addCardToField(drawnCard);
            } else {
                currentPlayer.addCardToHand(drawnCard);
            }

        }
        currentPlayer.updatePlayerHand(opponentPlayer.getOpenField(), null, this._field, true);
        return true;
    }

    evaluateRules(player: Player, move: PlayMoveModel): boolean {
        //run game checks
        this.runGameChecks(move.getWaiterRepresentation());
        switch (this._actionNames[move.getActionName()]) {
            case this._actionNames.PICKED_TRUMP: 
                return this.resolvePickedTrump(player, move);
            case this._actionNames.PLAY_CARD:
                return this.resolvePlayCard(player, move);
            case this._actionNames.OFFER_DRAW:
                return this.resolveOfferDraw(player, move);
            case this._actionNames.OFFER_RESTART:
                return this.resolveOfferResign(player, move);
            case this._actionNames.SELCTING_OPPONENT_CARD:
            break;
        }
        
        return true;
    }

    /**
     * Player is picking the trump
     * Set the trump to the action - trump action
     * Echo to player 1 and 2 what the trump has been chosen as
     * Continue to deal 5 cards face down to each player
     * Then 5 cards face up to each player
     * @param player 
     * @param move 
     * @returns boolean if tasks completed 
     */
    private resolvePickedTrump(player: Player, move: PlayMoveModel): boolean {
        this._trumpType = move.getAction().getPickedTrump();
        this._playerManager.sendToAllPlayers(CONSTANTS.CLIENT_MSG.PICKED_TRUMP, {pickedTrump: this._trumpType});

        //deal 5 cards face down and then 5 cards face up to each player
        let dealCards = 
            this.dealCardsToPlayer(0, 5, true, true) && 
            this.dealCardsToPlayer(1, 5, true, true) && 
            this.dealCardsToPlayer(0, 5, true, false) && 
            this.dealCardsToPlayer(1, 5, true, false); 
        
        this._waitingForAction = new WaitingForActionModel(0, this._actionNames.PLAY_CARD);
        (<Player>this._playerManager.getPlayerByNumber(0)).sendToPlayer(CONSTANTS.CLIENT_MSG.YOUR_TURN, null);
        return dealCards;
    }

    /**
     * Player is playing a card on the field.
     * If the turnCounter % 2 == 0, then it's the first persons turn
     *      Rules:
     *          Any card can be played so long as it's either visible or in player hand
     *          If played from hand, subtract from hand
     *          If played from field, subtract from field, add hidden field card to player's hand
     *          Set turn counter to !((Number)player.getNumber) 
     *          Echo to player 1 that card has been played to field
     *          Echo to player 2 that card has been played to field
     * Else
     *      Rules:
     *          Check suite of card matches what is on the field
     *              if not matches, check if current player's hand and field have any that have same suite
     *                  return error to player that they must play the same suite first
     *          If Lower rank, award first player. Set turn counter to first player's player Number
     *          If Higher rank, award second player. Set turn counter to second player's player Number
     *          Echo to each player the outcome
     *          Echo to player (turn counter)'s turn to play         
     * 
     *          If total awarded points == 15
     *              Set Winner: Player1.points > Player2.points ? player1 : player2
     *              PointsCarry: Player1.points - Player2.points
     *              PointsAdv: Winner.playerNumber
     *              Show winner to each player
     *              Offer restart to each player
     *              set hasStarted = false
     *          
     *          
     * @param player 
     * @param move 
     */
    private resolvePlayCard(player: Player, move: PlayMoveModel): boolean {
        if (!this.canPlayCard(player, move)) {
            return false;
        }

        let playedCard = player.playCard(move.getAction().getPlayedCard()!);
        if (!playedCard) {
            return false;
        }

        //announce to other player
        let otherPlayer = <Player>this._playerManager.getPlayerByNumber(Number(!player.getPlayerNumber()));
        otherPlayer.updateOpponentPlayedCard([playedCard], true, true);
        
        let winner: Player;
        
        if (this._field.length > 0) {
            let opponentsCard = this._field[0];
            if (opponentsCard.suite == (<Card>playedCard).suite) {
                winner = opponentsCard.value > (<Card>playedCard).value ? otherPlayer : player;
                this.handleLocalWin(winner);
            } else {
                //if opponent's card is trump, it automatically wins
                //if current player's card is trump, it automatically wins
                //if none are true ^, opponent automatically wins
                if (opponentsCard.suite == this._trumpType) {
                    winner = otherPlayer;
                    this.handleLocalWin(otherPlayer);
                } else if ((<Card>playedCard).suite == this._trumpType) {
                    winner = player;
                    this.handleLocalWin(player);
                } else {
                    winner = otherPlayer;
                    this.handleLocalWin(otherPlayer);
                }
            }

            //check if winner
            if (!this.isWinner()) {
                //reset the field
                this._field = [];

                //wait for winner's turn
                this._waitingForAction = new WaitingForActionModel(winner.getPlayerNumber(), this._actionNames.PLAY_CARD);
                winner.sendToPlayer(CONSTANTS.CLIENT_MSG.YOUR_TURN, null);
            }
        } else {
            this._field.push(playedCard);
            this._turnCounter = otherPlayer.getPlayerNumber();
            this._waitingForAction = new WaitingForActionModel(otherPlayer.getPlayerNumber(), this._actionNames.PLAY_CARD);
            otherPlayer.sendToPlayer(CONSTANTS.CLIENT_MSG.YOUR_TURN, null);
        }

        return true;
    }

    private canPlayCard(player: Player, move: PlayMoveModel): boolean {
        if (!this.isWaitingForThisAction(move.getWaiterRepresentation())) {
            return false;
        }

        let playedCard = player.getCardFromHand(move.getAction().getPlayedCard(), "", "");
        if (!playedCard) {
            return false;
        }

        //if the card is faced down
        if (playedCard.state == Card._STATES.CLOSED) {
            return false;
        }

        if (this._field.length > 0) {
            //suite must match
            //if suite doesn't match, check if the player has a card where the suite does match
            let opponentCard = this._field[0];
            if (opponentCard.suite != playedCard.suite && 
                playedCard.suite != this._trumpType && 
                player.doesHandContainSuite(opponentCard.suite, true)) {
                return false;
            }
        }

        return true;
    }

    private handleLocalWin(winner: Player) {
        winner.setPoints(winner.getPoints() + 1);
        winner.sendToPlayer(CONSTANTS.CLIENT_MSG.LOCAL_WINNER, {});
        let loser = this._playerManager.getPlayerByNumber(winner.getPlayerNumber() - 1);
        if (loser) {
            (<Player>loser).sendToPlayer(CONSTANTS.CLIENT_MSG.LOCAL_LOSER, {});
        }
        this._turnCounter = winner.getPlayerNumber();
    }

    /**
     * 
     * @param player 
     * @param move 
     * @returns 
     */
    private resolveOfferDraw(player: Player, move: PlayMoveModel) {
        return true;
    }

    private resolveOfferResign(player: Player, move: PlayMoveModel) {
        return true;
    }

    private isWinner(): boolean{
        if (this._playerManager.tallyPoints() == 15) {
            //player1 is supposed to make 8 points
            let player1 = <Player>this._playerManager.getPlayerByNumber(0);
            let player2 = <Player>this._playerManager.getPlayerByNumber(1);
            if (player1.getPoints() > 8) {
                //won by margin

            } else if (player1.getPoints() == 8) {
                //nobody won
            } else {
                //player 2 won by margin
            }
            this._playerManager.resetAllStates();
        }
        return false;
    }


    private discardHalfDeck() {
        let deck = this._deck.getDeck();
        for (let i = 0; i < deck.length; i++) {
            if (deck[i].value >= 2 && deck[i].value < 7) {
                this._deck.discardCard(deck[i]);
            }
            if (deck[i].value == 7 && ([Card._SUITES.DIAMONDS, Card._SUITES.CLUBS].indexOf(deck[i].suite) != -1)) {
                this._deck.discardCard(deck[i]);
            }
        }
    }
    
}