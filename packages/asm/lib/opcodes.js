"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Yellow Paper
//   See: https://ethereum.github.io/yellowpaper/paper.pdf
// SHL / SHR / SAR:
//   See: https://eips.ethereum.org/EIPS/eip-145
// CREATE2:
//   See: https://eips.ethereum.org/EIPS/eip-1014
// EXTCODEHASH
//   See: https://eips.ethereum.org/EIPS/eip-1052
var ethers_1 = require("ethers");
var Opcode = /** @class */ (function () {
    function Opcode(mnemonic, value, delta, alpha, doc) {
        ethers_1.ethers.utils.defineReadOnly(this, "mnemonic", mnemonic);
        ethers_1.ethers.utils.defineReadOnly(this, "value", value);
        ethers_1.ethers.utils.defineReadOnly(this, "delta", delta);
        ethers_1.ethers.utils.defineReadOnly(this, "alpha", alpha);
        ethers_1.ethers.utils.defineReadOnly(this, "doc", doc || null);
    }
    // Returns if this opcode is a jump
    Opcode.prototype.isJump = function () {
        return (this.mnemonic === "JUMP" || this.mnemonic === "JUMPI");
    };
    Opcode.prototype.isValidJumpDest = function () {
        return (this.mnemonic === "JUMPDEST");
    };
    // Returns the number of of bytes this performs if a PUSH; 0 otherwise
    Opcode.prototype.isPush = function () {
        if (this.mnemonic.substring(0, 4) === "PUSH") {
            return this.value - 0x60 + 1;
        }
        return 0;
    };
    // Returns true if this operation writes to memory contents (or if readOrWrite, reads memory)
    Opcode.prototype.isMemory = function (readOrWrite) {
        throw new Error("@TODO: return true if modifies memory");
    };
    // Returns true if this opcode does not affect state
    Opcode.prototype.isStatic = function () {
        throw new Error("@TODO: return true if certain non-state-changing");
    };
    Opcode.from = function (valueOrMnemonic) {
        if (typeof (valueOrMnemonic) === "string") {
            return OpcodeMap[valueOrMnemonic.toLowerCase()] || null;
        }
        return (Opcodes[valueOrMnemonic] || null);
    };
    return Opcode;
}());
exports.Opcode = Opcode;
var _Opcodes = {
    // Stop and Arithmetic Operations
    stop: { value: 0x00, delta: 0, alpha: 0, doc: "stop" },
    add: { value: 0x01, delta: 2, alpha: 1, doc: "v = add(a, b)" },
    mul: { value: 0x02, delta: 2, alpha: 1, doc: "v = mul(a, b)" },
    sub: { value: 0x03, delta: 2, alpha: 1, doc: "v = sub(a, b)" },
    div: { value: 0x04, delta: 2, alpha: 1, doc: "v = div(top, bottom)" },
    sdiv: { value: 0x05, delta: 2, alpha: 1, doc: "v = sdiv(top, bottom)" },
    mod: { value: 0x06, delta: 2, alpha: 1, doc: "v = mod(a, modulo)" },
    smod: { value: 0x07, delta: 2, alpha: 1, doc: "v = smod(a, modulo)" },
    addmod: { value: 0x08, delta: 3, alpha: 1, doc: "v = addmod(a, b, modulo)" },
    mulmod: { value: 0x09, delta: 3, alpha: 1, doc: "v = mul(a, b, modulo)" },
    exp: { value: 0x0a, delta: 2, alpha: 1, doc: "v = exp(base, exponent)" },
    signextend: { value: 0x0b, delta: 2, alpha: 1, doc: "v = signextend(value, byteWidth)" },
    // Comparison & Bitwise Logic Operations
    lt: { value: 0x10, delta: 2, alpha: 1, doc: "v = lt(a, b)" },
    gt: { value: 0x11, delta: 2, alpha: 1, doc: "v = gt(a, b)" },
    slt: { value: 0x12, delta: 2, alpha: 1, doc: "v = slt(a, b)" },
    sgt: { value: 0x13, delta: 2, alpha: 1, doc: "v = sgt(a, b)" },
    eq: { value: 0x14, delta: 2, alpha: 1, doc: "v = eq(a, b)" },
    iszero: { value: 0x15, delta: 1, alpha: 1, doc: "v = iszero(a)" },
    and: { value: 0x16, delta: 2, alpha: 1, doc: "v = and(a, b)" },
    or: { value: 0x17, delta: 2, alpha: 1, doc: "v = or(a, b)" },
    xor: { value: 0x18, delta: 2, alpha: 1, doc: "v = xor(a, b)" },
    not: { value: 0x19, delta: 1, alpha: 1, doc: "v = not(a, b)" },
    byte: { value: 0x1a, delta: 2, alpha: 1, doc: "v = byte(msbByteIndex, value)" },
    shl: { value: 0x1b, delta: 2, alpha: 1, doc: "v = shl(shiftBits, value)" },
    shr: { value: 0x1c, delta: 2, alpha: 1, doc: "v = shr(shiftBits, value)" },
    sar: { value: 0x1d, delta: 2, alpha: 1, doc: "v = sar(shiftBits, value)" },
    // SHA3
    sha3: { value: 0x20, delta: 2, alpha: 1, doc: "v = sha3(offset, length)" },
    // Environmental Information
    address: { value: 0x30, delta: 0, alpha: 1, doc: "myAddr = address" },
    balance: { value: 0x31, delta: 1, alpha: 1, doc: "wei = balance(address)" },
    origin: { value: 0x32, delta: 0, alpha: 1, doc: "txOrigin = origin" },
    caller: { value: 0x33, delta: 0, alpha: 1, doc: "msgSender = caller" },
    callvalue: { value: 0x34, delta: 0, alpha: 1, doc: "msgValue = callvalue" },
    calldataload: { value: 0x35, delta: 1, alpha: 1, doc: "calldataWordValue = calldataload(byteOffet)" },
    calldatasize: { value: 0x36, delta: 0, alpha: 1, doc: "calldataLength = calldatasize" },
    calldatacopy: { value: 0x37, delta: 3, alpha: 0, doc: "calldatacopy(dstMemoryIndex, dataIndex, length)" },
    codesize: { value: 0x38, delta: 0, alpha: 1, doc: "myCodeLength = codesize" },
    codecopy: { value: 0x39, delta: 3, alpha: 0, doc: "codecopy(dstMemoryIndex, codeIndex, length)" },
    gasprice: { value: 0x3a, delta: 0, alpha: 1, doc: "txGasPrice = gasprice" },
    extcodesize: { value: 0x3b, delta: 1, alpha: 1, doc: "otherCodeLength = extcodesize(address)" },
    extcodecopy: { value: 0x3c, delta: 4, alpha: 0, doc: "extcodecopy(address, dstMemoryIndex, extcodeIndex, length)" },
    returndatasize: { value: 0x3d, delta: 0, alpha: 1, doc: "v = returndatasize" },
    returndatacopy: { value: 0x3e, delta: 3, alpha: 0, doc: "returndatacopy(dstMemoryOffset, returndataIndex, length)" },
    extcodehash: { value: 0x3f, delta: 1, alpha: 1, doc: "hash = extcodehash(address)" },
    // Block Information
    blockhash: { value: 0x40, delta: 1, alpha: 1, doc: "hash = blockhash(blockNumber)" },
    coinbase: { value: 0x41, delta: 0, alpha: 1, doc: "miner = coinbase" },
    timestamp: { value: 0x42, delta: 0, alpha: 1, doc: "now = timestamp" },
    number: { value: 0x43, delta: 0, alpha: 1, doc: "blockNumber = number" },
    difficulty: { value: 0x44, delta: 0, alpha: 1, doc: "diff = difficulty" },
    gaslimit: { value: 0x45, delta: 0, alpha: 1, doc: "gas = gaslimit" },
    // Stack, Memory, Storage and Flow Operations
    pop: { value: 0x50, delta: 1, alpha: 0, doc: "stackTopValue = pop" },
    mload: { value: 0x51, delta: 1, alpha: 1, doc: "memoryWordValue = mload(memoryByteIndex)" },
    mstore: { value: 0x52, delta: 2, alpha: 0, doc: "mstore(memoryByteIndex, valueOut)" },
    mstore8: { value: 0x53, delta: 2, alpha: 0, doc: "mstore8(memoryByteIndex, valueOut [ & 0xff ])" },
    sload: { value: 0x54, delta: 1, alpha: 1, doc: "storageWordValue = sload(storageWordIndex)" },
    sstore: { value: 0x55, delta: 2, alpha: 0, doc: "sstore(storageWordIndex, valueOut)" },
    jump: { value: 0x56, delta: 1, alpha: 0, doc: "jump(target)" },
    jumpi: { value: 0x57, delta: 2, alpha: 0, doc: "jumpi(target, notZero)" },
    pc: { value: 0x58, delta: 0, alpha: 1, doc: "programCounter = pc" },
    msize: { value: 0x59, delta: 0, alpha: 1, doc: "currentMemorySize = msize" },
    gas: { value: 0x5a, delta: 0, alpha: 1, doc: "remainingGas = gas" },
    jumpdest: { value: 0x5b, delta: 0, alpha: 0, doc: "jumpdest" },
    // Push Operations
    push1: { value: 0x60, delta: 0, alpha: 1 },
    push2: { value: 0x61, delta: 0, alpha: 1 },
    push3: { value: 0x62, delta: 0, alpha: 1 },
    push4: { value: 0x63, delta: 0, alpha: 1 },
    push5: { value: 0x64, delta: 0, alpha: 1 },
    push6: { value: 0x65, delta: 0, alpha: 1 },
    push7: { value: 0x66, delta: 0, alpha: 1 },
    push8: { value: 0x67, delta: 0, alpha: 1 },
    push9: { value: 0x68, delta: 0, alpha: 1 },
    push10: { value: 0x69, delta: 0, alpha: 1 },
    push11: { value: 0x6a, delta: 0, alpha: 1 },
    push12: { value: 0x6b, delta: 0, alpha: 1 },
    push13: { value: 0x6c, delta: 0, alpha: 1 },
    push14: { value: 0x6d, delta: 0, alpha: 1 },
    push15: { value: 0x6e, delta: 0, alpha: 1 },
    push16: { value: 0x6f, delta: 0, alpha: 1 },
    push17: { value: 0x70, delta: 0, alpha: 1 },
    push18: { value: 0x71, delta: 0, alpha: 1 },
    push19: { value: 0x72, delta: 0, alpha: 1 },
    push20: { value: 0x73, delta: 0, alpha: 1 },
    push21: { value: 0x74, delta: 0, alpha: 1 },
    push22: { value: 0x75, delta: 0, alpha: 1 },
    push23: { value: 0x76, delta: 0, alpha: 1 },
    push24: { value: 0x77, delta: 0, alpha: 1 },
    push25: { value: 0x78, delta: 0, alpha: 1 },
    push26: { value: 0x79, delta: 0, alpha: 1 },
    push27: { value: 0x7a, delta: 0, alpha: 1 },
    push28: { value: 0x7b, delta: 0, alpha: 1 },
    push29: { value: 0x7c, delta: 0, alpha: 1 },
    push30: { value: 0x7d, delta: 0, alpha: 1 },
    push31: { value: 0x7e, delta: 0, alpha: 1 },
    push32: { value: 0x7f, delta: 0, alpha: 1 },
    // Duplicate Operations
    dup1: { value: 0x80, delta: 0, alpha: 1 },
    dup2: { value: 0x81, delta: 0, alpha: 1 },
    dup3: { value: 0x82, delta: 0, alpha: 1 },
    dup4: { value: 0x83, delta: 0, alpha: 1 },
    dup5: { value: 0x84, delta: 0, alpha: 1 },
    dup6: { value: 0x85, delta: 0, alpha: 1 },
    dup7: { value: 0x86, delta: 0, alpha: 1 },
    dup8: { value: 0x87, delta: 0, alpha: 1 },
    dup9: { value: 0x88, delta: 0, alpha: 1 },
    dup10: { value: 0x89, delta: 0, alpha: 1 },
    dup11: { value: 0x8a, delta: 0, alpha: 1 },
    dup12: { value: 0x8b, delta: 0, alpha: 1 },
    dup13: { value: 0x8c, delta: 0, alpha: 1 },
    dup14: { value: 0x8d, delta: 0, alpha: 1 },
    dup15: { value: 0x8e, delta: 0, alpha: 1 },
    dup16: { value: 0x8f, delta: 0, alpha: 1 },
    // Exchange Operations
    swap1: { value: 0x90, delta: 0, alpha: 0 },
    swap2: { value: 0x91, delta: 0, alpha: 0 },
    swap3: { value: 0x92, delta: 0, alpha: 0 },
    swap4: { value: 0x93, delta: 0, alpha: 0 },
    swap5: { value: 0x94, delta: 0, alpha: 0 },
    swap6: { value: 0x95, delta: 0, alpha: 0 },
    swap7: { value: 0x96, delta: 0, alpha: 0 },
    swap8: { value: 0x97, delta: 0, alpha: 0 },
    swap9: { value: 0x98, delta: 0, alpha: 0 },
    swap10: { value: 0x99, delta: 0, alpha: 0 },
    swap11: { value: 0x9a, delta: 0, alpha: 0 },
    swap12: { value: 0x9b, delta: 0, alpha: 0 },
    swap13: { value: 0x9c, delta: 0, alpha: 0 },
    swap14: { value: 0x9d, delta: 0, alpha: 0 },
    swap15: { value: 0x9e, delta: 0, alpha: 0 },
    swap16: { value: 0x9f, delta: 0, alpha: 0 },
    // Loggin Operations
    log0: { value: 0xa0, delta: 2, alpha: 0 },
    log1: { value: 0xa1, delta: 3, alpha: 0 },
    log2: { value: 0xa2, delta: 4, alpha: 0 },
    log3: { value: 0xa3, delta: 5, alpha: 0 },
    log4: { value: 0xa4, delta: 6, alpha: 0 },
    // System Operations
    create: { value: 0xf0, delta: 3, alpha: 1, doc: "address = create(value, index, length)" },
    call: { value: 0xf1, delta: 7, alpha: 1, doc: "v = call(gasLimit, address, value, inputIndex, inputLength, outputIndex, outputLength)" },
    callcode: { value: 0xf2, delta: 7, alpha: 1, doc: "v = callcode(@TODO)" },
    "return": { value: 0xf3, delta: 2, alpha: 0, doc: "return(index, length)" },
    delegatecall: { value: 0xf4, delta: 6, alpha: 1, doc: "v = delegatecall(gasLimit, address, inputIndex, inputLength, outputIndex, outputLength)" },
    create2: { value: 0xf5, delta: 4, alpha: 1, doc: "address = create2(value, index, length, salt)" },
    staticcall: { value: 0xfa, delta: 6, alpha: 1, doc: "v = staticcall(gasLimit, address, inputIndex, inputLength, outputIndex, outputLength)" },
    revert: { value: 0xfd, delta: 2, alpha: 0, doc: "revert(returnDataOffset, returnDataLength)" },
    invalid: { value: 0xfe, delta: 0, alpha: 0, doc: "invalid" },
    suicide: { value: 0xff, delta: 1, alpha: 0, doc: "suicide(targetAddress)" },
};
var OpcodeMap = {};
var Opcodes = [];
for (var i = 0; i < 256; i++) {
    Opcodes.push(null);
}
Object.keys(_Opcodes).forEach(function (mnemonic) {
    var info = _Opcodes[mnemonic];
    var opcode = new Opcode(mnemonic.toUpperCase(), info.value, info.delta, info.alpha, info.doc);
    var key = opcode.mnemonic.toLowerCase();
    var value = opcode.value;
    if (OpcodeMap[key] || Opcodes[value]) {
        console.log(key, OpcodeMap[key], value, Opcodes[value]);
        throw new Error("There is a type in the above table.");
    }
    OpcodeMap[key] = opcode;
    Opcodes[value] = opcode;
});
Object.freeze(Opcodes);