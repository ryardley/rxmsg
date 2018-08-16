"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Centralise blockbid-logging
//       this follows a similar interface to https://github.com/Blockbid/blockbid-api-gateway/blob/develop/lib/logger/index.js
/* tslint:disable:no-console */
class Logger {
    constructor(options) {
        this.label = options.label || 'no-label';
    }
    info(...messages) {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        messages.filter(Boolean).forEach(m => console.log(`INFO: ${m}`));
    }
    error(...messages) {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        messages.filter(Boolean).forEach(m => console.log(`ERROR: ${m}`));
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map