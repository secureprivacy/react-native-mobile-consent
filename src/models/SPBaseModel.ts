import type { SPSerializable } from '../support/SPSerializable';

export abstract class SPBaseModel implements SPSerializable{
  abstract toJson(): Record<string, unknown>;

  toJsonString(): string {
    try {
      return JSON.stringify(this.toJson());
    } catch (e) {
      return JSON.stringify({
        code: 500,
        msg: 'Serialization failed',
        error: String(e),
      });
    }
  }
}
