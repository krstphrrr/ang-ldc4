export interface Plot {
	PrimaryKey : string;
	SpeciesState : string ;
	PlotID : string ;
	PlotKey : string ;
	DBKey : string ;
	EcologicalSiteId : string ;
	Latitude_NAD83 : number ;
	Longitude_NAD83 : number ;
	State : string ;
	County : string ;
	DateEstablished : Date ;
	ProjectName : string ;
	source : string ;
	LocationType : string ;
	DateVisited : Date ;
	Elevation : number ;
	PercentCoveredByEcoSite : number ;
	DateLoadedInDb : Date ;

}