import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {content} from '../../../assets/content'

interface Partner{
  id:string;
  title:string;
  description:SafeHtml;
}

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  public content = content.content
  public partners:Partner[];
  private partner:any
  public mainLink!:[SafeHtml];
  public addContent:SafeHtml;

  constructor(private sanitizer:DomSanitizer) {
    this.partners=[]

    content.content.about.partners.forEach(partner=>{
      this.partner={}

      this.partner['id'] = partner.id
      this.partner['title']= partner.title
      this.partner['description'] = this.sanitizer.bypassSecurityTrustHtml(partner.description)
      this.partners.push(this.partner)
      })
    this.addContent = this.sanitizer.bypassSecurityTrustHtml(this.content.about.partners_footer.text)

   }

  ngOnInit(): void {
  }

}
