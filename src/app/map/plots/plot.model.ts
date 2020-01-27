export interface Plot {
		primaryKey: string,
		speciesState: string,
		plotId:string,
		plotKey: string,
		dbKey:string,
		ecologicalSiteId:string,
		latitudeNad83: number,
		longitudeNad83: number,
		state:string,
		county: string,
		dateEstablished:Date,
		projectName:string,
		source:string,
		locationType:string,
		dateVisited: Date,
		elevation:number,
		percentCoveredByEcoSite: number,
		dateLoadedInDb:Date
}