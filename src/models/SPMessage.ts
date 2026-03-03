import { SPBaseModel } from './SPBaseModel';
import { SPLogger } from '../support/SPLogger';
import { SPErrorCodes } from '../support/SPErrorCodes';
import { Strings } from '../support/Strings';

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

const TAG = 'SPMessage.ts';

export class SPMessageImpl extends SPBaseModel implements SPMessage {
  code: number;
  msg: string;
  error?: string;

  constructor(msg: SPMessage) {
    super();
    this.code = msg.code;
    this.msg = msg.msg;
    this.error = msg.error;
  }

  static from(msg: SPMessage): SPMessageImpl {
    return new SPMessageImpl(msg);
  }

  static fromJson(jsonString?: string, parsingErrorCode?: string): SPMessageImpl {
    try {
      const json = JSON.parse(String(jsonString));
      return new SPMessageImpl(
        {
          code: Number(json?.code ?? 500),
          msg: String(json?.msg ?? ''),
          error: json?.error ? String(json.error) : undefined,
        },
      );
    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPMessage from jsonString: ', jsonString, e);
      return new SPMessageImpl(
        {
          code: 500,
          msg: '',
          error: Strings.fatalError(parsingErrorCode ?? SPErrorCodes.jsonParsingError),
        },
      );
    }
  }

  toJson(): Record<string, any> {
    return {
      code: this.code,
      msg: this.msg,
      error: this.error,
    };
  }

}
