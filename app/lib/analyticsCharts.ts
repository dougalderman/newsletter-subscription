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

type CountyCount = { county: string, state: string, count: number };
export type CountyCentroid = CountyCount & { latitude: number; longitude: number };

interface County { lat: number; lng: number; }
interface StateCentroid { counties: Record<string, County>; [k: string]: any }


function aggregateByCounty(rows: UserRow[]): CountyCount[] {
  const map = new Map<string, CountyCount>();
  for (const { county, state } of rows) {
    const countyLC = county.toLowerCase();
    const stateLC = state.toLowerCase();
    const key = `${county}, ${state}`;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
    } 
    else {
      map.set(key, { county: countyLC, state: stateLC, count: 1 });
    } 
  }
  return [...map.values()];
}

function aggregateCentroidsByCounty(centroids: any): CountyCentroid[] {
  if (!centroids) return [];

  let countyCentroid: CountyCentroid[] = [];

  // Convert top-level object to array (typed)
  const topLevelArray = (Object.entries(centroids as Record<string, StateCentroid>) as [string, StateCentroid][]) .map(([state, value]) => ({
    state: state.toLowerCase(),
    ...(value || {})
  }));

  // Convert country object to array — cast county entries and spread mapped arrays into the result
  for (const stateObj of topLevelArray) {
    const entries = Object.entries(stateObj.counties as Record<string, County>) as [string, County][];
    countyCentroid.push(...entries.map(([county, value]) => ({
      state: stateObj.state,
      county: county.toLowerCase(),
      count: 0,
      latitude: value.lat,
      longitude: value.lng
    })));
  }

  return countyCentroid;
}

export function buildCountyBubbleMapOptions(
  rows: UserRow[],
  centroids: any,
  nation: any,
  statemesh: any
): Plot.PlotOptions {
  const counts: CountyCount[] = aggregateByCounty(rows);
  const countyCentroids: CountyCentroid[] = aggregateCentroidsByCounty(centroids);
  
  // Add lat and long from countyCentroids to array elements in counts.
  let data: CountyCentroid[] = [];

  for (const count of counts) {
    const centroid: CountyCentroid | undefined = countyCentroids.find(element => 
      count.state === element.state && count.county === element.county
    );
    if (centroid) {
      data.push(Object.assign({}, centroid, count));
    }  
  }

  return {
    width: 975,
    projection: 'identity',
    marks: [
      Plot.geo(nation, { fill: "#ddd" }),
      Plot.geo(statemesh, { stroke: "white" }),
      Plot.geo(data, {
        // Transform your row into a GeoJSON geometry object
        geometry: (d) => ({
          type: 'Point',
          coordinates: [d.longitude, d.latitude]
        }),

        // Turn the geo points into sized bubbles
        r: (d) => d.count,
        fill: 'count',
        fillOpacity: 0.7,
        stroke: '#000'
      }),
    ],
  };
}    

        