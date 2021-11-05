interface MessageInterface {
    commandName: string;
    objectType: string;
    objectData: any;
}

export class Message implements MessageInterface {
    
    commandName: string;
    objectType: string;
    objectData: any;
    static properties: ['commandName', 'objectType', 'objectData', 'socket'];
    
    
    constructor(message: any) {
        if (this.isValidMessage(message)) {
            this.commandName = message.commandName;
            this.objectType = message.objectType;
            this.objectData = message.objectData;
            return this;
        }
        throw new Error("PARSER ERROR");
    }
    
    isValidMessage(message: JSON) {
        Message.properties.forEach(prop => {
            if (!message.hasOwnProperty(prop)) {
                return false;
            }
        });
        return true;
    }
}