const axios = require('axios');

async function fetchCFData(handle) {
  try {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
      axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
      axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
    ]);

    const info = infoRes.data.result[0];
    const contestHistory = ratingRes.data.result.map(c => ({
      contestId: c.contestId,
      contestName: c.contestName,
      rank: c.rank,
      oldRating: c.oldRating,
      newRating: c.newRating,
      ratingChange: c.newRating - c.oldRating,
      relativeTimeSeconds: c.ratingUpdateTimeSeconds,
    }));

    const submissions = statusRes.data.result
      .filter(s => s.verdict === 'OK')
      .map(s => ({
        problemId: `${s.problem.contestId}-${s.problem.index}`,
        contestId: s.problem.contestId,
        index: s.problem.index,
        name: s.problem.name,
        rating: s.problem.rating,
        verdict: s.verdict,
        creationTimeSeconds: s.creationTimeSeconds,
      }));

    return {
      currentRating: info.rating || 0,
      maxRating: info.maxRating || 0,
      contestHistory,
      submissions,
      lastSynced: new Date(),
    };
  } catch (err) {
    console.error('Error fetching Codeforces data:', err);
    throw new Error('Codeforces fetch failed');
  }
}

module.exports = { fetchCFData };
