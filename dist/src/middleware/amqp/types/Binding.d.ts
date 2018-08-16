import { Literal, Partial, Record, Static, String } from 'runtypes';
export declare const BindingDescriptionSchema: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/intersect").Intersect2<Record<{
    source: String;
}>, Partial<{
    arguments: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/dictionary").StringDictionary<Partial<{}>>;
    destination: String;
    pattern: String;
    type: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/union").Union2<Literal<"exchange">, Literal<"queue">>;
}>>;
export declare type BindingDescription = Static<typeof BindingDescriptionSchema>;
