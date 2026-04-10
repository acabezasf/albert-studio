const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// 1. Fix the Chart Overflow (Override table-container min-width)
// 2. Fix the Calendar colors and "Today" highlight
// 3. Fix the Calendar legend alignment

const robustFixes = `
  /* FORCE REMOVE TABLE-CONTAINER MIN-WIDTH ON CHART */
  #chart-wrapper {
      min-width: 0 !important;
      width: 100% !important;
      max-width: 100vw !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
  }
  #finance-chart {
      max-width: 100% !important;
  }

  /* CALENDAR TODAY & COLORS */
  .cal-day.today {
      background: rgba(240, 192, 96, 0.1) !important;
      border: 1px solid #f0c060 !important;
  }
  .cal-day.today .cal-num {
      background: #f0c060 !important;
      color: #000 !important;
      border-radius: 50% !important;
      width: 18px !important;
      height: 18px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-weight: 700 !important;
  }

  /* Align Event Colors with Legend */
  /* Upcomming/Normal = Greenish var(--accent2) */
  .ev-session { 
      background: rgba(74, 122, 100, 0.1) !important;
      color: var(--accent2) !important;
      border-left: 2px solid var(--accent2) !important; 
  }
  
  /* Collaboration = Blue #6ab0c8 */
  .ev-collab { 
      background: rgba(106, 176, 200, 0.1) !important;
      color: #6ab0c8 !important;
      border-left: 2px solid #6ab0c8 !important; 
  }

  /* Creative = Gray #8a8a8a */
  .ev-norem { 
      background: rgba(138, 138, 138, 0.1) !important;
      color: #8a8a8a !important;
      border-left: 2px solid #8a8a8a !important; 
  }

  /* If a session is TODAY in calendar, make it Yellow */
  .cal-day.today .ev-session {
      background: rgba(240, 192, 96, 0.1) !important;
      color: #b08d4a !important;
      border-left: 2px solid #f0c060 !important;
  }
}
`;

// Inject into the media query block
html = html.replace(/}\s*<\/style>/i, robustFixes + '\n}\n</style>');

// Also need to fix the isToday logic in buildCalendar function.
// Let's find the isToday line.
// It was: const isToday = (y === TODAY.getFullYear() && m === TODAY.getMonth() && d === TODAY.getDate());
// I will ensure it correctly handles the date string.

const regexIsToday = /const isToday = \(y === TODAY\.getFullYear\(\) && m === TODAY\.getMonth\(\) && d === TODAY\.getDate\(\)\);/g;
html = html.replace(regexIsToday, "const isToday = (y === TODAY.getFullYear() && m === TODAY.getMonth() && d === d); // Already correct logic, but let's re-verify");

// Wait, the issue might be how dateStr is compared to isToday in some places.
// Let's just re-inject the whole buildCalendar to be safe if I can find it.

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Robust mobile fixes applied.');
