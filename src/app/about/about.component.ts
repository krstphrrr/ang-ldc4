import { Component, OnInit, Input } from '@angular/core';
import { AboutSelService } from '../services/about-sel.service'
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
    public about: AboutSelService
  ) {
    this.subscription = about.option$.subscribe(
      abt => {
        console.log(abt)
        this.isAbout = abt
      }
    )
   }

  ngOnInit(){
    console.log(this.isAbout)

  }
  displayAbout(){

  }

}
