"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    constructor(message) {
        this.properties = ['commandName', 'objectType', 'objectData', 'socket'];
        if (this.isValidMessage(message)) {
            this.commandName = message.commandName;
            this.objectType = message.objectType;
            this.objectData = message.objectData;
            return this;
        }
        throw "MESSAGE_PARSE_ERROR";
    }
    isValidMessage(message) {
        console.log(this.properties);
        this.properties.forEach(prop => {
            if (!message.hasOwnProperty(prop)) {
                return false;
            }
        });
        return true;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map