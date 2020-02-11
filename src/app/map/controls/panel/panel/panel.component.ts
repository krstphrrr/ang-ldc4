import { Component, OnInit, Output, EventEmitter, Input, Renderer2 } from '@angular/core';

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
  changeText:boolean;


  @Output() addMark: EventEmitter<string> = new EventEmitter<string>()
  @Output() pullDB: EventEmitter<string> = new EventEmitter<string>()
  // public public:boolean=true;
  @Input() childMessage:boolean

  constructor(
    private router:Router,
    private markService: MarkerService,
    private ren: Renderer2
    ) {
      this.changeText = false
     }

  // isPublic(){
  //   if
  // }

  onLoadLink(){
    //complex calculation
    this.router.navigate(['../'])
 }

  onClick():void{
    console.log('panel points signal')
    if(this.childMessage===true){
      this.addMark.emit()
      this.childMessage=false
    } else {
      this.addMark.emit()
      this.childMessage=true
    }

    
  }
}
