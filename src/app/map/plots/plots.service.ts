import {Plot} from '../plots/plot.model'
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import {HttpClient} from '@angular/common/http'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class PlotsService {
  private plots: Plot[] =[]
  private plotsUpdated = new Subject<{plots: Plot[], plotCount: number}>()

  constructor(private http: HttpClient){}

  getPlots(plotsPerPage:number,currentPage:number){
    const queryParams = `?pageSize=${plotsPerPage}&page=${currentPage}`
    this.http.get<{plts:Plot[], maxPlots: number}>(
      'http://localhost:5000/api/plots'+queryParams
      )
      .pipe(
        map(postData => {

        return {
          prePlots: postData.plts,
          maxPlots: postData.maxPlots
        }
      }))
      .subscribe(sepData=>{
      this.plots = sepData.prePlots
      this.plotsUpdated.next({
        plots: [...this.plots], 
        plotCount: sepData.maxPlots})
    })
  }

  getPlotUpdate(){
    return this.plotsUpdated.asObservable()
  }

}