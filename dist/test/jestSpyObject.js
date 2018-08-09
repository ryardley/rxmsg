"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function jestSpyObject(object) {
    const jestSpyCalls = jest.fn();
    const out = Object.entries(object).reduce((o, [key, original]) => {
        if (typeof original !== 'function') {
            return;
        }
        return Object.assign({}, o, { [key]: jest.fn((...args) => {
                jestSpyCalls(key, ...args.map(arg => (typeof arg !== 'function' ? arg : '_FUNCTION_')));
                return original(...args);
            }) });
    }, {});
    return Object.assign({}, out, { jestSpyCalls });
}
exports.jestSpyObject = jestSpyObject;
//# sourceMappingURL=jestSpyObject.js.map