import { Status } from "./status_update_constants";
import { BigInt } from "xmr-core/biginteger";
import { Pid, ViewSendKeys } from "xmr-core/xmr-transaction";
import { MyMoneroApi } from "../";
import { selectOutputsAndAmountForMixin } from "./internal_libs/output_selection";
import { NetType, HWDevice } from "xmr-core/xmr-crypto-utils";
export declare function estimatedTransactionNetworkFee(nonZeroMixin: number, feePerKB: BigInt, simplePriority: number): import("xmr-core/biginteger/vendor/biginteger").BigInteger;
export declare type SendFundsRet = {
    targetAddress: string;
    sentAmount: number;
    pid: Pid;
    txHash: string;
    txFee: BigInt;
};
export declare function sendFundsSimple(targetAddress: string, amount: number, pid: Pid, updateStatus: (status: Status) => void, hwdev: HWDevice): Promise<SendFundsRet>;
export declare function sendFundsRawKeys(targetAddress: string, amount: number, senderAddress: string, senderPrivateKeys: ViewSendKeys, senderPublicKeys: ViewSendKeys, updateStatus: (status: Status) => void): Promise<SendFundsRet>;
export declare function sendFunds(targetAddress: string, // currency-ready wallet address, but not an OpenAlias address (resolve before calling)
nettype: NetType, amountOrZeroWhenSweep: number, // n value will be ignored for sweep
isSweeping: boolean, // send true to sweep - amountorZeroWhenSweep will be ignored
senderAddress: string, senderPrivateKeys: ViewSendKeys, senderPublicKeys: ViewSendKeys, pidToParse: Pid, mixin: number, simplePriority: number, hwdev: HWDevice, updateStatus: (status: Status) => void, outputAndAmountSelector?: typeof selectOutputsAndAmountForMixin, api?: typeof MyMoneroApi): Promise<SendFundsRet>;
//# sourceMappingURL=sending_funds.d.ts.map
