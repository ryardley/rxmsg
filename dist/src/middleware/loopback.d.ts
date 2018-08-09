import { Observable } from 'rxjs';
interface ILoopBackConfig {
    delay?: number;
}
declare const _default: (config?: ILoopBackConfig) => {
    receiver: () => Observable<any>;
    sender: (sendStream: Observable<any>) => Observable<any>;
};
export default _default;
