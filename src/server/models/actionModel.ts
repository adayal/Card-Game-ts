import { Message } from "./message";
import { ParsableModels } from "./parsableModels";

interface ActionInterface {
    modelName: string;
}

export class ActionModel extends ParsableModels implements ActionInterface {
    modelName = 'ActionModel';

    constructor() {
        super('ActionModel');
    }

    parse(message: Message) {
        if (!this.isValidModel(message)) {
            throw new Error("Malformed " + this.modelName);
        }
        
        return this;
    }

    isValidModel(message: Message) {
        if (message.objectType != this.modelName) {
            return false;
        }

        return true;
    }
    
}