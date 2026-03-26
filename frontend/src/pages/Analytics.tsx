import { BarChart3, TrendingUp, Clock, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from 'recharts';
import { useIncidentTrends, useIncidentTypeDistribution, usePeakIncidentHours } from '@/hooks/useQueries';

export default function Analytics() {
  const { data: trends = [] } = useIncidentTrends();
  const { data: typeDistribution = [] } = useIncidentTypeDistribution();
  const { data: peakHours = [] } = usePeakIncidentHours();

  const trendsData = trends.map(([month, count]) => ({
    month,
    incidents: Number(count),
  }));

  const typeData = typeDistribution.map(([type, count]) => ({
    type,
    count: Number(count),
    percentage: (Number(count) / typeDistribution.reduce((sum, [, c]) => sum + Number(c), 0)) * 100,
  }));

  const hoursData = peakHours.map(([hour, count]) => ({
    hour: `${Number(hour)}:00`,
    incidents: Number(count),
  }));

  const COLORS = ['oklch(var(--chart-1))', 'oklch(var(--chart-2))', 'oklch(var(--chart-3))', 'oklch(var(--chart-4))', 'oklch(var(--chart-5))'];

  return (
    <div className="container mx-auto h-full overflow-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Insights</h2>
        <p className="text-muted-foreground">Comprehensive incident data analysis</p>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
          <TabsTrigger value="hours">Peak Hours</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Incident Frequency Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  incidents: {
                    label: 'Incidents',
                    color: 'oklch(var(--chart-1))',
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                    <XAxis dataKey="month" stroke="oklch(var(--muted-foreground))" />
                    <YAxis stroke="oklch(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="incidents"
                      stroke="oklch(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: 'oklch(var(--chart-1))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Incident Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: 'Count',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={typeData}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {typeData.map((item, index) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <span className="text-muted-foreground">{item.count} incidents</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Peak Incident Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  incidents: {
                    label: 'Incidents',
                    color: 'oklch(var(--chart-2))',
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                    <XAxis dataKey="hour" stroke="oklch(var(--muted-foreground))" />
                    <YAxis stroke="oklch(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="incidents" fill="oklch(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
