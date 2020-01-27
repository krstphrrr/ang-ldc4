import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plot } from '../../../plots/plot.model'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent {
  public someString: string;
  pulledPlot: Plot[]=[]
  constructor(private router:Router) { }

  onLoadLink(){
    //complex calculation
    this.router.navigate(['../'])
 }

}
