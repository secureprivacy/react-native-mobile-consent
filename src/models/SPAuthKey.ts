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

export class SPAuthKeyImpl extends SPBaseModel implements SPAuthKey {

   applicationId: string;
   secondaryApplicationId?: string;

  private constructor(key: SPAuthKey) {
    super();
    this.applicationId = key.applicationId;
    this.secondaryApplicationId = key.secondaryApplicationId;
  }

  static from(key: SPAuthKey): SPAuthKeyImpl {
    return new SPAuthKeyImpl(key);
  }

  override toJson(): Record<string, any> {
    return {
      applicationId: this.applicationId,
      secondaryApplicationId: this.secondaryApplicationId,
      integrationConfigs: [],
    };
  }
}
