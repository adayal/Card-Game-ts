import { Message } from "../models/message";
import * as Constants from "../../common/CONSTANTS";
import { CreateRoomModel } from "../models/createRoomModel";
import { ParsableModels } from "../models/parsableModels";

interface ParserInterface {
    parseMessage(message: Message): ParsableModels;
}

export class Parser implements ParserInterface {

    constructor() {

    }

    parseMessage(message: Message): ParsableModels {
        if (message.commandName == Constants.default.MSG_TYPES.CREATE_ROOM) {
            return new CreateRoomModel().parse(message);
        }
        throw Error("Not a parsable model");
    }
}