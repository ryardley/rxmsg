import { Boolean, Partial, Record, Static, String } from 'runtypes';
export declare const QueueDescriptionSchema: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/intersect").Intersect2<Record<{
    name: String;
}>, Partial<{
    arguments: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/dictionary").StringDictionary<Partial<{}>>;
    autoDelete: Boolean;
    durable: Boolean;
    exclusive: Boolean;
}>>;
export declare type QueueDescription = Static<typeof QueueDescriptionSchema>;
export declare type QueueShortDescription = QueueDescription | string;
