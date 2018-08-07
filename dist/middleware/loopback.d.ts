declare type ILoopBackConfig = {
    delay?: number;
} | void;
declare const _default: (config?: ILoopBackConfig) => {
    receiver: import("src/domain").Middleware;
    sender: import("src/domain").Middleware;
};
export default _default;
