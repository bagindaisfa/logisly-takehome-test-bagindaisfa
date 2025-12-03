/**
 * TOP Calculation Logic (Node.js)
 *
 * @param {number} baselineTop
 * @param {number} podLateDays
 * @param {number} epodLateDays
 * @returns {number}
 */
function calculateTopResult(baselineTop, podLateDays, epodLateDays) {
  // Step 1 — negative values treated as 0
  const safePod = Math.max(0, podLateDays);
  const safeEpod = Math.max(0, epodLateDays);

  // Step 2 — individual caps
  const TS_MAX_TOP_DELAY_POD = 30;
  const TS_MAX_TOP_DELAY_EPOD = 30;

  const podDelay = Math.min(safePod, TS_MAX_TOP_DELAY_POD);
  const epodDelay = Math.min(safeEpod, TS_MAX_TOP_DELAY_EPOD);

  // Step 3 — combined penalty
  const penalty = podDelay + epodDelay;

  // Step 4 — baseline + penalty
  const totalTop = baselineTop + penalty;

  // Step 5 — final cap
  const TS_MAX_TOP_DELAY = 45;

  return Math.min(totalTop, TS_MAX_TOP_DELAY);
}

module.exports = { calculateTopResult };
