import { Shield, Database, Calculator, Lock, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAboutInfo } from '@/hooks/useQueries';

export default function About() {
  const { data: aboutInfo } = useAboutInfo();

  return (
    <div className="container mx-auto h-full overflow-auto p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-risk-high via-risk-medium to-risk-low">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Public Safety Risk Alert System</h1>
          <p className="text-lg text-muted-foreground">
            Advanced risk monitoring and incident analysis platform
          </p>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About This System
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              The Public Safety Risk Alert System is a comprehensive platform designed to visualize and analyze
              public safety risks across different localities. Using advanced data analytics and interactive
              mapping technology, the system provides real-time insights into incident patterns, risk levels,
              and safety trends.
            </p>
            <p>
              Our mission is to empower communities, law enforcement, and policymakers with actionable
              intelligence to improve public safety and allocate resources more effectively.
            </p>
          </CardContent>
        </Card>

        {/* Data Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {aboutInfo?.dataSource ||
                'This app uses simulated incident data for demonstration purposes.'}
            </p>
            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="mb-2 font-semibold">Demo Data Notice</h4>
              <p className="text-sm text-muted-foreground">
                The current implementation uses synthetic data to demonstrate system capabilities. In a
                production environment, this would be connected to real incident reporting systems, law
                enforcement databases, and emergency services records.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Risk Score Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {aboutInfo?.riskCalculationMethod ||
                'Risk scores are calculated based on the number and severity of incidents in each locality.'}
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="mb-1 font-semibold">Risk Levels</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-risk-low" />
                    <span>
                      <strong>Low Risk (0-30):</strong> Minimal incidents, safe locality
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-risk-medium" />
                    <span>
                      <strong>Medium Risk (31-70):</strong> Moderate incident frequency
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-risk-high" />
                    <span>
                      <strong>High Risk (71-100):</strong> Elevated incident levels, requires attention
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-1 font-semibold">Factors Considered</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Total number of incidents in the locality</li>
                  <li>Severity levels of reported incidents</li>
                  <li>Temporal patterns and peak incident times</li>
                  <li>Types of incidents (theft, assault, vandalism, etc.)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Statement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy & Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {aboutInfo?.privacyStatement ||
                'No personal data is collected or stored by this application.'}
            </p>
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold">Our Commitment</h4>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>No personally identifiable information (PII) is collected</li>
                <li>All data is aggregated and anonymized</li>
                <li>No tracking cookies or third-party analytics</li>
                <li>Data is used solely for public safety analysis</li>
                <li>Compliant with data protection regulations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <h4 className="font-semibold">Interactive Map</h4>
                <p className="text-sm text-muted-foreground">
                  Visual heatmap with color-coded risk levels and detailed locality information
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Real-time Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Immediate notifications for high-risk incidents and emerging threats
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Analytics Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive charts showing trends, patterns, and incident distributions
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Search & Filter</h4>
                <p className="text-sm text-muted-foreground">
                  Quick locality search and customizable alert filtering options
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
