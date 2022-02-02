import { Player } from "../../player/player";

/**
 * Card has 2 states (open - face up) (closed - face down)
 * Card has a value defined by a number
 * 2 - 10, Jack = 11, Queen = 12, King = 13, Ace = 14
 * Defining card ranking is controlled by deck class
 * Cards have a suite enum {SPADES, HEARTS, CLUBS, DIAMONDS}
 * 
 * 
 */
export class Card {
    value: number;
    name: string;
    state: string;
    suite: string;
    private owner: Player;
    private cardNumber: number;

    static _STATES = {OPEN: 'OPEN', CLOSED: 'CLOSED'};
    static _SUITES = {HEARTS: 'HEARTS', CLUBS: 'CLUBS', DIAMONDS: 'DIAMONDS', SPADES: 'SPADES'};
    static _NAMES = {JACK: 'JACK', QUEEN: 'QUEEN', KING: 'KING', ACE: 'ACE'};

    constructor(value: number, name: string, state: string, suite: string, cardNumber: number) {
        this.value = value;
        this.name = Object.keys(Card._NAMES).includes(name.toUpperCase()) ? name.toUpperCase() : value + "";
        this.suite = suite;
        this.state = state;
        this.cardNumber = cardNumber;
    }

    setState(state: string) {
      this.state = state;
    }

    setOwner(player: Player) {
      this.owner = player;
    }

    getOwner() {
      return this.owner;
    }

    isEqual(c1: Card): boolean {
      return (c1.name == this.name && c1.suite == this.suite && c1.value == this.value);
    }

    getJsonObject() {
      if (this.state == Card._STATES.CLOSED) {
        return {
          cardNumber: this.cardNumber,
          state: this.state,

        };
      }

      //OPEN
      return {
        cardNumber: this.cardNumber,
        state: this.state,
        value: this.value,
        name: this.name,
        suite: this.suite
      };
    }

    static constructCardFromJson(name: string, suite: string): Card {
      if (name == Card._NAMES.JACK) {
        return new Card(11, name, Card._STATES.OPEN, suite, -1);
      } else if (name == Card._NAMES.QUEEN) {
        return new Card(12, name, Card._STATES.OPEN, suite, -1);
      } else if (name == Card._NAMES.KING) {
        return new Card(13, name, Card._STATES.OPEN, suite, -1);
      } else if (name == Card._NAMES.ACE) {
        return new Card(14, name, Card._STATES.OPEN, suite, -1);
      } else {
        return new Card(Number.parseInt(name), name, Card._STATES.OPEN, suite, -1);
      }
    }
}