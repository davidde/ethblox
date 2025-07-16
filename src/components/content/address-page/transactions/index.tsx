'use client';

import { useState, useEffect } from 'react';
import {
  AssetTransfersCategory,
  SortingOrder,
  AssetTransfersWithMetadataResult
} from 'alchemy-sdk';
import {
  getSecsFromDateTimeString,
  getBlockAgeFromSecs,
  getAlchemy
}
from '@/lib/utilities';
import ValueDisplay from '@/components/common/value-display';
import TransactionsView from './transactions-view';


export default function Transactions(props: {
  hash: string,
  network: string,
}) {
  const alchemy = getAlchemy(props.network);
  const maxNumTxsToShow = 10;
  const [txsResult, setTxsResult] = useState<AssetTransfersWithMetadataResult[]>();
  const [txsTotal, setTxsTotal] = useState<string>();
  const [txsError, setTxsError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        // By default returns a max of 1000 transfers:
        const resp = await alchemy.core.getAssetTransfers({
          fromAddress: props.hash,
          order: SortingOrder.DESCENDING, // Latest block numbers first!
          // EXTERNAL: Ethereum transaction initiated by an EOA (= externally-owned account),
          // an account managed by a human, not a contract:
          category: [ AssetTransfersCategory.EXTERNAL ],
          withMetadata: true,
        });
        setTxsResult(resp.transfers);
      } catch(err) {
        const error = 'AddressPage Transactions getAssetTransfers()' + err;
        console.error(error);
        setTxsError(error);
      }

      try {
        const resp = await alchemy.core.getTransactionCount(props.hash);
        setTxsTotal(resp.toLocaleString('en-US'));
      } catch(err) {
        setTxsTotal('unknown number of');
        const error = 'AddressPage Transactions getTransactionCount()' + err;
        console.error(error);
      }
    })();
  }, [alchemy, props.hash]);

  let transactions, transactionsDigest;
  if (txsResult) {
    if (txsResult.length === 0) transactionsDigest = 'No external transactions.';
    else {
      const numTxsToShow = Math.min(txsResult.length, maxNumTxsToShow);
      transactionsDigest = numTxsToShow > 1 ?
        `Showing latest ${numTxsToShow} external transactions of ${txsTotal} transactions total.`
        :
        `Showing last external transaction of ${txsTotal} transactions total.`;

      transactions = txsResult.slice(0, maxNumTxsToShow).map(
        tx => ({
            hash: tx.hash,
            block: +tx.blockNum,
            age: getBlockAgeFromSecs(getSecsFromDateTimeString(tx.metadata.blockTimestamp)),
            from: tx.from,
            to: tx.to,
            amount: tx.asset === 'ETH' ? `Ξ${tx.value?.toFixed(8) || ''}`
                  : `${tx.value?.toFixed(8) || ''} ${tx.asset || '/'}`,
        })
      );
    }
  }

  return (
    <div>
      <p className='mt-8'>
        <span>▶ &nbsp;</span>
        <span className='capsTitle italic !text-base !text-(--main-fg-color)
                        w-fit border-b border-b-(--main-fg-color)'>
          TRANSACTIONS
        </span>
      </p>
      <p className='pl-8 mt-4 text-sm tracking-wider py-3 border-y border-(--border-color)'>
        <ValueDisplay
          value={transactionsDigest}
          error={txsError}
          err='Error getting transactions. Please reload.'
        />
      </p>

      <TransactionsView // Only returns something when transactions is non-empty
        network={props.network}
        transactions={transactions}
      />
    </div>
  );
}