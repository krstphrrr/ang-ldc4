export class Estdata {
    species:string;
    PrimaryKey:String;
    PlotID:string;
    AH_SpeciesCover:number;
    AH_SpeciesCover_n:number;
    GrowthHabit:string;
    GrowthHabitSub:string;
    Duration:string;
    Noxious:string;
    SG_Group:string;
    DBKey:string;
    constructor(species,PrimaryKey,PlotID,AH_SpeciesCover,AH_SpeciesCover_n,GrowthHabit,GrowthHabitSub,Duration,Noxious,SG_Group,DBKey){
        this.species=species;
        this.PrimaryKey=PrimaryKey;
        this.PlotID=PlotID;
        this.AH_SpeciesCover=AH_SpeciesCover;
        this.AH_SpeciesCover_n=AH_SpeciesCover_n;
        this.GrowthHabit=GrowthHabit;
        this.GrowthHabitSub=GrowthHabitSub;
        this.Duration=Duration;
        this.Noxious=Noxious;
        this.SG_Group=SG_Group;
        this.DBKey=DBKey;

    }
}
