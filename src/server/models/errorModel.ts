import { Message } from "./message";
import { ParsableModels } from "./parsableModels";

export interface ErrorInterface {
    modelName: string;
    toJson: any;
}

export class ErrorModel implements ErrorInterface {
    modelName = 'ErrorModel';
    rawMessage: Message | null;
    errorMessage: string | null;
    errorCode:number;
    rawException:any;


    constructor(rawMessage?: Message, rawException?: any) {
        this.rawMessage = rawMessage ?? null;
        this.rawException = rawException ?? null;

    }


    toJson(): any {
        return {
            messageId: this.rawMessage?.messageId,
            errorMessage: this.errorMessage,
            errorCode: this.errorCode
        };
    }
}