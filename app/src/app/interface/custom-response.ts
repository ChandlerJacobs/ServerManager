import { Server } from "./server";

export interface customeResponse{
    timeStamp: Date,
    statusCode: number,
    status: string,
    reason: string
    message: string,
    devMessage: string,
    data: {servers?: Server[], server?: Server}
}