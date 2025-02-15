import { createHash } from "crypto";


export class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;

    constructor(index:number,hash: string, previousHash: string, timestamp: number, data: string) {
        this.index = index;
        this.hash = hash 
        this.previousHash = previousHash
        this.timestamp = timestamp
        this.data = data
    }
}

export const genesisBlock: Block = new Block(
  0,"c87c20a053ba4ddedd9d5ed553c53d8ba13b9f8b2ebc85a9b0ec9443c36d5290","",Date.now(),
  "this is the genesis block!"
);
let blockchain = [];
function calculateHash(index:number,previousHash:string,timestamp:number,data:string):string {
  let hash = createHash("SHA256");
    hash.update(index + previousHash + timestamp + data);
    return hash.digest("hex").toString();
  }


export function generateNextBlock(blockData: string,blocks:Block[],block:Block) {
  const previousBlock:Block = getLatestBLock(blocks);
  const nextIndex:number = previousBlock.index + 1;
  const nextTimestamp:number = new Date().getTime() / 1000;
  const nextHash:string = calculateHash(nextIndex,previousBlock.hash,nextTimestamp,blockData)
  const newBlock:Block = new Block(nextIndex,nextHash,previousBlock.hash,nextTimestamp,blockData);
  return newBlock;
  }


export function getLatestBLock(blocks:Block[]):Block {
  return blocks[blocks.length - 1];
}

export function isValidNewBlock(newBlock: Block,previousBlock:Block){
  if(previousBlock.index + 1 !== newBlock.index) {
    console.log("invalid index");
    return false;
  }else if(previousBlock.hash !== newBlock.previousHash) {
    console.log("invalid previousHash");
    return false
  }else if(calculateHash(newBlock.index,newBlock.previousHash,newBlock.timestamp,newBlock.data) !== newBlock.hash) {
    console.log(typeof (newBlock.hash) + "" + typeof calculateHash(newBlock.index,newBlock.previousHash,newBlock.timestamp,newBlock.data) + "" + newBlock.hash);
    return false
  }
  return true
}

export function isValidBlockStructure(block:Block):boolean {
  return typeof block.index=== "number" &&
         typeof block.hash === "string" &&
         typeof block.previousHash === "string" &&
         typeof block.timestamp === "number" &&
         typeof block.data === "string"
}

export function isValidChain(blockchainToValidate: Block[]):boolean {
  const isValidGenesis = (block:Block):boolean => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  } 

  if(!isValidGenesis(blockchainToValidate[0])) {
    return false;
  }

  for(let i = 1; i < blockchainToValidate.length; i++) {
   if(!isValidNewBlock(blockchainToValidate[i],blockchainToValidate[i - 1])) {
    return false;
   }
  }

  return true;
}

function getBlockchain():Block[] {
  return []
}

function broadCastLatest() {
  console.log("new block added")
}

export function replaceChain(newBlocks: Block[]) {
if(!isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
  console.log("Recieved blockchain is valid,")
  blockchain = newBlocks;
  broadCastLatest()
}else {
  console.log("Recieved blockchain invalid");
}
}