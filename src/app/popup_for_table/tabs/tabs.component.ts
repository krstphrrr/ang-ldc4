import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { StringService } from 'src/app/services/string.service';
import { TabledataService } from 'src/app/services/tabledata.service';
import * as JSZip from 'jszip';
import {saveAs} from 'file-saver/dist/FileSaver'
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
  tabs = []
  selected = new FormControl(0)
  // table data for each table in tab
  public tabledataSubscription:Subscription
  public unsubscribeSubscription:Subscription
  public extract
  myObj = {}
  csvPack:csvPacks = {}

  //table popu
  tableCols = []
  tableData:any= []
  dataSupplier:Subscription
  subscription:Subscription;
  tableTrimmerSubscription:Subscription
  csvFillerSubscription:Subscription
  loading$:Observable<boolean> = this.apiservice.loading$
  public disabledButton = false
  arrayForButton

  constructor(
    private tabledata:TabledataService,
    private str: StringService,
    private apiservice: ApiService,
    private changeDetector: ChangeDetectorRef
  ) {
    
    this.tableTrimmerSubscription = this.str.publicTables.subscribe((res:Res)=>{
      this.tabs = res.tables
      this.trimTableData()

    })

    this.csvFillerSubscription = this.str.fullData.subscribe(dat=>{
      this.arrayForButton = 0
      if(dat){
        this.arrayForButton = Object.keys(dat).length
        this.disabledButton = this.arrayForButton>0
        this.changeDetector.detectChanges()
        for(let [val,index] of Object.entries(dat)){
          if(!Object.keys(this.myObj).includes(val)){
            this.myObj[val] = dat[val]
          }
        }
        this.changeDetector.detectChanges()
      }
    })

    this.subscription = this.str.retrieveContent().subscribe(dropDownChoice=>{
      this.tableData = []
      this.tableCols = []
    if(dropDownChoice){
      // console.log("you chose something")
      this.dataSupplier = this.apiservice.getData(dropDownChoice.data).subscribe(res=>{
        
        if(Object.keys(res).length!==0){
          // console.log(res)
            this.tableCols = res['cols']
            this.tableData = res['data']
            // this.subscription.unsubscribe()
            
          } else {
            this.tableCols = []
            this.tableData = []
          }
      })
    }
  })
   }
  ngAfterViewChecked(): void {
    this.arrayForButton = 0
    this.disabledButton = this.arrayForButton>0
    this.changeDetector.detectChanges()
    
  }
  ngOnDestroy(): void {
    this.dataSupplier.unsubscribe()
    this.tableTrimmerSubscription.unsubscribe()
    this.csvFillerSubscription.unsubscribe()
    this.subscription.unsubscribe()
    // throw new Error('Method not implemented.');
  }
   addTab(tabname){
     this.tabs.push(tabname)
    //  if (selectAfterAdding){
    //    this.selected.setValue(this.tabs.length-1)
    //  }
   }
   removeTab(index){
     this.tabs.splice(index,1)
   }

  ngOnInit(): void {
    
  }


  trimTableData(){
    // place on the tables subscription
    // iterates over fullData object entries, 
    // if the entries do not match the tables array, 
    // trim the object to match it.
    if(this.tabs){
      for(let k of Object.keys(this.myObj)){
        if(!this.tabs.includes(k)){
          delete this.myObj[k]
        }
      }
    }
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
    zip.generateAsync({type:'blob'}).then((content)=>{
      if(content){
        saveAs(content,zipName)
      }
    })
  }
 
  

}
