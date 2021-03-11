import { Injectable } from '@angular/core';
import {create} from 'xmlbuilder2'
// import * as data from '../assets/xml_desc.json'
// import format from 'xml-formatter'


@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  xmlCreate(table,dat){
    
    if(Object.keys(dat.default).includes(table)){
      let jsonfile = dat.default[table]
      let docu = create({version:'1.0'})
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
              .ele('update').txt(jsonfile.status.update).up()
            .up()
            .ele("spdom")
              .ele("bounding")
                .ele("westbc").up()
                .ele("eastbc").up()
                .ele("northbc").up()
                .ele("southbc").up()
              .up()
            .ele("keywords")
            return docu
    } else{
      console.log(`Table '${table}' not implemented!`)
    }    
  }
}
