import { Component, OnInit, Input } from '@angular/core';

import { UtilitiesService } from '../services/utilities.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  @Input() isAbout:string='about';
  subscription:Subscription;


  constructor(
    
    public util: UtilitiesService,
  ) {
    this.subscription = util.option$.subscribe(
      abt => {
        // console.log(abt)
        this.isAbout = abt
      }
    )
   }

  ngOnInit(){
    // console.log(this.isAbout)

  }
  displayAbout(){

  }

}
