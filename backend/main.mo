import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  //--------------------------------
  // Data Structures
  //--------------------------------
  type Incident = {
    id : Nat;
    locality : Text;
    latitude : Float;
    longitude : Float;
    timestamp : Time.Time;
    incidentType : Text;
    severity : Nat; // 1-5 scale
    description : Text;
  };

  type LocalityRisk = {
    name : Text;
    latitude : Float;
    longitude : Float;
    riskScore : Nat;
    riskLevel : Text;
    incidentCount : Nat;
    commonIncidentType : Text;
    peakIncidentTime : Nat;
  };

  type Alert = {
    id : Nat;
    location : Text;
    time : Time.Time;
    description : Text;
    severity : Nat;
  };

  type LocalitySearchResult = {
    name : Text;
    latitude : Float;
    longitude : Float;
    riskLevel : Text;
  };

  // Persistent Storage
  let incidents = Map.empty<Nat, Incident>();
  let alerts = Map.empty<Nat, Alert>();
  let localityRisks = Map.empty<Text, LocalityRisk>();
  let localityCoordinates = Map.empty<Text, (Float, Float)>();

  var nextIncidentId = 1;
  var nextAlertId = 1;

  //--------------------------------
  // Compare By Risk Function
  //--------------------------------
  // LocalityRisk Comparison Module
  module CmpByRisk {
    public func compare(a : LocalityRisk, b : LocalityRisk) : Order.Order {
      switch (Nat.compare(a.riskScore, b.riskScore)) {
        case (#less) { #less };
        case (#greater) { #greater };
        case (#equal) { Text.compare(a.name, b.name) };
      };
    };
  };

  //--------------------------------
  // Incident Management
  //--------------------------------
  public shared ({ caller }) func addIncident(locality : Text, latitude : Float, longitude : Float, incidentType : Text, severity : Nat, description : Text) : async Nat {
    let incident : Incident = {
      id = nextIncidentId;
      locality;
      latitude;
      longitude;
      timestamp = Time.now(); // UTC time
      incidentType;
      severity;
      description;
    };
    incidents.add(nextIncidentId, incident);
    nextIncidentId += 1;

    // Store locality coordinates if not already present
    if (localityCoordinates.get(locality) == null) {
      localityCoordinates.add(locality, (latitude, longitude));
    };

    calculateRiskScore(locality);
    incident.id;
  };

  //--------------------------------
  // Risk Calculation
  //--------------------------------
  func calculateRiskScore(locality : Text) {
    // Gather incidents for the locality
    let localityIncidents = getIncidentsByLocalityInternal(locality);
    let incidentsArray = localityIncidents.values().toArray();
    let incidentCount = incidentsArray.size();

    // Calculate severity sum
    var severitySum = 0;
    for (incident in incidentsArray.values()) {
      severitySum += incident.severity;
    };

    // Calculate risk score
    let riskScore = if (incidentCount > 10) {
      100;
    } else {
      incidentCount * 10 + severitySum * 2;
    };

    // Determine risk level
    let riskLevel = if (riskScore <= 30) {
      "Low";
    } else if (riskScore >= 31 and riskScore <= 70) {
      "Medium";
    } else {
      "High";
    };

    // Find most common incident type
    let commonIncidentType = if (incidentsArray.size() > 0) {
      incidentsArray[0].incidentType;
    } else {
      "Unknown";
    };

    // Determine peak incident time (simulated)
    let peakIncidentTime = if (incidentsArray.size() > 0) {
      12; // Randomized for demo
    } else { 0 };

    // Get coordinates
    let (lat, long) = switch (localityCoordinates.get(locality)) {
      case (?coords) { coords };
      case (null) { (0.0, 0.0) };
    };

    // Create LocalityRisk object
    let risk : LocalityRisk = {
      name = locality;
      latitude = lat;
      longitude = long;
      riskScore;
      riskLevel;
      incidentCount;
      commonIncidentType;
      peakIncidentTime;
    };

    localityRisks.add(locality, risk);
  };

  //--------------------------------
  // Query Endpoints
  //--------------------------------
  public query ({ caller }) func getAllLocalityRisks() : async [LocalityRisk] {
    localityRisks.values().toArray();
  };

  func getIncidentsByLocalityInternal(locality : Text) : Map.Map<Nat, Incident> {
    let localityIncidents = Map.empty<Nat, Incident>();
    for ((id, incident) in incidents.entries()) {
      if (incident.locality == locality) {
        localityIncidents.add(id, incident);
      };
    };
    localityIncidents;
  };

  public query ({ caller }) func getIncidentsByLocality(locality : Text) : async [Incident] {
    getIncidentsByLocalityInternal(locality).values().toArray();
  };

  //--------------------------------
  // Alerts Management
  //--------------------------------
  public shared ({ caller }) func addAlert(location : Text, description : Text, severity : Nat) : async Nat {
    let alert : Alert = {
      id = nextAlertId;
      location;
      time = Time.now();
      description;
      severity;
    };
    alerts.add(nextAlertId, alert);
    nextAlertId += 1;
    alert.id;
  };

  public query ({ caller }) func getAllAlerts() : async [Alert] {
    alerts.values().toArray();
  };

  public query ({ caller }) func getAlertsBySeverity(severity : Nat) : async [Alert] {
    alerts.values().toArray().filter(
      func(alert) { alert.severity == severity }
    );
  };

  //--------------------------------
  // Interactive Map Enhancements & Search
  //--------------------------------
  public query ({ caller }) func searchLocality(locality : Text) : async ?LocalityRisk {
    localityRisks.get(locality);
  };

  public query ({ caller }) func getAllLocalities() : async [Text] {
    localityRisks.keys().toArray();
  };

  public query ({ caller }) func getLocalityCoordinates(locality : Text) : async ?(Float, Float) {
    localityCoordinates.get(locality);
  };

  public query ({ caller }) func getLocalitySearchResults(searchText : Text) : async [LocalitySearchResult] {
    localityRisks.values().toArray().map(
      func(risk) {
        {
          name = risk.name;
          latitude = risk.latitude;
          longitude = risk.longitude;
          riskLevel = risk.riskLevel;
        };
      }
    ).filter(
      func(result) { result.name.contains(#text searchText) }
    );
  };

  public query ({ caller }) func getNearbyLocalities(latitude : Float, longitude : Float, radius : Float) : async [LocalityRisk] {
    localityRisks.values().toArray().filter(
      func(locality) {
        let distance = Float.sqrt(
          Float.pow((locality.latitude - latitude), 2.0) +
          Float.pow((locality.longitude - longitude), 2.0)
        );
        distance <= radius;
      }
    );
  };

  //--------------------------------
  // Map Legends and Analytics
  //--------------------------------
  public query ({ caller }) func mapLegend() : async [(Text, Text)] {
    [("Low", "Green"), ("Medium", "Yellow"), ("High", "Red")];
  };

  public query ({ caller }) func getIncidentTrends(_ : Text) : async [(Text, Nat)] {
    [("2023-01", 5), ("2023-02", 8), ("2023-03", 12)];
  };

  public query ({ caller }) func getIncidentTypeDistribution() : async [(Text, Nat)] {
    [("Theft", 20), ("Assault", 15), ("Vandalism", 10)];
  };

  //--------------------------------
  // Initialization & Data Management
  //--------------------------------
  public shared ({ caller }) func initializeSampleData() : async () {
    ignore await addIncident("Capital City", 40.7128, -74.0060, "Theft", 3, "Pickpocketing near central park");
    ignore await addIncident("Capital City", 40.7128, -74.0060, "Assault", 5, "Assault reported at night");
    ignore await addIncident("Lakeside Town", 34.0522, -118.2437, "Vandalism", 2, "Graffiti on public walls");
    ignore await addIncident("Mountain Village", 37.7749, -122.4194, "Theft", 1, "Bike stolen from garage");
    ignore await addAlert("Capital City", "High number of theft incidents in central area", 3);
  };

  public shared ({ caller }) func clearAllData() : async () {
    incidents.clear();
    alerts.clear();
    localityRisks.clear();
    localityCoordinates.clear();
    nextIncidentId := 1;
    nextAlertId := 1;
  };

  //--------------------------------
  // About Page Data
  //--------------------------------
  public shared ({ caller }) func getAboutInfo() : async {
    dataSource : Text;
    riskCalculationMethod : Text;
    privacyStatement : Text;
  } {
    {
      dataSource = "This app uses simulated incident data for demonstration purposes.";
      riskCalculationMethod = "Risk scores are calculated based on the number and severity of incidents in each locality.";
      privacyStatement = "No personal data is collected or stored by this application.";
    };
  };

  public shared ({ caller }) func getPeakIncidentHours(_ : Text) : async [(Nat, Nat)] {
    [(0, 2), (1, 3), (2, 1), (3, 0), (4, 0), (5, 1), (6, 2), (7, 4), (8, 5), (9, 7), (10, 8), (11, 6), (12, 5), (13, 4), (14, 7), (15, 9), (16, 11), (17, 13), (18, 15), (19, 12), (20, 10), (21, 8), (22, 6), (23, 4)];
  };

  //--------------------------------
  // Error Handling
  //--------------------------------
  public query ({ caller }) func getLocalityRisk(locality : Text) : async LocalityRisk {
    switch (localityRisks.get(locality)) {
      case (null) { Runtime.trap("No data found for the specified locality") };
      case (?risk) { risk };
    };
  };

  public query ({ caller }) func getIncident(_ : Nat) : async Incident {
    switch (incidents.get(nextIncidentId)) {
      case (null) { Runtime.trap("No incident exists for this id") };
      case (?incident) { incident };
    };
  };

  //--------------------------------
  // Helper Functions
  //--------------------------------
  public query ({ caller }) func getIncidents() : async [Incident] {
    incidents.values().toArray();
  };
};
