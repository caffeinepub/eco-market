import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LocalitySearchResult {
    latitude: number;
    name: string;
    longitude: number;
    riskLevel: string;
}
export type Time = bigint;
export interface LocalityRisk {
    latitude: number;
    commonIncidentType: string;
    name: string;
    peakIncidentTime: bigint;
    longitude: number;
    incidentCount: bigint;
    riskLevel: string;
    riskScore: bigint;
}
export interface Alert {
    id: bigint;
    time: Time;
    description: string;
    severity: bigint;
    location: string;
}
export interface Incident {
    id: bigint;
    latitude: number;
    description: string;
    longitude: number;
    timestamp: Time;
    severity: bigint;
    locality: string;
    incidentType: string;
}
export interface backendInterface {
    addAlert(location: string, description: string, severity: bigint): Promise<bigint>;
    addIncident(locality: string, latitude: number, longitude: number, incidentType: string, severity: bigint, description: string): Promise<bigint>;
    clearAllData(): Promise<void>;
    getAboutInfo(): Promise<{
        privacyStatement: string;
        dataSource: string;
        riskCalculationMethod: string;
    }>;
    getAlertsBySeverity(severity: bigint): Promise<Array<Alert>>;
    getAllAlerts(): Promise<Array<Alert>>;
    getAllLocalities(): Promise<Array<string>>;
    getAllLocalityRisks(): Promise<Array<LocalityRisk>>;
    getIncident(arg0: bigint): Promise<Incident>;
    getIncidentTrends(arg0: string): Promise<Array<[string, bigint]>>;
    getIncidentTypeDistribution(): Promise<Array<[string, bigint]>>;
    getIncidents(): Promise<Array<Incident>>;
    getIncidentsByLocality(locality: string): Promise<Array<Incident>>;
    getLocalityCoordinates(locality: string): Promise<[number, number] | null>;
    getLocalityRisk(locality: string): Promise<LocalityRisk>;
    getLocalitySearchResults(searchText: string): Promise<Array<LocalitySearchResult>>;
    getNearbyLocalities(latitude: number, longitude: number, radius: number): Promise<Array<LocalityRisk>>;
    getPeakIncidentHours(arg0: string): Promise<Array<[bigint, bigint]>>;
    initializeSampleData(): Promise<void>;
    mapLegend(): Promise<Array<[string, string]>>;
    searchLocality(locality: string): Promise<LocalityRisk | null>;
}
