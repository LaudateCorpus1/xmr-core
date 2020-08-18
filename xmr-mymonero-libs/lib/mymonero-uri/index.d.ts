import { NetType } from "xmr-core/xmr-crypto-utils";
import { Omit } from "../types";
export declare enum URITypes {
    addressAsFirstPathComponent = 1,
    addressAsAuthority = 2
}
declare type FundRequestPayload = {
    address: string;
    payment_id?: string | null;
    amount?: string | null;
    amountCcySymbol?: string | null;
    description?: string | null;
    message?: string | null;
    uriType: URITypes;
};
export declare function encodeFundRequest(args: FundRequestPayload): string;
declare type DecodeFundRequestPayload = Omit<FundRequestPayload, "uriType">;
export declare function decodeFundRequest(str: string, nettype: NetType): DecodeFundRequestPayload;
export {};
//# sourceMappingURL=index.d.ts.map
