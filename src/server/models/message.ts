import { ErrorModel } from "./errorModel";
import { SuccessModel } from "./successModel";

interface MessageInterface {
    commandName: string;
    objectType: string;
    objectData: any;
    toError(exception: any): ErrorModel;
    toSuccess(): SuccessModel;
}

export class Message implements MessageInterface {
    
    commandName: string;
    objectType: string;
    objectData: any;
    messageId: string;
    properties: string[];

    constructor(message?: any) {
        if (!message) {
            this.commandName = "NULL";
            this.objectType = "NULL";
            this.objectData = null;
            this.messageId = "NULL";
            this.properties = [];
            return this;
        }
        this.properties = ['commandName', 'objectType', 'objectData', 'socket', 'message_id'];
        if (this.isValidMessage(message)) {
            this.commandName = message.commandName;
            this.objectType = message.objectType;
            this.objectData = message.objectData;
            this.messageId = message.Id;
            return this;
        }
        throw new Error("PARSER ERROR");
    }
    
    isValidMessage(message: JSON) {
        let isValid = true;
        this.properties.forEach(prop => {
            if (!message.hasOwnProperty(prop)) {
                isValid = false;
            }
        });
        return isValid;
    }

    toError(exception?: any): ErrorModel {
        return new ErrorModel(this, exception);
    }

    toSuccess(): SuccessModel {
        return new SuccessModel(this, "");
    }
}