import { AsyncRenderer } from '@vegaprotocol/ui-toolkit';
import { useEpochAssetsRewardsQuery } from '../home/__generated__/Rewards';
import { useRefreshAfterEpoch } from '../../../hooks/use-refresh-after-epoch';
import { generateEpochTotalRewardsList } from './generate-epoch-total-rewards-list';
import { NoRewards } from '../no-rewards';
import { EpochTotalRewardsTable } from './epoch-total-rewards-table';

export const EpochRewards = () => {
  const { data, loading, error, refetch } = useEpochAssetsRewardsQuery({
    variables: {
      epochRewardSummariesPagination: {
        first: 10,
      },
    },
  });
  useRefreshAfterEpoch(data?.epoch.timestamps.expiry, refetch);

  const epochRewardSummaries = generateEpochTotalRewardsList(data) || [];

  return (
    <AsyncRenderer
      loading={loading}
      error={error}
      data={data}
      render={() => (
        <div
          className="max-w-full overflow-auto"
          data-testid="epoch-rewards-total"
        >
          {epochRewardSummaries.length === 0 ? (
            <NoRewards />
          ) : (
            <>
              {epochRewardSummaries.map((aggregatedEpochSummary) => (
                <EpochTotalRewardsTable data={aggregatedEpochSummary} />
              ))}
            </>
          )}
        </div>
      )}
    />
  );
};