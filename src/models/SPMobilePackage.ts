import { SPBaseModel } from './SPBaseModel';
import { SPLogger } from '../support/SPLogger';

/**
 * Mobile package model representing dependencies / package installed in the app.
 * - name: The name of the package
 * - packageId: The unique identifier for the package (e.g., com.facebook.react:react-android)
 * - enabled: A boolean indicating whether the package is enabled for tracking or consent management
 */
export interface SPMobilePackage {
  name: string;
  packageId: string;
  enabled: boolean;
}

const TAG = 'SPMobilePackage.ts';

export class SPMobilePackageImpl extends SPBaseModel implements SPMobilePackage {
  name: string;
  packageId: string;
  enabled: boolean;

  private constructor(pkg: SPMobilePackage) {
    super();
    this.name = pkg.name;
    this.packageId = pkg.packageId;
    this.enabled = pkg.enabled;
  }

  static from(pkg: SPMobilePackage): SPMobilePackageImpl {
    return new SPMobilePackageImpl(pkg);
  }

  static fromJson(json?: any): SPMobilePackageImpl | null {
    try {
      if (!json) {
        throw new Error('Provided JSON is undefined');
      }
      return new SPMobilePackageImpl({
        name: String(json.name ?? json['PackageName'] ?? json['Name'] ?? ''),
        packageId: String(json.packageId ?? json['PackageId'] ?? ''),
        enabled: Boolean(json.enabled ?? json['IsEnabled'] ?? false),
      });

    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPMobilePackage from JSON: ', json, e);
      return null;
    }
  }

  toJson(): Record<string, any> {
    return {
      name: this.name,
      packageId: this.packageId,
      enabled: this.enabled,
    };
  }
}
