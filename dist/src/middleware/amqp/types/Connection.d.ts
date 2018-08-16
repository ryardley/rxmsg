import { Partial, Record, Static, String } from 'runtypes';
export declare const ConnectionDescriptionSchema: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/intersect").Intersect2<Record<{
    uri: String;
}>, Partial<{
    socketOptions: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/dictionary").StringDictionary<Partial<{}>>;
}>>;
export declare type ConnectionDescription = Static<typeof ConnectionDescriptionSchema>;
