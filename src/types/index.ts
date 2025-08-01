import type { Alchemy, Block } from 'alchemy-sdk';
export type { Alchemy, Block };


// Types for "Post-processed" Alchemy Types end with P:
export type BlockP = {
  timestamp: string,
  transactions: string,
  recipientHashFull: string,
  recipientHashShort: string,
}