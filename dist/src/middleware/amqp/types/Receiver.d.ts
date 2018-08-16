import { Array, Boolean, Number, Partial, Static, String } from 'runtypes';
export declare const ReceiverDescriptionSchema: Partial<{
    arguments: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/dictionary").StringDictionary<Partial<{}>>;
    bindings: Array<import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/intersect").Intersect2<import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/record").Record<{
        source: String;
    }>, Partial<{
        arguments: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/dictionary").StringDictionary<Partial<{}>>;
        destination: String;
        pattern: String;
        type: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/union").Union2<import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/literal").Literal<"exchange">, import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/literal").Literal<"queue">>;
    }>>>;
    consumerTag: String;
    exclusive: Boolean;
    noAck: Boolean;
    prefetch: Number;
    priority: Number;
    queue: String;
}>;
export declare type ReceiverDescription = Static<typeof ReceiverDescriptionSchema>;
