import { Message } from "./message";

export abstract class ParsableModels {
    model: any;
    abstract parse(message: Message): any;
    abstract isValidModel(message: Message): any;

    constructor(objectType: string) {
        this.model = objectType;
    }

    getType() {
        return this.model;
    }
}