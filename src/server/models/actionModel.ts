import { Message } from "./message";
import { ParsableModels } from "./parsableModels";

export interface ActionInterface {
    modelName: string;
    properties: string[];

}

export class ActionModel extends ParsableModels implements ActionInterface {
    modelName = 'ActionModel';
    static properties: string[];

    constructor() {
        super('ActionModel', []);
    }

    parse(message: Message) {
        this.isValidModel(message);
        return this;
    }
}