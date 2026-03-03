/**
 * Common contract for all models that can be serialized to JSON.
 */
export interface SPSerializable {
    /**
     * Converts the object into a plain JSON object.
     */
    toJson(): Record<string, unknown>;
    /**
     * Converts the object into a JSON string.
     */
    toJsonString(): string;
}
//# sourceMappingURL=SPSerializable.d.ts.map