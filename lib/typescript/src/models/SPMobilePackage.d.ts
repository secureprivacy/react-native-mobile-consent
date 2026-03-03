import { SPBaseModel } from './SPBaseModel';
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
export declare class SPMobilePackageImpl extends SPBaseModel implements SPMobilePackage {
    name: string;
    packageId: string;
    enabled: boolean;
    private constructor();
    static from(pkg: SPMobilePackage): SPMobilePackageImpl;
    static fromJson(json?: any): SPMobilePackageImpl | null;
    toJson(): Record<string, any>;
}
//# sourceMappingURL=SPMobilePackage.d.ts.map