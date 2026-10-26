import { MarketSessionInfo } from '../types';

export function getJakartaTime(): Date {
  // Indonesian Western Time (WIB) is UTC+7
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 3600000);
}

export function getMarketSessionInfo(): MarketSessionInfo {
  const wib = getJakartaTime();
  const hours = wib.getHours();
  const minutes = wib.getMinutes();
  const seconds = wib.getSeconds();
  const totalMinutes = hours * 60 + minutes;
  const dayOfWeek = wib.getDay(); // 0 is Sunday, 6 is Saturday

  const isTradingDay = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isFriday = dayOfWeek === 5;

  // Format current WIB Time
  const pad = (n: number) => n.toString().padStart(2, '0');
  const currentWibTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} WIB`;
  const currentWibDate = wib.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // IDX Session timings (in minutes from midnight)
  // Pre-Opening: 08:45 (525m) to 08:55 (535m)
  // Pre-Opening Allocation: 08:55 to 08:59 (539m)
  // Session 1: 09:00 (540m) to 12:00 (720m) [or 11:30 (690m) on Friday]
  // Break: 12:00 - 13:30 (810m) [or 11:30 - 14:00 (840m) on Friday]
  // Session 2: 13:30 (or 14:00) to 15:49 (949m)
  // Pre-Closing & Post-Closing: 15:50 to 16:15 (975m)
  // Closed: 16:15 onwards

  const session1End = isFriday ? 11 * 60 + 30 : 12 * 60;
  const session2Start = isFriday ? 14 * 60 : 13 * 60 + 30;

  let status: MarketSessionInfo['status'] = 'CLOSED';
  let statusLabel = 'Market Closed';
  let nextMilestone = 'Pre-Opening Session (08:45 WIB)';
  let targetSeconds = 0;

  if (!isTradingDay) {
    status = 'CLOSED';
    statusLabel = 'Weekend - Market Closed';
    nextMilestone = 'Monday Pre-Opening (08:45 WIB)';
    targetSeconds = 0;
  } else if (totalMinutes < 525) {
    // Before 08:45
    status = 'PRE_MARKET';
    statusLabel = 'Pre-Market Pulse (Overnight Disclosures)';
    nextMilestone = 'Pre-Opening Matching (08:45 WIB)';
    targetSeconds = 525 * 60 - (totalMinutes * 60 + seconds);
  } else if (totalMinutes < 539) {
    // 08:45 - 08:59
    status = 'PRE_OPEN';
    statusLabel = 'Pre-Opening Order Matching';
    nextMilestone = 'Continuous Trading Session 1 (09:00 WIB)';
    targetSeconds = 540 * 60 - (totalMinutes * 60 + seconds);
  } else if (totalMinutes < session1End) {
    // 09:00 - 12:00
    status = 'SESSION_1';
    statusLabel = 'Continuous Trading (Session 1)';
    nextMilestone = `Session 1 Break (${isFriday ? '11:30' : '12:00'} WIB)`;
    targetSeconds = session1End * 60 - (totalMinutes * 60 + seconds);
  } else if (totalMinutes < session2Start) {
    status = 'BREAK';
    statusLabel = 'Inter-Session Break';
    nextMilestone = `Session 2 Open (${isFriday ? '14:00' : '13:30'} WIB)`;
    targetSeconds = session2Start * 60 - (totalMinutes * 60 + seconds);
  } else if (totalMinutes < 949) {
    // Session 2
    status = 'SESSION_2';
    statusLabel = 'Continuous Trading (Session 2)';
    nextMilestone = 'Pre-Closing Phase (15:50 WIB)';
    targetSeconds = 950 * 60 - (totalMinutes * 60 + seconds);
  } else if (totalMinutes < 975) {
    status = 'POST_MARKET';
    statusLabel = 'Pre/Post-Closing Matching';
    nextMilestone = 'Market Close (16:15 WIB)';
    targetSeconds = 975 * 60 - (totalMinutes * 60 + seconds);
  } else {
    status = 'CLOSED';
    statusLabel = 'Trading Closed (Post-Market Buffer)';
    nextMilestone = 'Tomorrow Pre-Opening (08:45 WIB)';
    targetSeconds = (24 * 60 + 525) * 60 - (totalMinutes * 60 + seconds);
  }

  // Format countdown
  const hoursRemaining = Math.floor(targetSeconds / 3600);
  const minutesRemaining = Math.floor((targetSeconds % 3600) / 60);
  const secondsRemaining = targetSeconds % 60;
  
  let countdownFormatted = '';
  if (hoursRemaining > 0) {
    countdownFormatted = `${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`;
  } else if (minutesRemaining > 0) {
    countdownFormatted = `${minutesRemaining}m ${secondsRemaining}s`;
  } else {
    countdownFormatted = `${secondsRemaining}s`;
  }

  return {
    currentWibTime,
    currentWibDate,
    status,
    statusLabel,
    nextMilestone,
    countdownSeconds: targetSeconds,
    countdownFormatted,
    isTradingDay
  };
}
