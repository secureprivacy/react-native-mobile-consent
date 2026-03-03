"use strict";

import { SPMessageImpl } from "./SPMessage.js";
import { SPLogger } from "../support/SPLogger.js";
import { SPErrorCodes } from "../support/SPErrorCodes.js";
import { Strings } from "../support/Strings.js";

/**
 * Generic message model that extends SPMessage to include a data payload of type T
 *
 * - data: An optional payload of type T that can contain any additional information relevant to the message
 * This model is useful for SDK responses and events that need to return structured data along with the standard message fields (code, msg, error).
 */

const TAG = 'SPDataMessage.ts';
export class SPDataMessageImpl extends SPMessageImpl {
  constructor(msg) {
    super(msg);
    this.data = msg.data;
  }
  static from(msg) {
    return new SPDataMessageImpl(msg);
  }
  static fromJsonWithParser(jsonString, parser, errorCode) {
    errorCode = errorCode ?? SPErrorCodes.jsonParsingError;
    try {
      const json = JSON.parse(String(jsonString));
      const message = SPMessageImpl.fromJson(jsonString, errorCode);
      return new SPDataMessageImpl({
        code: message.code,
        msg: message.msg,
        error: message.error,
        data: json?.data != null && parser != null ? parser(json.data) : undefined
      });
    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPDataMessage from jsonString: ', jsonString, e);
      return {
        code: 500,
        msg: Strings.fatalError(errorCode),
        error: errorCode
      };
    }
  }
  toJson() {
    return {
      ...super.toJson(),
      data: this.data
    };
  }
}
//# sourceMappingURL=SPDataMessage.js.map