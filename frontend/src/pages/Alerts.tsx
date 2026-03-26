import { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAlerts } from '@/hooks/useQueries';
import type { Alert } from '@/backend';

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const { data: alerts = [], isLoading } = useAlerts();

  const filteredAlerts = alerts
    .filter((alert) => severityFilter === 'all' || Number(alert.severity) === Number(severityFilter))
    .sort((a, b) => Number(b.time) - Number(a.time));

  const getSeverityBadge = (severity: bigint): { variant: 'default' | 'secondary' | 'destructive'; label: string } => {
    const sev = Number(severity);
    if (sev >= 3) return { variant: 'destructive', label: 'High' };
    if (sev === 2) return { variant: 'default', label: 'Medium' };
    return { variant: 'secondary', label: 'Low' };
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto h-full p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Alerts</h2>
          <p className="text-muted-foreground">High-risk incidents requiring attention</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="1">Low</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-14rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-3/4 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredAlerts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No alerts found</h3>
              <p className="text-sm text-muted-foreground">
                {severityFilter === 'all'
                  ? 'There are currently no active alerts'
                  : 'No alerts match the selected severity filter'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const { variant, label } = getSeverityBadge(alert.severity);
              return (
                <Card key={Number(alert.id)} className="transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{alert.location}</CardTitle>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(alert.time)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
