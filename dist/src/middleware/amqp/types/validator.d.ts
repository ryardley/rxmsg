export declare function createValidator<T>(schemaLike: {
    check: (a: any) => void;
}): (value: any) => T;
