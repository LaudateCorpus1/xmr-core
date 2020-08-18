import { BigInt } from "xmr-core/biginteger";
export interface XMRConfig {
    readonly coinUnitPlaces: 12;
    readonly coinUnits: BigInt;
    readonly txMinConfirms: 10;
    readonly coinSymbol: "XMR";
    readonly openAliasPrefix: "xmr";
    readonly coinName: "Monero";
    readonly coinUriPrefix: "monero:";
    readonly addressPrefix: 18;
    readonly integratedAddressPrefix: 19;
    readonly subaddressPrefix: 42;
    readonly dustThreshold: BigInt;
    readonly maxBlockNumber: 500000000;
    readonly avgBlockTime: 60;
}
export declare const config: XMRConfig;
//# sourceMappingURL=coin-config.d.ts.map
