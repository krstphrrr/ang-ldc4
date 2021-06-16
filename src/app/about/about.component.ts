import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {content} from '../../assets/content'
import { ActivatedRoute, Router } from '@angular/router';

import { UtilitiesService } from '../services/utilities.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  // @Input() isAbout:string='about';
  subscription:Subscription;
  public content = content.content;
  public rtr!:Router;
  mainLink:SafeHtml;


  constructor(
    
    public util: UtilitiesService,
    private sanitizer:DomSanitizer,
    private route:ActivatedRoute,
    private router: Router
  ) {
    this.rtr = router
      this.mainLink = this.sanitizer.bypassSecurityTrustHtml(content.content.about.main.link)
    this.subscription = util.option$.subscribe(
      abt => {
        // console.log(abt)
        // this.isAbout = abt
      }
    )
   }

  ngOnInit(){
    // console.log(this.isAbout)

  }
  displayAbout(){

  }

}
