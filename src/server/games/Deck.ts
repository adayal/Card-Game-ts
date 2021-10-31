import { Card } from "./CardGames/Card";

export class Deck {
  _deck: Card[];
  _discardDeck: Card[];

  constructor() {
    //create new deck
    this.resetDeck();
  }

  private initDeck() {
    //2 - 10, 4 suites
    //jack 4 suites
    //queen 4 suites
    //king 4 suites
    //ace 4 suites
    for (let i = 2; i <= 10; i++) {
      for (let suite in Card._SUITES) {
        this._deck.push(new Card(i, i + "", Card._STATES.CLOSED, suite));
      }
    }

    let counter = 11;
    for (let suite in Card._SUITES) {
      for (let name in Card._NAMES) {
        this._deck.push(new Card(counter++, name, Card._STATES.CLOSED, suite));
      }
    }
  }

  public shuffleDeck() {

  }

  public discardCard(card: Card) {
    if (this._)
  }

  public isCardInDeck(card: Card): boolean{
    let foundCard = null;
    this._deck.forEach(deckCard => {
      if (deckCard.isEqual(card)) {
        foundCard = this._deck;
        return;
      }
    });
    return foundCard;
  }

  public resetDeck() {
    this._discardDeck = [];
    this._deck = [];
    this.initDeck();
  }
}