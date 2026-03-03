import type { SPMessage } from './SPMessage';
import { SPMessageImpl } from './SPMessage';
import { SPLogger } from '../support/SPLogger';
import { SPErrorCodes } from '../support/SPErrorCodes';
import { Strings } from '../support/Strings';

/**
 * Generic message model that extends SPMessage to include a data payload of type T
 *
 * - data: An optional payload of type T that can contain any additional information relevant to the message
 * This model is useful for SDK responses and events that need to return structured data along with the standard message fields (code, msg, error).
 */
export interface SPDataMessage<T> extends SPMessage {
  data?: T;
}

const TAG = 'SPDataMessage.ts';

export class SPDataMessageImpl<T> extends SPMessageImpl implements SPDataMessage<T> {
  data?: T;

  private constructor(msg: SPDataMessage<T>) {
    super(msg);
    this.data = msg.data;
  }

  static from<T>(msg: SPDataMessage<T>): SPDataMessageImpl<T> {
    return new SPDataMessageImpl(msg);
  }

  static fromJsonWithParser<T>(
    jsonString?: string,
    parser?: (data: any) => T,
    errorCode?: string,
  ): SPDataMessage<T | null> {
    errorCode = errorCode ?? SPErrorCodes.jsonParsingError;
    try {
      const json = JSON.parse(String(jsonString));
      const message = SPMessageImpl.fromJson(jsonString, errorCode);
      return new SPDataMessageImpl<T>(
        {
          code: message.code,
          msg: message.msg,
          error: message.error,
          data: json?.data != null && parser != null ? parser(json.data) : undefined,
        },
      );
    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPDataMessage from jsonString: ', jsonString, e);
      return {
        code: 500,
        msg: Strings.fatalError(errorCode),
        error: errorCode,
      };
    }
  }

  override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      data: this.data,
    };
  }
}
