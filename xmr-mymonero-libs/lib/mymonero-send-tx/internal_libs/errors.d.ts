import { BigInt } from "../../../../biginteger";
export declare namespace ERR {
    namespace RING {
        const INSUFF: Error;
    }
    namespace MIXIN {
        const INVAL: Error;
    }
    namespace DEST {
        const INVAL: Error;
    }
    namespace AMT {
        const INSUFF: Error;
    }
    namespace PID {
        const NO_INTEG_ADDR: Error;
        const NO_SUB_ADDR: Error;
        const INVAL: Error;
    }
    namespace BAL {
        function insuff(amtAvail: BigInt, requiredAmt: BigInt): Error;
    }
    namespace SWEEP {
        const TOTAL_NEQ_OUTS: Error;
    }
    namespace TX {
        function failure(err?: Error): Error;
    }
    namespace PARSE_TRGT {
        const EMPTY: Error;
        const OA_RES: Error;
        function decodeAddress(targetAddress: string, err: Error): Error;
        function amount(targetAmount: string, err: Error): Error;
    }
}
//# sourceMappingURL=errors.d.ts.map
