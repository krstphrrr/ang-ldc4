import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs'
import { Plot } from '../map/models/plot.model'
import { PlotsService} from '../map/plots/plots.service'
import { PageEvent } from '@angular/material'

import { of } from 'rxjs';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit, OnDestroy {
  isLoading;
  totalPlots =1
  plotsPerPage =2
  currentPage=1
  columns = [
    {columnDef: 'primaryKey', header: "PrimaryKey", cell:(plot:Plot)=>`${plot.PrimaryKey}`},
    {columnDef: 'speciesState', header: "SpeciesState", cell:(plot:Plot)=>`${plot.SpeciesState}`},
    {columnDef: 'plotId', header: "PlotID", cell:(plot:Plot)=>`${plot.PlotID}`},
    {columnDef: 'plotKey', header: "PlotKey", cell:(plot:Plot)=>`${plot.PlotKey}`},
    {columnDef: 'dbKey', header: "DBKey", cell:(plot:Plot)=>`${plot.DBKey}`},
    {columnDef: 'ecologicalSiteId', header: "EcologicalSiteID", cell:(plot:Plot)=>`${plot.EcologicalSiteId}`},
    {columnDef: 'latitudeNad83', header: "LatitudeNad83", cell:(plot:Plot)=>`${plot.Latitude_NAD83}`},
    {columnDef: 'longitudeNad83', header: "LongitudeNad83", cell:(plot:Plot)=>`${plot.Longitude_NAD83}`},
    {columnDef: 'state', header: "State", cell:(plot:Plot)=>`${plot.State}`},
    {columnDef: 'county', header: "County", cell:(plot:Plot)=>`${plot.County}`},
    {columnDef: 'dateEstablished', header: "DateEstablished", cell:(plot:Plot)=>`${plot.DateEstablished}`},
    {columnDef: 'projectName', header: "ProjectName", cell:(plot:Plot)=>`${plot.ProjectName}`},
    {columnDef: 'source', header: "Source", cell:(plot:Plot)=>`${plot.source}`},
    {columnDef: 'locationType', header: "LocationType", cell:(plot:Plot)=>`${plot.LocationType}`},
    {columnDef: 'dateVisited', header: "DateVisited", cell:(plot:Plot)=>`${plot.DateVisited}`},
    {columnDef: 'elevation', header: "Elevation", cell:(plot:Plot)=>`${plot.Elevation}`},
    {columnDef: 'percentCoveredByEcoSite', header: "percentCoveredByEcoSite", cell:(plot:Plot)=>`${plot.PercentCoveredByEcoSite}`},
    {columnDef: 'dateLoadedInDb', header: "dateLoadedInDb", cell:(plot:Plot)=>`${plot.DateLoadedInDb}`}

  ]
  displayedColumns = this.columns.map(c => c.columnDef)
  
  
  plots:Plot[]=[]
  private plotsSub: Subscription


  constructor(public plotsService: PlotsService) { }

  onChangePage(pageData: PageEvent){
    this.isLoading = true
    this.currentPage = pageData.pageIndex +1 
    this.plotsPerPage = pageData.pageSize
    this.plotsService.getPlots(this.plotsPerPage,this.currentPage)

  }

  ngOnInit() {
    this.plotsService.getPlots(this.plotsPerPage,this.currentPage)
    this.plotsSub = this.plotsService.getPlotUpdate()
      .subscribe((plotsData:{plots:Plot[],plotCount:number})=>{
        this.isLoading = false
        this.plots = plotsData.plots
        this.totalPlots = plotsData.plotCount
      })
  }
  dataSource = this.plots
  ngOnDestroy(){
    this.plotsSub.unsubscribe()
  }

}
// const data: Plot[] = [
//   {"primaryKey":"2016665203903B2","speciesState":"CA","plotId":null,"plotKey":null,"dbKey":"2016","ecologicalSiteId":"XE","latitudeNad83":33.673975,"longitudeNad83":-115.4359983,"state":"CA","county":"Riverside","dateEstablished":null,"projectName":null,"source":"LMF","locationType":"Field","dateVisited":new Date("2016-08-23"),"elevation":503.5296,"percentCoveredByEcoSite":100,"dateLoadedInDb":new Date("2020-01-09")}
// ]

// export class ExampleDataSource {


//   connect(): Observable<Plot[]> {
//     return of(data)
//   }
//   disconnect(){}
// }

