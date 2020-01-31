export interface geoSpecies {
  ogc_fid : number;
  AH_SpeciesCover : number ;
  AH_SpeciesCover_n : number ;
  DBKey : string ;
  Duration : string ;
  GlobalID : string ;
  GrowthHabit : string ;
  GrowthHabitSub : string ;
  Hgt_Species_Avg : number ;
  Hgt_Species_Avg_n : number ;
  latitude_nad83 : number ;
  Longitude_NAD83 : number ;
  Noxious : string ;
  PlotID : string ;
  PrimaryKey : string ;
  SG_Group : string ;
  Species : string ;
  SpeciesState : string ;
  created_date : Date ;
  created_user : string ;
  last_edited_date : Date ;
  last_edited_user : string ;
  wkb_geometry : any ;
  DateLoadedInDb : Date ;
  Public : boolean ;
}