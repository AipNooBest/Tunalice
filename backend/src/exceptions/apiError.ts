import c from '../consts'

export class ApiError extends Error {
    message!: string;
    status!: number;
    additionalInfo!: any;

    constructor(message: string = c.INTERNAL_SERVER_ERROR, status: number = 500, additionalInfo: any = undefined) {
        super(message);
        this.message = message;
        this.status = status;
        this.additionalInfo = additionalInfo;
    }
}

export interface IResponseError {
    message: string;
    additionalInfo?: string;
}