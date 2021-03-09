import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { StringService } from 'src/app/services/string.service';
import { TabledataService } from 'src/app/services/tabledata.service';
import * as JSZip from 'jszip';
import {saveAs} from 'file-saver/dist/FileSaver'
import { retryWhen } from 'rxjs/operators';
import { P } from '@angular/cdk/keycodes';
import * as convert from 'xml-js'
import {UtilitiesService} from 'src/app/services/utilities.service' 
// import * as data from '../assets/xml_desc.json'

interface Res{
  tables:[]
}
interface csvPacks{
  blobName?:string,
  blobData?:Blob
}


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit, OnDestroy, AfterViewChecked {
  zipFile: JSZip = new JSZip();
  // tabs: dynamic creation and destruction of tabs
  @Input('ahsi') random:string
  tabs = new Set()
  selected = new FormControl(0)
  // table data for each table in tab
  public tabledataSubscription:Subscription
  public unsubscribeSubscription:Subscription
  public xmlSubscription:Subscription
  public extract
  myObj = {}
  xmlObj
  csvPack:csvPacks = {}

  //table popu
  tableCols = []
  tableData:any= []
  dataSupplier:Subscription
  subscription:Subscription;
  tableTrimmerSubscription:Subscription
  csvFillerSubscription:Subscription
  // loading$:boolean = true
  public disabledButton = false
  arrayForButton

  constructor(
    private tabledata:TabledataService,
    private str: StringService,
    private apiservice: ApiService,
    private util: UtilitiesService,
    // private changeDetector: ChangeDetectorRef
  ) {
    
    // subscription pays attention to tablelist and updates the currently displayed
    // tabs
    this.xmlSubscription = this.apiservice.xmlData$.subscribe(json=>{

      // once schemaTable is updated, will pull field data from there 
      // and use this.util.xmlCreate
      let options = {compact:true, spaces:4}
      let preXml = JSON.stringify(json)
      console.log(preXml)
      let result = convert.json2xml(preXml, options)
      this.xmlObj = result
      // console.log(this.xmlObj)
      console.log(result)
    })
    // currently: just exchanges one array for the other
    this.tableTrimmerSubscription = this.str.publicTables.subscribe((res:Res)=>{
      // console.log(this.tabs)
      // console.log(res['tables'][res.tables.length-1])
      // this.tabs = res.tables
      let preArray:any[] = Array.from(this.tabs)
      let incoming:any[] = res.tables
      switch(true){
        // if new selected options, add to set
        case (preArray.length<incoming.length):
          incoming.forEach(i=>{
            if(!preArray.includes(i)){
              this.tabs.add(i)
            }
          })
          break
        // if removing options, remove from set
        case (preArray.length>incoming.length):
          // this.tabs.pop()
          preArray.forEach(i=>{
            if(!incoming.includes(i)){
              // console.log(i)
              
              this.tabs.delete(i)
            }
          })
          break
        // handling alternate scenario
        case (preArray.length==incoming.length):
          console.log("test equivalence")
          break
      }
      // trimming data for csv 
      this.trimTableData()

    })

    this.csvFillerSubscription = this.str.fullData.subscribe(dat=>{
      
      this.arrayForButton = 0
      if(dat){
        // this.arrayForButton = Object.keys(dat).length
        // this.disabledButton = this.arrayForButton>0
        // this.changeDetector.detectChanges()
        for(let [val,index] of Object.entries(dat)){
          if(!Object.keys(this.myObj).includes(val)){
            this.myObj[val] = dat[val]
          }
        }
        // this.changeDetector.detectChanges()
      }
    })

    this.subscription = this.str.retrieveContent().subscribe(dropDownChoice=>{
      
      //once we get a choice from the dropdown, create data packet in apiservice 
      // table component will pull from there  data packet is assembled 
      // (table will not load without assembled data packet)
      this.tableData = []
      this.tableCols = []
      console.log(dropDownChoice)
    if(dropDownChoice){
      if(dropDownChoice.data!==undefined){
        this.dataSupplier = this.apiservice.getData(dropDownChoice.data).subscribe(res=>{
          
        
          if(Object.keys(res).length!==0){
            console.log(res)
              this.tableCols = res[`${dropDownChoice.data}`]['cols']
              this.tableData = res[`${dropDownChoice.data}`]['data']
              this.apiservice.trimData(this.tabs)
              // this.subscription.unsubscribe()
              
            } else {
              this.tableCols = []
              this.tableData = []
            }
            
        })
      } else {
        console.log("table selection cleared")
      }
      
    }
  })
   }
  ngAfterViewChecked(): void {
    // this.arrayForButton = 0
    // this.disabledButton = this.arrayForButton>0
    // this.changeDetector.detectChanges()
    
  }

  tableAdder(pre,newList){
    let ret
    newList.forEach(el=>{
      if(!pre.includes(el)){
        ret = el
      }
    })
    return ret
  }
  tableRemover(pre,newList){
    let ret
    pre.forEach(el=>{
      if(!newList.includes(el)){
        ret = pre.indexOf(el)
      }
    })
    return ret
  }
  ngOnDestroy(): void {
    this.dataSupplier.unsubscribe()
    this.tableTrimmerSubscription.unsubscribe()
    this.csvFillerSubscription.unsubscribe()
    this.subscription.unsubscribe()
    // throw new Error('Method not implemented.');
  }
  //  addTab(tabname){
     
  //    this.tabs.push(tabname)
  //    console.log(`"${tabname}" added!`)
  //   //  if (selectAfterAdding){
  //   //    this.selected.setValue(this.tabs.length-1)
  //   //  }
  //  }
  //  removeTab(index){
  //    this.tabs.splice(index,1)
  //  }

  ngOnInit(): void {
    
  }


  trimTableData(){
    // place on the tables subscription
    // iterates over fullData object entries, 
    // if the entries do not match the tables array, 
    // trim the object to match it.
    if(this.tabs){
      for(let k of Object.keys(this.myObj)){
        if(!Array.from(this.tabs).includes(k)){
          delete this.myObj[k]
        }
      }
    }
  }
  xmlAssembler(tables){
    // let xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
    this.xmlSubscription = this.apiservice.xmlData$.subscribe(xml =>{
      console.log(xml)
    })

  }

  testBtn(){
    this.creatingCSVs()
    this.creatingZipFile("testPack")
  }

  creatingCSVs(){
    this.csvPack = {}
    if(this.myObj){
      for(let [k,v] of Object.entries(this.myObj)){
        // console.log(v)
        // this.subscription.subscribe(download=>{
          const replacer = (key, value) => value === null ? '' : value; 
          const header = v['cols'];
          let csv = v['data'].map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
          csv.unshift(header.join(','));
          let csvArray = csv.join('\r\n');
          let blob:Blob = new Blob([csvArray], {type: 'text/csv' })
          this.csvPack[k] = blob
      }
      
    }
  }

  creatingZipFile( zipname:string){
    let zip: JSZip = new JSZip();
    let zipName = zipname+'.zip'
    for(let [blobName,csvBlob] of Object.entries(this.csvPack)){
      if(csvBlob!==null){
        zip.file(blobName+".csv",csvBlob)
      }
    }

    if(this.xmlObj!=undefined){
      zip.file("tableSchemas.xml",this.xmlObj)
    }
    zip.generateAsync({type:'blob'}).then((content)=>{
      if(content){
        saveAs(content,zipName)
      }
    })
  }
 
  

}
