import { SPLogType } from '../enums/SPLogType';
import { SPBaseModel } from './SPBaseModel';

export interface SPLogConfig {
  type: SPLogType;
  enabled: boolean;
}

export class SPLogConfigImpl extends SPBaseModel implements SPLogConfig {

  enabled: boolean;
  type: SPLogType;

  private constructor(config: SPLogConfig) {
    super();
    this.type = config.type;
    this.enabled = config.enabled;
  }

  static from(config: SPLogConfig): SPLogConfigImpl {
    return new SPLogConfigImpl(config);
  }

  static fromJson(json?: any): SPLogConfigImpl | null {
    try {
      if (!json) {
        throw new Error('Provided JSON is undefined');
      }

      let type = json.type;
      let enabled = json.enabled;

      if (typeof type !== 'string' || !Object.values(SPLogType).includes(type as SPLogType)) {
        throw new Error(`Invalid "type" field in JSON: ${type}`);
      }
      if (typeof enabled !== 'boolean') {
        throw new Error(`Invalid "enabled" field in JSON: ${enabled}`);
      } else {
        return new SPLogConfigImpl({
          type: type.toLowerCase() as SPLogType,
          enabled: enabled,
        });
      }
    } catch (error) {
      return null;
    }
  }

  toJson(): Record<string, unknown> {
    return {
      type: this.type,
      enabled: this.enabled,
    };
  }

}
