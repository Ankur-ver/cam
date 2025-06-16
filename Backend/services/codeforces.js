/*  codeforces data fetch */

const axios = require('axios');
function formatDateFromSeconds(seconds) {
  const date = new Date(seconds * 1000);
  return date.toISOString().split('T')[0];
}
async function fetchCFData(handle) {
  try {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
      axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
      axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
    ]);
    const info = infoRes.data.result[0];
    const ratingHistory = ratingRes.data.result;
    const submissionsRaw = statusRes.data.result;
    const accepted = submissionsRaw.filter(s => s.verdict === 'OK');
    const solvedSet = new Set();
    const solvedProblems = [];
    accepted.forEach(sub => {
      const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!solvedSet.has(problemKey)) {
        solvedSet.add(problemKey);
        solvedProblems.push({
          rating: sub.problem.rating,
          creationTimeSeconds: sub.creationTimeSeconds,
          date: formatDateFromSeconds(sub.creationTimeSeconds),
        });
      }
    });
    const buckets = {};
    const heatmap = {};
    let totalRating = 0;
    let mostDifficult = 0;

    solvedProblems.forEach(p => {
      const r = p.rating || 0;
      mostDifficult = Math.max(mostDifficult, r);
      totalRating += r;

      const bucket = Math.floor(r / 100) * 100;
      buckets[bucket] = (buckets[bucket] || 0) + 1;

      const d = p.date;
      heatmap[d] = (heatmap[d] || 0) + 1;
    });
    const totalSolved = solvedProblems.length;
    const timeSpanDays =
      solvedProblems.length > 1
        ? Math.ceil(
          (Math.max(...solvedProblems.map(p => p.creationTimeSeconds)) -
            Math.min(...solvedProblems.map(p => p.creationTimeSeconds))) /
          (60 * 60 * 24)
        )
        : 1;
    const avgRating = totalSolved ? totalRating / totalSolved : 0;
    const avgPerDay = totalSolved / timeSpanDays;
    const contestMap = {};
    solvedProblems.forEach(p => {
      if (p.contestId) {
        contestMap[p.contestId] = contestMap[p.contestId] || new Set();
        contestMap[p.contestId].add(p.index);
      }
    });
    const contestHistory = ratingHistory.map(c => {
      const related = submissionsRaw.filter(s => s.contestId === c.contestId);
      const totalUniqueProblems = new Set(related.map(s => s.problem.index)).size;
      const solvedInContest = contestMap[c.contestId]?.size || 0;
      return {
        contestId: c.contestId,
        contestName: c.contestName,
        rank: c.rank,
        oldRating: c.oldRating,
        newRating: c.newRating,
        ratingChange: c.newRating - c.oldRating,
        date: formatDateFromSeconds(c.ratingUpdateTimeSeconds),
        unsolvedCount: totalUniqueProblems - solvedInContest,
      };
    });
    return {
      currentRating: info.rating || 0,
      maxRating: info.maxRating || 0,
      contestHistory,
      problemStats: {
        mostDifficult,
        totalSolved,
        avgRating,
        avgPerDay,
        buckets,
        heatmap,
      },
      lastSynced: new Date(),
    };
  } catch (err) {
    console.error('Error fetching Codeforces data:', err);
    throw new Error('Codeforces fetch failed');
  }
}

module.exports = { fetchCFData };
