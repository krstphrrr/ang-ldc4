import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {create} from 'xmlbuilder2'
// import * as data from '../assets/xml_desc.json'
// import format from 'xml-formatter'


@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  // about page
  private option = new Subject<string>()
  public option$ = this.option.asObservable()


  constructor() { }

  saveOption(str:string){
    this.option.next(str)
  }

  xmlCreate(table,dat){
    if(Object.keys(dat.default).includes(table)){
      let jsonfile = dat.default[table]
      let docu = create({version:'1.0', encoding:'UTF-8'})
      .ele('metadata')
        .ele('idinfo')
          .ele('citation')
            .ele('citeinfo')
              .ele('origin').txt(jsonfile.citeinfo.origin).up()
              .ele('pubdate').txt(jsonfile.citeinfo.pubupdate).up()
              .ele('title').txt(jsonfile.citeinfo.title).up()
              .ele('geoform').txt(jsonfile.citeinfo.geoform).up()
              .ele('onlink').txt(jsonfile.citeinfo.onlink).up()
              .up()
            .up()
          .up()
          .ele('descript')
            .ele('abstract').txt(jsonfile.descript.abstract).up()
            .ele('purpose').txt(jsonfile.descript.purpose).up()
            .ele('supplinf').txt(jsonfile.descript.supplinf).up()
            .up()
            .ele('timeperd')
              .ele('timeinfo')
                .ele('sngdate')
                  .ele('caldate').txt(jsonfile.timeperd.timeinfo.sngdate.caldate).up()
                  .up()
                .up()
                .ele('current').txt(jsonfile.timeperd.current).up()
              .up()
            .ele('status')
              .ele('progress').txt(jsonfile.status.progress).up()
              .ele('update').txt(jsonfile.status.update).up().up()
            .ele("spdom")
              .ele("bounding")
                  .ele("westbc").up()
                  .ele("eastbc").up()
                  .ele("northbc").up()
                  .ele("southbc").up()
                .up()
            .ele("keywords")
              .ele("theme")
                .ele("themekt").txt(jsonfile.keywords.theme1.themekt).up()
                .ele("themekey").txt(jsonfile.keywords.theme1.themekey1).up()
                .ele("themekey").txt(jsonfile.keywords.theme1.themekey2).up()
                .ele("themekey").txt(jsonfile.keywords.theme1.themekey3).up()
                .up()
              .ele("theme")
                .ele("themekt").txt(jsonfile.keywords.theme2.themekt).up()
                  .ele("themekey").txt(jsonfile.keywords.theme2.themekey1).up()
            // end 
            .up()
            return docu.end({ prettyPrint: true })
    } else{
      console.log(`Table '${table}' not implemented!`)
    }    
  }
}
