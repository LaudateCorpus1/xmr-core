"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xmr_money_1 = require("../../../../xmr-money");
var Log;
(function (Log) {
    var Amount;
    (function (Amount) {
        function beforeFee(feelessTotal, isSweeping) {
            var feeless_total = isSweeping
                ? "all"
                : xmr_money_1.formatMoney(feelessTotal);
            console.log("\uD83D\uDCAC  Total to send, before fee: " + feeless_total);
        }
        Amount.beforeFee = beforeFee;
        function change(changeAmount) {
            console.log("changeAmount", changeAmount);
        }
        Amount.change = change;
        function changeAmountDivRem(amt) {
            console.log("💬  changeAmountDivRem", amt);
        }
        Amount.changeAmountDivRem = changeAmountDivRem;
        function toSelf(changeAmount, selfAddress) {
            console.log("Sending change of " +
                xmr_money_1.formatMoneyWithSymbol(changeAmount) +
                " to " +
                selfAddress);
        }
        Amount.toSelf = toSelf;
    })(Amount = Log.Amount || (Log.Amount = {}));
    var Fee;
    (function (Fee) {
        function dynPerKB(dynFeePerKB) {
            console.log("Received dynamic per kb fee", xmr_money_1.formatMoneyWithSymbol(dynFeePerKB));
        }
        Fee.dynPerKB = dynPerKB;
        function basedOnInputs(newNeededFee, usingOuts) {
            console.log("New fee: " +
                xmr_money_1.formatMoneyWithSymbol(newNeededFee) +
                " for " +
                usingOuts.length +
                " inputs");
        }
        Fee.basedOnInputs = basedOnInputs;
        function belowDustThreshold(changeDivDustRemainder) {
            console.log("💬  Miners will add change of " +
                xmr_money_1.formatMoneyFullWithSymbol(changeDivDustRemainder) +
                " to transaction fee (below dust threshold)");
        }
        Fee.belowDustThreshold = belowDustThreshold;
        function estLowerThanReal(estMinNetworkFee, feeActuallyNeededByNetwork) {
            console.log("💬  Need to reconstruct the tx with enough of a network fee. Previous fee: " +
                xmr_money_1.formatMoneyFull(estMinNetworkFee) +
                " New fee: " +
                xmr_money_1.formatMoneyFull(feeActuallyNeededByNetwork));
            console.log("Reconstructing tx....");
        }
        Fee.estLowerThanReal = estLowerThanReal;
        function txKB(txBlobBytes, numOfKB, estMinNetworkFee) {
            console.log(txBlobBytes +
                " bytes <= " +
                numOfKB +
                " KB (current fee: " +
                xmr_money_1.formatMoneyFull(estMinNetworkFee) +
                ")");
        }
        Fee.txKB = txKB;
        function successfulTx(finalNetworkFee) {
            console.log("💬  Successful tx generation, submitting tx. Going with final_networkFee of ", xmr_money_1.formatMoney(finalNetworkFee));
        }
        Fee.successfulTx = successfulTx;
    })(Fee = Log.Fee || (Log.Fee = {}));
    var Balance;
    (function (Balance) {
        function requiredBase(totalAmount, isSweeping) {
            if (isSweeping) {
                console.log("Balance required: all");
            }
            else {
                console.log("Balance required: " + xmr_money_1.formatMoneyWithSymbol(totalAmount));
            }
        }
        Balance.requiredBase = requiredBase;
        function requiredPostRct(totalAmount) {
            console.log("~ Balance required: " + xmr_money_1.formatMoneyWithSymbol(totalAmount));
        }
        Balance.requiredPostRct = requiredPostRct;
    })(Balance = Log.Balance || (Log.Balance = {}));
    var Output;
    (function (Output) {
        function uniformity(fakeAddress) {
            console.log("Sending 0 XMR to a fake address to keep tx uniform (no change exists): " +
                fakeAddress);
        }
        Output.uniformity = uniformity;
        function display(out) {
            console.log("Using output: " +
                xmr_money_1.formatMoney(out.amount) +
                " - " +
                JSON.stringify(out));
        }
        Output.display = display;
    })(Output = Log.Output || (Log.Output = {}));
    var Target;
    (function (Target) {
        function display(fundTargets) {
            console.log("fundTransferDescriptions so far", fundTargets);
        }
        Target.display = display;
        function fullDisplay(fundTargets) {
            console.log("Destinations: ");
            xmr_money_1.printDsts(fundTargets);
        }
        Target.fullDisplay = fullDisplay;
        function displayDecomposed(splitDestinations) {
            console.log("Decomposed destinations:");
            xmr_money_1.printDsts(splitDestinations);
        }
        Target.displayDecomposed = displayDecomposed;
        function viewKey(viewKey) {
            console.log("got target address's view key", viewKey);
        }
        Target.viewKey = viewKey;
    })(Target = Log.Target || (Log.Target = {}));
    var Transaction;
    (function (Transaction) {
        function signed(signedTx) {
            console.log("signed tx: ", JSON.stringify(signedTx));
        }
        Transaction.signed = signed;
        function serializedAndHash(serializedTx, txHash) {
            console.log("tx serialized: " + serializedTx);
            console.log("Tx hash: " + txHash);
        }
        Transaction.serializedAndHash = serializedAndHash;
    })(Transaction = Log.Transaction || (Log.Transaction = {}));
    var SelectOutsAndAmtForMix;
    (function (SelectOutsAndAmtForMix) {
        function target(targetAmount) {
            console.log("Selecting outputs to use. target: " +
                xmr_money_1.formatMoney(targetAmount));
        }
        SelectOutsAndAmtForMix.target = target;
        var Dusty;
        (function (Dusty) {
            function notSweeping() {
                console.log("Not sweeping, and found a dusty (though maybe mixable) output... skipping it!");
            }
            Dusty.notSweeping = notSweeping;
            function nonRct() {
                console.log("Sweeping, and found a dusty but unmixable (non-rct) output... skipping it!");
            }
            Dusty.nonRct = nonRct;
            function rct() {
                console.log("Sweeping and found a dusty but mixable (rct) amount... keeping it!");
            }
            Dusty.rct = rct;
        })(Dusty = SelectOutsAndAmtForMix.Dusty || (SelectOutsAndAmtForMix.Dusty = {}));
        function usingOut(outAmount, out) {
            console.log("Using output: " + xmr_money_1.formatMoney(outAmount) + " - " + JSON.stringify(out));
        }
        SelectOutsAndAmtForMix.usingOut = usingOut;
    })(SelectOutsAndAmtForMix = Log.SelectOutsAndAmtForMix || (Log.SelectOutsAndAmtForMix = {}));
})(Log = exports.Log || (exports.Log = {}));
//# sourceMappingURL=logger.js.map
