"use strict";

/**
 * SDK authentication key model
 */
import { SPBaseModel } from "./SPBaseModel.js";

/**
 * Authentication key model for SDK initialization
 * - applicationId: The primary application ID for the SDK
 * - secondaryApplicationId: An optional secondary application ID
 */

export class SPAuthKeyImpl extends SPBaseModel {
  constructor(key) {
    super();
    this.applicationId = key.applicationId;
    this.secondaryApplicationId = key.secondaryApplicationId;
  }
  static from(key) {
    return new SPAuthKeyImpl(key);
  }
  toJson() {
    return {
      applicationId: this.applicationId,
      secondaryApplicationId: this.secondaryApplicationId,
      integrationConfigs: []
    };
  }
}
//# sourceMappingURL=SPAuthKey.js.map