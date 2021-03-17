import { variable } from '@angular/compiler/src/output/output_ast';
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

  xmlAssembler(table, json, coljson){
    console.log(table,json)
    let setup = this.setupXML(table,json)
    console.log(setup)
    let variablePart = this.variableXML(setup,table,json)
    console.log(variablePart)
    let dataqual = this.dataqualXML(variablePart, table, json)
    console.log(dataqual)
    let spdoinfo = this.spdoinfoXML(dataqual, table, json)
    console.log(spdoinfo)
    let spref = this.sprefXML(spdoinfo,table, json)
    console.log({"cosa1":spref, "cosa2":table, "cosa3":coljson, "cosa4":json})
    let colset = this.columnsXML(spref,table,coljson,json)

    let distinfo = this.distinfoXML(colset,table,json)
    let metainfo = this.metainfoXML(distinfo, table, json)
    let finalxml = this.finishXML(metainfo)
    console.log(finalxml)
    return finalxml
  }
  setupXML(table,dat){
    let jsonfile = dat.default[table]
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
    if(Object.keys(full.idinfo).includes('keywords')){
      // inside the keywords section of the json
      let themeCount = 0
      for(let i of Object.keys(full.idinfo.keywords)){
        // creating however many 'theme' 
        xmlRoot.ele("theme")
          if(Object.keys(full.idinfo.keywords[i]).includes('themekt')){
            for(let j of Object.keys(full.idinfo.keywords[i])){
              if(j.includes('themekt')){
                console.log(full.idinfo.keywords[i])
                xmlRoot.ele(j).txt(full.idinfo.keywords[i][j]).up()
              } else if(/[0-9]/g.test(j)){
                xmlRoot.ele(j.replace(/[0-9]/g,'')).txt(full.idinfo.keywords[i][j]).up()
              }
            }
          }
      }
    //
    xmlRoot.ele("accconst").txt(full.idinfo["accconst"]).up()
    xmlRoot.ele("useconst").txt(full.idinfo["useconst"]).up()
    xmlRoot.ele("ptcontact")
            .ele("cntinfo")
              .ele("cntperp")
                .ele("cntper").txt(full.idinfo.ptcontact.cntinfo.cntperp.cntper).up()
                .ele("cntorg").txt(full.idinfo.ptcontact.cntinfo.cntperp.cntorg).up().up()
              .ele("cntpos").txt(full.idinfo.ptcontact.cntinfo.cntpos).up()
              .ele("cntaddr")
                .ele("addrtype").txt(full.idinfo.ptcontact.cntinfo.cntaddr.addrtype).up()
                .ele("address").txt(full.idinfo.ptcontact.cntinfo.cntaddr.address).up()
                .ele("city").txt(full.idinfo.ptcontact.cntinfo.cntaddr.city).up()
                .ele("state").txt(full.idinfo.ptcontact.cntinfo.cntaddr.state).up()
                .ele("postal").txt(full.idinfo.ptcontact.cntinfo.cntaddr.postal).up()
                .ele("country").txt(full.idinfo.ptcontact.cntinfo.cntaddr.country).up().up()
    xmlRoot.ele("datacred").txt(full.idinfo.datacred)
    xmlRoot.ele("native").txt(full.idinfo.native).up().up()

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
    } else { 
      console.log("NO HAY SPREF")
    }
    return root
  }

  columnsXML(rootXml,table,columns, dat){
    let json = dat.default[table]
    
    let full = columns
    let root = rootXml.ele("eainfo")
    let det = root.ele("detailed")
      .ele("enttyp")
        .ele("enttypl").txt(json.eainfo.detailed.enttyp.enttypl).up()
        .ele("enttypd").up()
        .ele("enttypds").txt(json.eainfo.detailed.enttyp.enttypds).up()
        .up()
    
    full.forEach(element => {
      if(element["Table"]===table){
        console.log(element)
        let atr = det.ele("attr")
                      .ele("attrlabl").txt(element.Field).up()
                      .ele("attrdef").txt(element.Description).up()
                      .ele("attrdefs").txt(element["Notes/Updates"]?element["Notes/Updates"]:"").up()
                      .ele("attrdomv")
            if(element.DataType==="Date"){
              atr.ele("udom").txt("MM/DD/YYYY MM:SS").up()
            } else{
              atr.ele("rdom")
                .ele("rdommin").txt(element["Range Minimum"]?element["Range Minimum"]:"").up()
                .ele("rdommax").txt(element["Range Maximum"]?element["Range Maximum"]:"").up()
                .ele("attrunit").txt(element["Units of Measure"]?element["Units of Measure"]:"").up()
            }
      }
    });
    return root
  }

  distinfoXML(xmlRoot,table,dat){
    let jsonfile = dat.default[table]
    let root = xmlRoot.ele("distinfo")
    if(Object.keys(jsonfile).includes('distinfo')){
      root.ele("distrib")
            .ele("cntinfo")
              .ele("cntperp")
                .ele("cntper").txt(jsonfile.distinfo.distrib.cntinfo.cntperp.cntper).up()
                .ele("cntorg").txt(jsonfile.distinfo.distrib.cntinfo.cntperp.cntorg).up()
                .up()
              .ele("cntpos").txt(jsonfile.distinfo.distrib.cntinfo.cntpos).up()
              .ele("cntaddr")
                .ele("addrtype").txt(jsonfile.distinfo.distrib.cntinfo.cntaddr.addrtype).up()
                .ele("address").txt(jsonfile.distinfo.distrib.cntinfo.cntaddr.address).up()
                .ele("city").txt(jsonfile.distinfo.distrib.cntinfo.cntaddr.city).up()
                .ele("state").txt(jsonfile.distinfo.distrib.cntinfo.cntaddr.state).up()
                .ele("postal").txt(jsonfile.distinfo.distrib.cntinfo.cntaddr.postal).up()
                .ele("country").txt(jsonfile.distinfo.distrib.cntinfo.cntaddr.country).up()
                .up()
              .ele("cntvoice").txt(jsonfile.distinfo.distrib.cntinfo.cntvoice).up()
              .ele("cntemail").txt(jsonfile.distinfo.distrib.cntinfo.cntemail).up()
              .up()
            .up()
          // .up()
          .ele("distliab").txt(jsonfile.distinfo.distliab).up()
          .ele("storder")
            .ele("digform")
              .ele("digtinfo")
                .ele("formname").txt(jsonfile.distinfo.stdorder.digform.digtinfo.formname).up()
              .up()
              .ele("digtopt")
                .ele("onlinopt")
                  .ele("computer")
                    .ele("networka")
                      .ele("networkr").txt(jsonfile.distinfo.stdorder.digform.digtopt.onlinopt.computer.networka.networkr).up()
                    .up()
                  .up()
                .up()
              .up()
            .up()
            .ele("fees").txt(jsonfile.distinfo.stdorder.fees).up()
          .up()
    }
    return root
  }

  metainfoXML(xmlRoot,table,dat){
    let jsonfile = dat.default[table]
    let root = xmlRoot.ele("metainfo")
    // console.log(jsonfile)
    if(Object.keys(jsonfile).includes('metainfo')){
      console.log(jsonfile.metainfo)
      root.ele("metd").txt(jsonfile.metainfo.metd).up() 
      .ele("metc")
        .ele("cntinfo")
          .ele("cntperp")
            .ele("cntper").txt(jsonfile.metainfo.metc.cntinfo.cntperp.cntper).up()
            .ele("cntorg").txt(jsonfile.metainfo.metc.cntinfo.cntperp.cntorg).up()
          .up()
          .ele("cntpos").txt(jsonfile.metainfo.metc.cntinfo.cntpos).up()
          .ele("cntaddr")
            .ele("addrtype").txt(jsonfile.metainfo.metc.cntinfo.cntaddr.addrtype).up()
            .ele("address").txt(jsonfile.metainfo.metc.cntinfo.cntaddr.address).up()
            .ele("city").txt(jsonfile.metainfo.metc.cntinfo.cntaddr.city).up()
            .ele("state").txt(jsonfile.metainfo.metc.cntinfo.cntaddr.state).up()
            .ele("postal").txt(jsonfile.metainfo.metc.cntinfo.cntaddr.postal).up()
            .ele("country").txt(jsonfile.metainfo.metc.cntinfo.cntaddr.country).up()
          .up()
          .ele("cntvoice").txt(jsonfile.metainfo.metc.cntinfo.cntvoice).up()
          .ele("cntemail").txt(jsonfile.metainfo.metc.cntinfo.cntemail).up()
        .up()
      .up()
      .ele("metstdn").txt(jsonfile.metainfo.metstdn).up()
      .ele("metstdv").txt(jsonfile.metainfo.metstdv).up()
        
    }
    return root
  }


  finishXML(incXML){
    return incXML.end({pretty:true})
  }
}
