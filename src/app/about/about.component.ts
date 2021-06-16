import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {content} from '../../assets/content'
import { Router } from '@angular/router';

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
  public rawImg = content.content.about.main.image
  public rtr!:Router;
  public mainLink:SafeHtml;
  public aboutImg:SafeHtml;


  constructor(
    
    public util: UtilitiesService,
    private sanitizer:DomSanitizer,

    private router: Router
  ) {
    this.rtr = router
    this.mainLink = this.sanitizer.bypassSecurityTrustHtml(content.content.about.main.link)
    this.aboutImg = this.sanitizer.bypassSecurityTrustUrl(this.rawImg)
   }

  ngOnInit(){

  }
  getMainImage(){
    return this.aboutImg
  }

}
