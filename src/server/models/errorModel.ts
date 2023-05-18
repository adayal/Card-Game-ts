import { Message } from "./message";
import { ParsableModels } from "./parsableModels";

export interface ErrorInterface {
    modelName: string;
    toJson: any;
}

export class ErrorModel implements ErrorInterface {
    modelName = 'ErrorModel';
    rawMessage: Message;
    errorMessage: string;
    errorCode:number;
    rawException:any;


    constructor(rawMessage: Message, rawException: any) {
        this.rawMessage = rawMessage;
        this.rawException = rawException;
    }

    toJson(): any {
        return {
            messageId: this.rawMessage.messageId,
            errorMessage: this.errorMessage,
            errorCode: this.errorCode
        };
    }
}