"use strict";

import { SPBaseModel } from "./SPBaseModel.js";
import { SPLogger } from "../support/SPLogger.js";

/**
 * Mobile package model representing dependencies / package installed in the app.
 * - name: The name of the package
 * - packageId: The unique identifier for the package (e.g., com.facebook.react:react-android)
 * - enabled: A boolean indicating whether the package is enabled for tracking or consent management
 */

const TAG = 'SPMobilePackage.ts';
export class SPMobilePackageImpl extends SPBaseModel {
  constructor(pkg) {
    super();
    this.name = pkg.name;
    this.packageId = pkg.packageId;
    this.enabled = pkg.enabled;
  }
  static from(pkg) {
    return new SPMobilePackageImpl(pkg);
  }
  static fromJson(json) {
    try {
      return new SPMobilePackageImpl({
        name: String(json?.name ?? ''),
        packageId: String(json?.packageId ?? ''),
        enabled: Boolean(json?.enabled ?? false)
      });
    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPMobilePackage from JSON: ', json, e);
      return null;
    }
  }
  toJson() {
    return {
      name: this.name,
      packageId: this.packageId,
      enabled: this.enabled
    };
  }
}
//# sourceMappingURL=SPMobilePackage.js.map