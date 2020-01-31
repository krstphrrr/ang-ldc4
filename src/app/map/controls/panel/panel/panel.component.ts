import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Plot } from '../../../models/plot.model'
import { MarkerService } from '../../../marker.service'


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent {
  public someString: string;
  pulledPlot: Plot[]=[]

  @Output() addMark: EventEmitter<string> = new EventEmitter<string>()
  @Output() pullDB: EventEmitter<string> = new EventEmitter<string>()

  constructor(
    private router:Router,
    private markService: MarkerService
    ) { }

  onLoadLink(){
    //complex calculation
    this.router.navigate(['../'])
 }

  onClick():void{
    console.log('panel points signal')
    this.addMark.emit()
  }

  onClick2():void{
    // this.markService.onFetchPoints()
  }

}
