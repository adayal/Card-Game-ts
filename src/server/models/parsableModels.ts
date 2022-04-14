import { Message } from "./message";

export abstract class ParsableModels {
    model: any;
    properties: string[];

    abstract parse(message: Message): any;

    constructor(objectType: string, properties: string[]) {
        this.model = objectType;
        this.properties = properties;
    }

    getType() {
        return this.model;
    }

    isValidModel(message: Message, atLeastOneProperty: boolean = false) {
        if (message.objectType != this.model) {
            throw new Error("Malformed " + this.model);
        }
    
        if (atLeastOneProperty) {
            let foundProperty = false;
            this.properties.forEach(prop => {
                if (message.objectData.hasOwnProperty(prop)) {
                  foundProperty = true;
                }
              });
            if (!foundProperty) throw new Error ("Malformed " + this.model);
        } else {
            this.properties.forEach(prop => {
                if (!message.objectData.hasOwnProperty(prop)) {
                  throw new Error("Malformed " + this.model);
                }
              });
        }
        
        return true;
    }
}