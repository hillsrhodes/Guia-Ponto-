/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  CONTRIBUTOR_UPDATED_EVENT,
  ContributorProfileSnapshot,
  getContributorSnapshot
} from '../services/contributorRewardsService';

export function useContributorProfile(): ContributorProfileSnapshot {
  const [snapshot, setSnapshot] = useState<ContributorProfileSnapshot>(() =>
    getContributorSnapshot()
  );

  useEffect(() => {
    const sync = () => {
      setSnapshot(getContributorSnapshot());
    };

    window.addEventListener(CONTRIBUTOR_UPDATED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CONTRIBUTOR_UPDATED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return snapshot;
}
