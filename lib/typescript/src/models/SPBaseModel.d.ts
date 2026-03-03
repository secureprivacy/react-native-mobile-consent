import type { SPSerializable } from '../support/SPSerializable';
export declare abstract class SPBaseModel implements SPSerializable {
    abstract toJson(): Record<string, unknown>;
    toJsonString(): string;
}
//# sourceMappingURL=SPBaseModel.d.ts.map