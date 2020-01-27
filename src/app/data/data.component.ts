import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs'
import { Plot } from '../map/plots/plot.model'
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
    {columnDef: 'primaryKey', header: "PrimaryKey", cell:(plot:Plot)=>`${plot.primaryKey}`},
    {columnDef: 'speciesState', header: "SpeciesState", cell:(plot:Plot)=>`${plot.speciesState}`},
    {columnDef: 'plotId', header: "PlotID", cell:(plot:Plot)=>`${plot.plotId}`},
    {columnDef: 'plotKey', header: "PlotKey", cell:(plot:Plot)=>`${plot.plotKey}`},
    {columnDef: 'dbKey', header: "DBKey", cell:(plot:Plot)=>`${plot.dbKey}`},
    {columnDef: 'ecologicalSiteId', header: "EcologicalSiteID", cell:(plot:Plot)=>`${plot.ecologicalSiteId}`},
    {columnDef: 'latitudeNad83', header: "LatitudeNad83", cell:(plot:Plot)=>`${plot.latitudeNad83}`},
    {columnDef: 'longitudeNad83', header: "LongitudeNad83", cell:(plot:Plot)=>`${plot.longitudeNad83}`},
    {columnDef: 'state', header: "State", cell:(plot:Plot)=>`${plot.state}`},
    {columnDef: 'county', header: "County", cell:(plot:Plot)=>`${plot.county}`},
    {columnDef: 'dateEstablished', header: "DateEstablished", cell:(plot:Plot)=>`${plot.dateEstablished}`},
    {columnDef: 'projectName', header: "ProjectName", cell:(plot:Plot)=>`${plot.projectName}`},
    {columnDef: 'source', header: "Source", cell:(plot:Plot)=>`${plot.source}`},
    {columnDef: 'locationType', header: "LocationType", cell:(plot:Plot)=>`${plot.locationType}`},
    {columnDef: 'dateVisited', header: "DateVisited", cell:(plot:Plot)=>`${plot.dateVisited}`},
    {columnDef: 'elevation', header: "Elevation", cell:(plot:Plot)=>`${plot.elevation}`},
    {columnDef: 'percentCoveredByEcoSite', header: "percentCoveredByEcoSite", cell:(plot:Plot)=>`${plot.percentCoveredByEcoSite}`},
    {columnDef: 'dateLoadedInDb', header: "dateLoadedInDb", cell:(plot:Plot)=>`${plot.dateLoadedInDb}`}

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

