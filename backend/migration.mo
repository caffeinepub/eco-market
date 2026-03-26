import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";

module {
  type OldIncident = {
    id : Nat;
    locality : Text;
    latitude : Float;
    longitude : Float;
    timestamp : Time.Time;
    incidentType : Text;
    severity : Nat;
    description : Text;
  };

  type OldLocalityRisk = {
    name : Text;
    latitude : Float;
    longitude : Float;
    riskScore : Nat;
    riskLevel : Text;
    incidentCount : Nat;
    commonIncidentType : Text;
    peakIncidentTime : Nat;
  };

  type OldAlert = {
    id : Nat;
    location : Text;
    time : Time.Time;
    description : Text;
    severity : Nat;
  };

  type OldActor = {
    incidents : Map.Map<Nat, OldIncident>;
    alerts : Map.Map<Nat, OldAlert>;
    localityRisks : Map.Map<Text, OldLocalityRisk>;
    nextIncidentId : Nat;
    nextAlertId : Nat;
  };

  // New types
  type NewIncident = OldIncident;
  type NewLocalityRisk = OldLocalityRisk;
  type NewAlert = OldAlert;

  type NewActor = {
    incidents : Map.Map<Nat, NewIncident>;
    alerts : Map.Map<Nat, NewAlert>;
    localityRisks : Map.Map<Text, NewLocalityRisk>;
    localityCoordinates : Map.Map<Text, (Float, Float)>;
    nextIncidentId : Nat;
    nextAlertId : Nat;
  };

  // Main migration function
  public func run(old : OldActor) : NewActor {
    {
      old with
      localityCoordinates = Map.empty<Text, (Float, Float)>() // Initialize empty map for coordinates
    };
  };
};
