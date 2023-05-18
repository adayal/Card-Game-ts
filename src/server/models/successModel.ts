import { Message } from "./message";

export interface SuccessInterface {
    modelName: string;
    toJson: any;
}

export class SuccessModel implements SuccessInterface {
    modelName = 'SuccessModel';
    rawMessage: Message;
    successMessage: string;


    constructor(rawMessage: Message, successMessage: string) {
        this.rawMessage = rawMessage;
        this.successMessage = successMessage;
    }

    toJson(): any {
        return {
            messageId: this.rawMessage.messageId,
            successMessage: this.successMessage,
        };
    }
}