"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFundStatus = {
    fetchingLatestBalance: 1,
    calculatingFee: 2,
    fetchingDecoyOutputs: 3,
    constructingTransaction: 4,
    submittingTransaction: 5,
};
exports.sendFundsStatusToMessage = {
    1: "Fetching latest balance.",
    2: "Calculating fee.",
    3: "Fetching decoy outputs.",
    4: "Constructing transaction.",
    5: "Submitting transaction.",
};
//# sourceMappingURL=status_update_constants.js.map