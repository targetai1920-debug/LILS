import type { Branch } from '@/types';
import { isWithinBusinessHours } from './cochabamba';

export function isBranchOpenNow(branch: Pick<Branch, 'openTime' | 'closeTime'>, now: Date = new Date()): boolean {
  return isWithinBusinessHours(now, branch.openTime, branch.closeTime);
}
