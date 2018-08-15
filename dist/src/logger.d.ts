declare class Logger {
    label: string;
    constructor(options: {
        label: string;
    });
    info(...messages: Array<string | void>): void;
    error(...messages: Array<string | void>): void;
}
export default Logger;
