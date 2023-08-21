import { Message } from "./message";
import { ParsableModels } from "./parsableModels";

export interface ActionInterface {
    modelName: string;
    properties: string[];

}

export class ActionModel extends ParsableModels implements ActionInterface {
    modelName = 'ActionModel';
    static properties: string[];

    constructor(rawMessage: Message) {
        super('ActionModel', [], rawMessage);
    }

    parse() {
        this.isValidModel(this.rawMessage);
        return this;
    }
}