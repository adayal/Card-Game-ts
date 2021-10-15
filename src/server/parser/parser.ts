import { Message } from "../models/message";

interface ParserInterface {
    parseMessage(message: Message): any;
}

export class Parser implements ParserInterface {

    constructor() {

    }

    parseMessage(message: Message): any {
        
    }
}