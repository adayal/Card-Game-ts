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

    isValidModel(message: Message) {
        let isValid = true;
        if (message.objectType != this.model) {
            throw new Error("Malformed " + this.model);
        }
    
        this.properties.forEach(prop => {
          if (!message.objectData.hasOwnProperty(prop)) {
            isValid = false;
          }
        });

        if (!isValid)
            throw new Error("Malformed " + this.model);
    
        return isValid;
      }
}