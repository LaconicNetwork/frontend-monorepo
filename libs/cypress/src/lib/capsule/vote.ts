import type * as Schema from '@vegaprotocol/types';
import { request } from './request';
import { createLog } from './logging';

const log = createLog('vote');

export async function vote(
  proposalId: string,
  voteValue: Schema.VoteValue,
  publicKey: string,
  token: string
) {
  log(`voting ${voteValue} on ${proposalId}`);

  const voteTx = createVote(proposalId, voteValue);
  const voteResult = await request('client.send_transaction', {
    token,
    publicKey,
    sendingMode: 'TYPE_SYNC',
    transaction: voteTx,
  });

  return voteResult.result;
}

function createVote(proposalId: string, value: Schema.VoteValue) {
  return {
    voteSubmission: {
      value,
      proposalId,
    },
  };
}