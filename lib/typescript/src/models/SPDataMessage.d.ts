import type { SPMessage } from './SPMessage';
import { SPMessageImpl } from './SPMessage';
/**
 * Generic message model that extends SPMessage to include a data payload of type T
 *
 * - data: An optional payload of type T that can contain any additional information relevant to the message
 * This model is useful for SDK responses and events that need to return structured data along with the standard message fields (code, msg, error).
 */
export interface SPDataMessage<T> extends SPMessage {
    data?: T;
}
export declare class SPDataMessageImpl<T> extends SPMessageImpl implements SPDataMessage<T> {
    data?: T;
    private constructor();
    static from<T>(msg: SPDataMessage<T>): SPDataMessageImpl<T>;
    static fromJsonWithParser<T>(jsonString?: string, parser?: (data: any) => T, errorCode?: string): SPDataMessage<T | null>;
    toJson(): Record<string, any>;
}
//# sourceMappingURL=SPDataMessage.d.ts.map