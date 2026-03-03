/**
 * SDK authentication key model
 */
import { SPBaseModel } from './SPBaseModel';
/**
 * Authentication key model for SDK initialization
 * - applicationId: The primary application ID for the SDK
 * - secondaryApplicationId: An optional secondary application ID
 */
export interface SPAuthKey {
    applicationId: string;
    secondaryApplicationId?: string;
}
export declare class SPAuthKeyImpl extends SPBaseModel implements SPAuthKey {
    applicationId: string;
    secondaryApplicationId?: string;
    private constructor();
    static from(key: SPAuthKey): SPAuthKeyImpl;
    toJson(): Record<string, any>;
}
//# sourceMappingURL=SPAuthKey.d.ts.map