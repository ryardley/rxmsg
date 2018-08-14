/// <reference types="jest" />
export interface IJ {
    jestSpyCalls: jest.Mock;
}
export declare function jestSpyObject<T>(object: T): T & IJ;
