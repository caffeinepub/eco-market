import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalityRisks, useLocalitySearchResults, useInitializeSampleData } from '@/hooks/useQueries';
import type { LocalityRisk, LocalitySearchResult } from '@/backend';

export default function MapView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<LocalityRisk | null>(null);
  const [highlightedLocality, setHighlightedLocality] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: localities = [], isLoading } = useLocalityRisks();
  const { data: searchResults = [] } = useLocalitySearchResults(searchQuery);
  const { mutate: initData } = useInitializeSampleData();

  useEffect(() => {
    if (localities.length === 0 && !isLoading) {
      initData();
    }
  }, [localities.length, isLoading, initData]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocality = (result: LocalitySearchResult) => {
    const fullLocality = localities.find((loc) => loc.name === result.name);
    if (fullLocality) {
      setSelectedLocality(fullLocality);
      setHighlightedLocality(fullLocality.name);
      setMapCenter({ lat: fullLocality.latitude, lng: fullLocality.longitude });
      setMapZoom(8);
      setSearchQuery(result.name);
      setShowSuggestions(false);
    }
  };

  const handleMarkerClick = (locality: LocalityRisk) => {
    setSelectedLocality(locality);
    setHighlightedLocality(locality.name);
    setMapCenter({ lat: locality.latitude, lng: locality.longitude });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setHighlightedLocality(null);
    setShowSuggestions(false);
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'risk-high';
      case 'medium':
        return 'risk-medium';
      case 'low':
        return 'risk-low';
      default:
        return 'muted';
    }
  };

  const getRiskBadgeVariant = (level: string): 'default' | 'secondary' | 'destructive' => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Search Bar with Auto-suggest */}
      <div className="absolute left-4 top-4 z-10 w-80 max-w-[calc(100%-2rem)]" ref={searchRef}>
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search locality..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                  className="pl-9 pr-8"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Auto-suggest Dropdown */}
            {showSuggestions && searchResults.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto rounded-md border bg-popover shadow-md">
                {searchResults.map((result) => (
                  <button
                    key={result.name}
                    onClick={() => handleSelectLocality(result)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{result.name}</span>
                    </div>
                    <Badge variant={getRiskBadgeVariant(result.riskLevel)} className="text-xs">
                      {result.riskLevel}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

            {showSuggestions && searchQuery.length > 0 && searchResults.length === 0 && (
              <div className="mt-2 rounded-md border bg-popover px-3 py-2 text-sm text-muted-foreground shadow-md">
                No localities found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Risk Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-risk-low" />
              <span className="text-xs">Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-risk-medium" />
              <span className="text-xs">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-risk-high" />
              <span className="text-xs">High Risk</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      <div className="h-full w-full bg-gradient-to-br from-background via-accent/5 to-background">
        <div className="relative h-full w-full overflow-hidden">
          {/* Simulated World Map with Pins */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: 'url(/assets/generated/hero-banner.png)',
              filter: 'grayscale(100%)',
            }}
          />
          
          {/* Locality Markers */}
          <div className="relative h-full w-full">
            {localities.map((locality) => {
              const x = ((locality.longitude + 180) / 360) * 100;
              const y = ((90 - locality.latitude) / 180) * 100;
              const isHighlighted = highlightedLocality === locality.name;
              
              return (
                <button
                  key={locality.name}
                  onClick={() => handleMarkerClick(locality)}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-all ${
                    isHighlighted ? 'z-20 scale-125' : 'z-10 hover:scale-125'
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="relative">
                    {/* Glow effect for highlighted locality */}
                    {isHighlighted && (
                      <div className="absolute inset-0 -m-2 animate-pulse rounded-full bg-primary/30 blur-md" />
                    )}
                    
                    <MapPin
                      className={`relative h-8 w-8 drop-shadow-lg transition-all ${
                        isHighlighted ? 'h-10 w-10' : 'group-hover:h-10 group-hover:w-10'
                      } text-${getRiskColor(locality.riskLevel)}`}
                      fill="currentColor"
                    />
                    
                    {/* Border/ring for highlighted locality */}
                    {isHighlighted && (
                      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary animate-ping" />
                    )}
                    
                    <div
                      className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-card/90 px-2 py-1 text-xs font-medium shadow-lg backdrop-blur-sm transition-opacity ${
                        isHighlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {locality.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Locality Details Sheet */}
      <Sheet open={!!selectedLocality} onOpenChange={(open) => !open && setSelectedLocality(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>{selectedLocality?.name}</span>
              <Badge variant={selectedLocality ? getRiskBadgeVariant(selectedLocality.riskLevel) : 'default'}>
                {selectedLocality?.riskLevel} Risk
              </Badge>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-6 h-[calc(100vh-8rem)]">
            <div className="space-y-4">
              {/* Risk Score */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    Risk Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Number(selectedLocality?.riskScore || 0)}</div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full bg-${getRiskColor(selectedLocality?.riskLevel || '')}`}
                      style={{ width: `${Number(selectedLocality?.riskScore || 0)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Incident Count */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Total Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Number(selectedLocality?.incidentCount || 0)}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Recorded incidents in this locality</p>
                </CardContent>
              </Card>

              {/* Common Incident Type */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Most Common Incident</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-sm">
                    {selectedLocality?.commonIncidentType || 'Unknown'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Peak Time */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    Peak Incident Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">
                    {Number(selectedLocality?.peakIncidentTime || 0)}:00
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Hour with most incidents</p>
                </CardContent>
              </Card>

              {/* Location Coordinates */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Coordinates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Latitude:</span>{' '}
                    <span className="font-mono">{selectedLocality?.latitude.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Longitude:</span>{' '}
                    <span className="font-mono">{selectedLocality?.longitude.toFixed(4)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
