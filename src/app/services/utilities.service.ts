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
  setupXML(table,dat){
    let jsonfile = dat.default[table]
    console.log(jsonfile)
    let root = create({version:'1.0', encoding:'UTF-8'})
    .ele('metadata')
      .ele('idinfo')
        .ele('citation')
          .ele('citeinfo')
            .ele('origin').txt(jsonfile.idinfo.citation.citeinfo.origin).up()
            .ele('pubdate').txt(jsonfile.idinfo.citation.citeinfo.pubupdate).up()
            .ele('title').txt(jsonfile.idinfo.citation.citeinfo.title).up()
            .ele('geoform').txt(jsonfile.idinfo.citation.citeinfo.geoform).up()
            .ele('onlink').txt(jsonfile.idinfo.citation.citeinfo.onlink).up()
            .up()
          .up()
        .up()
        .ele('descript')
          .ele('abstract').txt(jsonfile.idinfo.descript.abstract).up()
          .ele('purpose').txt(jsonfile.idinfo.descript.purpose).up()
          .ele('supplinf').txt(jsonfile.idinfo.descript.supplinf).up()
          .up()
          .ele('timeperd')
            .ele('timeinfo')
              .ele('sngdate')
                .ele('caldate').txt(jsonfile.idinfo.timeperd.timeinfo.sngdate.caldate).up()
                .up()
              .up()
              .ele('current').txt(jsonfile.idinfo.current).up()
          .up()
          .ele('status')
            .ele('progress').txt(jsonfile.idinfo.status.progress).up()
            .ele('update').txt(jsonfile.idinfo.status.update).up()
          .up()
    return root
  }

  variableXML(xmlRoot, table, dat){
    // xml section of variable structure
    let full = dat.default[table]
    if(Object.keys(full).includes('keywords')){
      // inside the keywords section of the json
      let themeCount = 0
      for(let i of Object.keys(full.keywords)){
        // creating however many 'theme' 
        xmlRoot.ele("theme")
          if(Object.keys(full.idinfo.keywords[i]).includes('themekt')){
            for(let j of Object.keys(full.keywords[i])){
              if(j.includes('themekt')){
                console.log(full.keywords[i])
                xmlRoot.ele(j).txt(full.keywords[i][j]).up()
              } else if(/[0-9]/g.test(j)){
                xmlRoot.ele(j.replace(/[0-9]/g,'')).txt(full.keywords[i][j]).up()
              }
            }
          }
      }
    //
    xmlRoot.ele("accconst").txt(full["accconst"]).up()
    xmlRoot.ele("useconst").txt(full["useconst"]).up()
    xmlRoot.ele("ptcontact")
            .ele("cntinfo")
              .ele("cntperp")
                .ele("cntper").txt(full.ptcontact.cntinfo.cntperp.cntper).up()
                .ele("cntorg").txt(full.ptcontact.cntinfo.cntperp.cntorg).up().up()
              .ele("cntpos").txt(full.ptcontact.cntinfo.cntpos).up()
              .ele("cntaddr")
                .ele("addrtype").txt(full.ptcontact.cntinfo.cntaddr.addrtype).up()
                .ele("address").txt(full.ptcontact.cntinfo.cntaddr.address).up()
                .ele("city").txt(full.ptcontact.cntinfo.cntaddr.city).up()
                .ele("state").txt(full.ptcontact.cntinfo.cntaddr.state).up()
                .ele("postal").txt(full.ptcontact.cntinfo.cntaddr.postal).up()
                .ele("country").txt(full.ptcontact.cntinfo.cntaddr.country).up().up()

    } else {
      console.log('no')
    }
    // .up()
    return xmlRoot
  }

  dataqualXML(xmlRoot, table, dat){
    let jsonfile = dat.default[table]
    let root = xmlRoot.ele("dataqual")
    if(Object.keys(jsonfile).includes('dataqual')){
        root.ele("attracc")
          .ele("attraccr").txt(jsonfile.dataqual.attracc.attraccr).up()
            .ele("logic").txt(jsonfile.dataqual.attracc.logic).up()
            .ele("complete").up()
            .ele("lineage")
                .ele("procstep")
                  .ele("procdesc").up()
                  .ele("procdate").txt(jsonfile.dataqual.lineage.procstep.procdate).up()
                .up()
    }
    return root
  }

  spdoinfoXML(xmlRoot,table,dat){
    let jsonfile = dat.default[table]
    let root = xmlRoot.ele("spdoinfo")
    if(Object.keys(jsonfile).includes('spdoinfo')){
      root.ele("direct").txt(jsonfile.spdoinfo.direct).up()
      .ele("ptvctinf")
        .ele("sdtsterm")
          .ele("sdtstype").txt(jsonfile.spdoinfo.ptvctinf.sdtsterm.sdtstype).up()
          .ele("ptvctcnt").txt(jsonfile.spdoinfo.ptvctinf.sdtsterm.ptvctcnt).up()
    }
  return root
  }

  sprefXML(xmlRoot,table,dat){
    let jsonfile = dat.default[table]
    let root = xmlRoot.ele("spref")
    if(Object.keys(jsonfile).includes('spref')){
      root.ele("horizsys")
        .ele("geograph")
          .ele("latres").txt().up()
          .ele("longres").txt().up()
          .ele("geogunit").txt(jsonfile.spref.horizsys.geograph.geounit).up()
          .up()
        .ele("geodetic")
          .ele("horizdn").txt(jsonfile.spref.horizsys.geodetic.horizdn).up()
          .ele("ellips").txt(jsonfile.spref.horizsys.geodetic.ellips).up()
          .ele("semiaxis").txt(jsonfile.spref.horizsys.geodetic.semiaxis).up()
          .ele("denflat").txt(jsonfile.spref.horizsys.geodetic.denflat).up()
    }
  }
  finishXML(incXML){
    return incXML.end({pretty:true})
  }
}
