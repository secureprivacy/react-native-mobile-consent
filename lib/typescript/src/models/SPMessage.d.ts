import { SPBaseModel } from './SPBaseModel';
/**
 * Generic message model for SDK responses and events
 *
 * - code: A numeric status code representing the result of an operation (e.g., 200 for success, 400 for client error, 500 for server error)
 * - msg: A human-readable message providing additional information about the result
 * - error: An optional string containing error details if the operation failed
 */
export interface SPMessage {
    code: number;
    msg: string;
    error?: string;
}
export declare class SPMessageImpl extends SPBaseModel implements SPMessage {
    code: number;
    msg: string;
    error?: string;
    constructor(msg: SPMessage);
    static from(msg: SPMessage): SPMessageImpl;
    static fromJson(jsonString?: string, parsingErrorCode?: string): SPMessageImpl;
    toJson(): Record<string, any>;
}
//# sourceMappingURL=SPMessage.d.ts.map