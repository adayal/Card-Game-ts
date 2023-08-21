import { CreateRoomModel, JoinRoomModel, ListRoomModel } from "../models/RoomModels";
import { Message } from "../models/message";
import * as Constants from "../../common/CONSTANTS";
import { ParsableModels } from "../models/parsableModels";
import { PlayMoveModel, RequestPlayerSyncModel, StartGameModel, SyncPlayerModel } from "../models/gameActionsModel";

interface ParserInterface {
    parseMessage(message: Message): ParsableModels;
}

export class Parser implements ParserInterface {

    constructor() {

    }

    parseMessage(message: Message): ParsableModels {
        if (message.commandName == Constants.default.MSG_TYPES.CREATE_ROOM) {
            return new CreateRoomModel(message).parse();
        }
        else if (message.commandName == Constants.default.MSG_TYPES.LIST_ROOMS) {
            return new ListRoomModel(message).parse();
        }
        else if (message.commandName == Constants.default.MSG_TYPES.JOIN_ROOM) {
            return new JoinRoomModel(message).parse();
        }
        else if (message.commandName == Constants.default.MSG_TYPES.START_GAME) {
            return new StartGameModel(message).parse();
        }
        else if (message.commandName == Constants.default.ACTIONS.PLAYER_MOVE_ACTION) {
            return new PlayMoveModel(message).parse();
        }
        else if (message.commandName == Constants.default.ACTIONS.UPDATE_PLAYER) {
            return new RequestPlayerSyncModel(message).parse();
        }

        throw Error("Not a parsable model");
    }
}