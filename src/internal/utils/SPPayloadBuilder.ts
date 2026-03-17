/**
 * Utility responsible for building payloads
 * sent to the native layer.
 */
export class SPPayloadBuilder {

  static withApplicationId(appId: string) {
    return JSON.stringify({ applicationId: appId });
  }

  static withPackage(appId: string, packageId: string) {
    return JSON.stringify({ applicationId: appId, packageId: packageId });
  }

  static withEvent(appId: string, eventCode: number) {
    return JSON.stringify({ applicationId: appId, eventCode: eventCode });
  }

  static withLogConfigs(configs: Record<string, unknown>[]) {
    return JSON.stringify({ configs: configs });
  }

}
