"use strict";

import { SPBaseModel } from "./SPBaseModel.js";
import { SPLogger } from "../support/SPLogger.js";
import { SPErrorCodes } from "../support/SPErrorCodes.js";
import { Strings } from "../support/Strings.js";

/**
 * Generic message model for SDK responses and events
 *
 * - code: A numeric status code representing the result of an operation (e.g., 200 for success, 400 for client error, 500 for server error)
 * - msg: A human-readable message providing additional information about the result
 * - error: An optional string containing error details if the operation failed
 */

const TAG = 'SPMessage.ts';
export class SPMessageImpl extends SPBaseModel {
  constructor(msg) {
    super();
    this.code = msg.code;
    this.msg = msg.msg;
    this.error = msg.error;
  }
  static from(msg) {
    return new SPMessageImpl(msg);
  }
  static fromJson(jsonString, parsingErrorCode) {
    try {
      const json = JSON.parse(String(jsonString));
      return new SPMessageImpl({
        code: Number(json?.code ?? 500),
        msg: String(json?.msg ?? ''),
        error: json?.error ? String(json.error) : undefined
      });
    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPMessage from jsonString: ', jsonString, e);
      return new SPMessageImpl({
        code: 500,
        msg: '',
        error: Strings.fatalError(parsingErrorCode ?? SPErrorCodes.jsonParsingError)
      });
    }
  }
  toJson() {
    return {
      code: this.code,
      msg: this.msg,
      error: this.error
    };
  }
}
//# sourceMappingURL=SPMessage.js.map