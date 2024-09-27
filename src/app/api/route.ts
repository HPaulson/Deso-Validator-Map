"use server";

import { NextRequest } from "next/server";

async function GET(request: NextRequest): Promise<Response> {
  try {
    const graphQl = await fetch("https://graphql-prod.deso.com/graphql", {
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: '{"operationName":"GetValidators","variables":{"viewerPublicKey":""},"query":"query GetValidators($viewerPublicKey: String!, $first: Int, $after: Cursor, $last: Int, $before: Cursor) {\\n  validatorStats(\\n    first: $first\\n    after: $after\\n    before: $before\\n    last: $last\\n    orderBy: VALIDATOR_RANK_ASC\\n  ) {\\n    totalCount\\n    pageInfo {\\n      hasNextPage\\n      hasPreviousPage\\n      endCursor\\n      startCursor\\n      __typename\\n    }\\n    nodes {\\n      ...ValidatorsTableRow\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment Validator on ValidatorEntry {\\n  validatorPkid\\n  domains\\n  jailedAtEpochNumber\\n  lastActiveAtEpochNumber\\n  totalStakeAmountNanos\\n  delegatedStakeCommissionBasisPoints\\n  disableDelegatedStake\\n  votingPublicKey\\n  votingAuthorization\\n  validatorStats {\\n    percentTotalStake\\n    validatorRank\\n    __typename\\n  }\\n  account {\\n    username\\n    publicKey\\n    description\\n    extraData\\n    viewerStakeRewards: validatorStakeRewards(\\n      filter: {staker: {publicKey: {equalTo: $viewerPublicKey}}}\\n    ) {\\n      totalCount\\n      nodes {\\n        stakerPkid\\n        rewardNanos\\n        rewardMethod\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  stakeEntries {\\n    totalCount\\n    __typename\\n  }\\n  viewerStake: stakeEntries(\\n    filter: {staker: {publicKey: {equalTo: $viewerPublicKey}}}\\n  ) {\\n    nodes {\\n      stakeAmountNanos\\n      rewardMethod\\n      staker {\\n        publicKey\\n        desoBalance {\\n          publicKey\\n          balanceNanos\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ValidatorsTableRow on ValidatorStat {\\n  validatorPkid\\n  validatorRank\\n  percentTotalStake\\n  validatorEntry {\\n    ...Validator\\n    __typename\\n  }\\n  __typename\\n}"}',
      method: "POST",
      cache: 'no-store'
    });

    const data = await graphQl.json();
    let validators: {
      name: string;
      domain: string;
      location: any;
    }[] = data.data.validatorStats.nodes.map((node: any) => {
      return {
        name: node.validatorEntry.account.username,
        domain: node.validatorEntry.domains[0].split(":")[0],
        jailed: Number(node.validatorEntry.jailedAtEpochNumber) > 0,
      };
    });

    for (let i = 0; i < validators.length; i++) {
      const location = await getLocation(validators[i].domain);
      validators[i].location = location ? location : "Unknown";
    }

    return new Response(JSON.stringify(validators), {
      status: 200,
    });
  } catch (error) {
    return new Response("Error: " + error);
  }
}

async function getLocation(domain: string) {
  const response = await fetch(`http://ip-api.com/json/${domain}`);
  return await response.json();
}

export { GET };
export const revalidate = 60;
