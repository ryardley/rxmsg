import { Boolean, Literal, Partial, Record, Static, String } from 'runtypes';
export declare const ExchangeDescriptionSchema: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/intersect").Intersect2<Record<{
    name: String;
    type: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/union").Union3<Literal<"fanout">, Literal<"topic">, Literal<"direct">>;
}>, Partial<{
    alternateExchange: String;
    arguments: import("../../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/runtypes/lib/types/dictionary").StringDictionary<Partial<{}>>;
    autoDelete: Boolean;
    durable: Boolean;
    internal: Boolean;
}>>;
export declare type ExchangeDescription = Static<typeof ExchangeDescriptionSchema>;
