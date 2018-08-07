import { Observable } from 'rxjs';
import { IMessage } from '../types';
declare type ILoopBackConfig = {
    delay?: number;
} | void;
declare const _default: (config?: ILoopBackConfig) => {
    receiver: () => Observable<IMessage>;
    sender: (sendStream: Observable<IMessage>) => Observable<IMessage>;
};
export default _default;
