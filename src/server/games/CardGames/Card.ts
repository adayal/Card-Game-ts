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

    static _STATES = {OPEN: 'OPEN', CLOSED: 'CLOSED'};
    static _SUITES = {HEARTS: 'HEARTS', CLUBS: 'CLUBS', DIAMONDS: 'DIAMONDS', SPADES: 'SPADES'};
    static _NAMES = {JACK: 'JACK', QUEEN: 'QUEEN', KING: 'KING', ACE: 'ACE'};

    constructor(value: number, name: string, state: string, suite: string) {
        this.value = value;
        this.name = Object.keys(Card._NAMES).includes(name.toUpperCase()) ? name.toUpperCase() : value + "";
        this.suite = suite;
        this.state = state;
    }

    setState(state: string) {
      this.state = state;
    }

    isEqual(c1: Card): boolean {
      return (c1.name == this.name && c1.suite == this.suite && c1.value == this.value);
    }
}