"use strict";

export class SPBaseModel {
  toJsonString() {
    try {
      return JSON.stringify(this.toJson());
    } catch (e) {
      return JSON.stringify({
        code: 500,
        msg: 'Serialization failed',
        error: String(e)
      });
    }
  }
}
//# sourceMappingURL=SPBaseModel.js.map