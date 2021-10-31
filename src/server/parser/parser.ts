import { Message } from "../models/message";
import * as Constants from "../../common/CONSTANTS";
import { CreateRoomModel, JoinRoomModel } from "../models/RoomModels";
import { ParsableModels } from "../models/parsableModels";
import { StartGameModel } from "../models/gameModel";

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
        else if (message.commandName == Constants.default.MSG_TYPES.JOIN_GAME) {
            return new JoinRoomModel().parse(message);
        }
        else if (message.commandName == Constants.default.MSG_TYPES.START_GAME) {
            return new StartGameModel().parse(message);
        }

        throw Error("Not a parsable model");
    }
}