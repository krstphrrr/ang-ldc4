import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import {content} from '../../../assets/content'


@Component({
  selector: 'app-development',
  templateUrl: './development.component.html',
  styleUrls: ['./development.component.css']
})
export class DevelopmentComponent implements OnInit {
  public content = content.content

  public mainLink!:[SafeHtml];

  constructor(private sanitizer:DomSanitizer) {
    
    
   }

  ngOnInit(): void {
  }

}