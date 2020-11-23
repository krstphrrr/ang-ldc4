export class Estdata {
    Species:string;
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
    Hgt_Species_Avg:string;
    Hgt_Species_Avg_n:string;


    constructor(Species,PrimaryKey,PlotID,AH_SpeciesCover,AH_SpeciesCover_n,GrowthHabit,GrowthHabitSub,Duration,Noxious,SG_Group,DBKey,Hgt_Species_Avg,Hgt_Species_Avg_n){
        this.Species=Species;
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
        this.Hgt_Species_Avg=Hgt_Species_Avg;
        this.Hgt_Species_Avg_n=Hgt_Species_Avg_n;

    }
}
