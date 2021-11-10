import { Card } from "./Card";

export class Deck {
  _deck: Card[];
  _discardDeck: Card[];

  constructor() {
    //create new deck
    this.resetDeck();
  }

  private initDeck() {
    //2 - 10, 4 suites
    //jack 4 suites, 11
    //queen 4 suites, 12
    //king 4 suites, 13
    //ace 4 suites, 14
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
    for (let i = this._deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._deck[i], this._deck[j]] = [this._deck[j], this._deck[i]];
    }
  }

  public discardCard(card: Card) {
    for(let i = 0; i < this._deck.length; i++) {
      if (this._deck[i].isEqual(card)) {
        this._discardDeck.push(this._deck.splice(i, 1)[0]);
        return true;
      }
    }
    return false;
  }

  public getDeck() {
    return this._deck;
  }

  public getDiscardDeck() {
    return this._discardDeck;
  }

  public drawCard(drawFromBottom: boolean): Card | null {
    return this._deck.shift() ?? null;
  }

  public isCardInDeck(card: Card): boolean{
    let foundCard = null;
    this._deck.forEach(deckCard => {
      if (deckCard.isEqual(card)) {
        foundCard = this._deck;
        return;
      }
    });
    return foundCard != null;
  }

  public resetDeck() {
    this._discardDeck = [];
    this._deck = [];
    this.initDeck();
  }
}