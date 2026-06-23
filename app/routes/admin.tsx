import { useMemo, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PlotFigure } from '../components/plot/plot-figure';
import { useAnalytics } from '../hooks/useUsers';
import * as charts from '../lib/analyticsCharts';

export default function AdminPage() {

  const { data, isLoading, isError } = useAnalytics();
  const [ centroids, setCentroids ] = useState<any>(null);
  const [ nation, setNation ] = useState<any>(null);
  const [ statemesh, setStatemesh ] = useState<any>(null);

  useEffect(() => {
     // Create an AbortController to handle component unmounting / race conditions
    const controller = new AbortController();
    
    const fetchDashboardData = async () => {
      try {
        // All three fetches start at the same time
        const [centroidsRes, nationRes, statemeshRes] = await Promise.all([
          fetch('/data/us-county-centroids.json', { signal: controller.signal }),
          fetch('/data/nation.json', { signal: controller.signal }),
          fetch('/data/statemesh.json', { signal: controller.signal }),
        ]);

        const centroidsJson = await centroidsRes.json();
        const nationJson = await nationRes.json();
        const statemeshJson = await statemeshRes.json();

        setCentroids(centroidsJson);
        setNation(nationJson);
        setStatemesh(statemeshJson);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch data", error);
        }
      } 
    };

    fetchDashboardData();

    // Cleanup: aborts requests if user navigates away before they finish
    return () => controller.abort();
  }, []); // Empty array runs this once on mount
  
  const signupsLineOptions = useMemo(
    () => (data ? charts.buildSignupsLineOptions(data) : null),
    [data]
  );

  const amountsLineOptions = useMemo(
    () => (data ? charts.buildAmountsLineOptions(data) : null),
    [data]
  );

  const subscriptionHistogramOptions = useMemo(
    () => (data ? charts.buildSubscriptionHistogramOptions(data) : null),
    [data]
  );

  const countyBubbleMapOptions = useMemo(
    () => (data && centroids && nation && statemesh ? charts.buildCountyBubbleMapOptions(
      data,
      centroids,
      nation,
      statemesh
    ) : null),
    [data, centroids, nation, statemesh]
  );

  if (isLoading) return <p>Loading analytics...</p>;
  if (isError || !data) return <p>Error loading analytics.</p>;
  
  return (
      <main className="container mx-auto p-6 space-y-8">
        <Card>
          <CardHeader><CardTitle>Signups over time</CardTitle></CardHeader>
          <CardContent>
            {signupsLineOptions && <PlotFigure options={signupsLineOptions} className="w-full overflow-x-auto" />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Amounts over time</CardTitle></CardHeader>
          <CardContent>
            {amountsLineOptions && <PlotFigure options={amountsLineOptions} className="w-full overflow-x-auto" />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Subscription Levels</CardTitle></CardHeader>
          <CardContent>
            {subscriptionHistogramOptions && <PlotFigure options={subscriptionHistogramOptions} className="w-full overflow-x-auto" />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>U.S. County Map of Subscriptions</CardTitle></CardHeader>
          <CardContent>
            {countyBubbleMapOptions && <PlotFigure options={countyBubbleMapOptions} className="w-full overflow-x-auto" />}
          </CardContent>
        </Card>
      </main>
    );
}  