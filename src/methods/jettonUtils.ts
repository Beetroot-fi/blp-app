import { beginCell, Address, Cell } from "@ton/core";

const opCodes = {
    transfer: 0xf8a7ea5,
    burn: 0x595f07bc,
}

export function buildJettonTransferBody(
    queryId: bigint,
    jettonAmount: bigint,
    destination: Address,
    responseDestination: Address,
    fwdTonAmount: bigint,
    fwdPayload: Cell | null,
) {
    return beginCell()
        .storeUint(opCodes.transfer, 32)
        .storeUint(queryId, 64)
        .storeCoins(jettonAmount)
        .storeAddress(destination)
        .storeAddress(responseDestination)
        .storeBit(0)
        .storeCoins(fwdTonAmount)
        .storeMaybeRef(fwdPayload)
        .endCell();
}

export function buildJettonBurnBody(
    queryId: bigint,
    jettonAmount: bigint,
    responseAddress: Address,
) {
    return beginCell()
        .storeUint(opCodes.burn, 32)
        .storeUint(queryId, 64)
        .storeCoins(jettonAmount)
        .storeAddress(responseAddress)
        .storeUint(0, 1)
        .endCell();
}
