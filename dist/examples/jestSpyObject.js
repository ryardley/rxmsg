"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function jestSpyObject(object) {
    const spyCalls = jest.fn();
    const out = Object.entries(object).reduce((o, [key, original]) => {
        if (typeof original !== 'function') {
            return;
        }
        return Object.assign({}, o, { [key]: jest.fn((...args) => {
                spyCalls(key, ...args.map(arg => (typeof arg !== 'function' ? arg : '_FUNCTION_')));
                return original(...args);
            }) });
    }, {});
    out.jestSpyCalls = spyCalls;
    return out;
}
exports.jestSpyObject = jestSpyObject;
//# sourceMappingURL=jestSpyObject.js.map