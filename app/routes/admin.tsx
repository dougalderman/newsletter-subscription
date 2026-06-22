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
  // const [ centroids, setCentroids ] = useState<charts.CountyCentroid[] | null>(null);

  /* useEffect(() => {
    fetch('/data/us-county-centroids.json')
      .then((response) => response.json())
      .then(setCentroids);
  }, []); */
 
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

  /* const countyBubbleMapOptions = useMemo(
    () => (data ? charts.buildCountyBubbleMapOptions(data, centroids) : null),
    [data]
  ); */

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
      </main>
    );
}  