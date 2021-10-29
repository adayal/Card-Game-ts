interface MessageInterface {
    commandName: string;
    objectType: string;
    objectData: any;
    properties: string[];
}

export class Message implements MessageInterface {
    
    commandName: string;
    objectType: string;
    objectData: any;
    properties: string[];
    
    
    constructor(message: any) {
        this.properties = ['commandName', 'objectType', 'objectData', 'socket'];
        
        if (this.isValidMessage(message)) {
            this.commandName = message.commandName;
            this.objectType = message.objectType;
            this.objectData = message.objectData;
            return this;
        }
        throw new Error("PARSER ERROR");
    }
    
    isValidMessage(message: JSON) {
        this.properties.forEach(prop => {
            if (!message.hasOwnProperty(prop)) {
                return false;
            }
        });
        return true;
    }
}