import * as Plot from '@observablehq/plot';

type UserRow = {
  created_at: string;
  subscription_level: number;
  county: string;
  state: string;
  subscriber: boolean;
  verified: boolean;
}

function signupsByDay(rows: UserRow[]) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const day = row.created_at.split('T')[0]; // YYYY-MM-DD
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([day, count]) => ({ date: new Date(day), count }))
    .sort((a, b) => +a.date - +b.date);
}

function amountsByDay(rows: UserRow[]) {
  const amounts = new Map<string, number>();
  for (const row of rows) {
    const day = row.created_at.split('T')[0]; // YYYY-MM-DD
    amounts.set(day, (amounts.get(day) ?? 0) + row.subscription_level);
  }
  return [...amounts.entries()]
    .map(([day, amount]) => ({ date: new Date(day), amount }))
    .sort((a, b) => +a.date - +b.date);
}

export function buildSignupsLineOptions(rows: UserRow[]): Plot.PlotOptions {
  const data = signupsByDay(rows);
  return {
    width: 640,
    height: 320,
    marginLeft: 48,
    x: { type: 'utc', label: 'Date' },
    y: { grid: true, label: 'Signups' },
    color: { scheme: 'blues'},
    marks: [
      Plot.lineY(data, { x: 'date', y: 'count', stroke: 'steelblue', strokeWidth: 2 }),
      Plot.dot(data, { x: 'date', y: 'count', fill: 'steelblue', r: 3 }),
    ],
  };
}

export function buildAmountsLineOptions(rows: UserRow[]): Plot.PlotOptions {
  const data = amountsByDay(rows);
  return {
    width: 640,
    height: 320,
    marginLeft: 48,
    x: { type: 'utc', label: 'Date' },
    y: { grid: true, label: 'Amount (USD)' },
    color: { scheme: 'greens'},
    marks: [
      Plot.lineY(data, { x: 'date', y: 'amount', stroke: 'green', strokeWidth: 2 }),
      Plot.dot(data, { x: 'date', y: 'amount', fill: 'green', r: 3 }),
    ],
  };
}

export function buildSubscriptionHistogramOptions(rows: UserRow[]): Plot.PlotOptions {
  // Define the seven subscription levels we want shown as separate bars.
  const levels = [0, 5, 10, 15, 20, 25, 50];
  const counts = levels.map((level) => ({ level, count: rows.filter((r) => r.subscription_level === level).length }));
  const maxCount = Math.max(...counts.map((c) => c.count), 0);
  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  return {
    width: 640,
    height: 320,
    marginLeft: 48,
    x: { label: 'Subscription Level', domain: levels, ticks: 7 },
    y: { grid: true, label: 'Users', ticks: yTicks, tickFormat: (d: any) => String(d) },
    marks: [
      Plot.barY(counts, { x: 'level', y: 'count', fill: '#7d7f7c' }),
    ],
  };
}

/* type CountyCount = { county: string, state: string, count: number };
export type CountyCentroid = CountyCount & { latitude: number; longitude: number };

function aggregateByCounty(rows: UserRow[]): CountyCount[] {
  const map = new Map<string, CountyCount>();
  for (const { county, state } of rows) {
    const key = `${county}, ${state}`;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
    } 
    else {
      map.set(key, { county, state, count: 1 });
    } 
  }
  return [...map.values()];
}

export function buildCountyBubbleMapOptions(
  rows: UserRow[],
  centroids: CountyCentroid[] | null
): Plot.PlotOptions {
  const counts = aggregateByCounty(rows);
  const data = counts
    .map((c) => {
      const centroid = centroids?.find(
        (g) =>
          g.county.toLowerCase() === c.county.toLowerCase() &&
          g.state.toLowerCase() === c.state.toLowerCase()
      );
      return centroid ? { ...c, ...centroid } : null;  
    })
    .filter(Boolean) as CountyCentroid[];

  return {
    width: 900,
    height: 500,
    projection: { type: 'albers-usa' },
    marks: [
      Plot.dot(data, {
        x: 'longitude',
        y: 'latitude',
        r: 'count',
        fill: 'count',
        fillOpacity: 0.7,
        stroke: '#333', 
        title: (d) => `${d.county}, ${d.state}: ${d.count}`,
      }),
      Plot.geo({ type: 'Sphere'}, { fill: '#f8fafc', stroke: '#cbd5e1' }),
    ],
    color: { legend: true, label: 'Subscribers' },
  };
} */     

        