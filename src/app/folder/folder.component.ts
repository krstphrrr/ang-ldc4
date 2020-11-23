import { Component, OnInit, SimpleChanges,NgZone,ElementRef } from '@angular/core';
import { Chart, ChartData } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import { CustomControlService } from '../services/custom-control.service'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MapfetchService} from '../map/mapfetch.service'
import 'chartjs-chart-box-and-violin-plot';
import 'leaflet'
import 'leaflet-easybutton'
import 'leaflet-sidebar-v2'


declare var $: any;
import 'leaflet-draw'
import { count } from 'rxjs/operators';
import { json } from 'd3';
import { Estdata } from '../estdata';
import { EstGroundService } from '../services/est-ground.service';


export class folder {




  constructor(
    // public GrowthHabitSub: String,
    // public Duration: string,
    // public PrimaryKey: string,
    // public PlotID: number,
    // public AverageHeight_cm: number,
    // public StandardDeviation_cm: number

  ) {
    
  }

}


var ss=[];
var x;
@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']






})
// @HostListener('window:scroll', ['$event'])

export class FolderComponent implements OnInit {

estdata:Estdata[] = [];
Duration:any;
GrowthHabitSub:any;
p:number = 1;
public ss;
// ecoid = 'R042XB014NM';


constructor(public da:EstGroundService,private httpClient: HttpClient, private readonly ngZone: NgZone, private readonly elementRef: ElementRef
  ) {
    
}
visible_species:boolean = false
visible_ground:boolean = false
visible_veg:boolean = false




visible_canopy:boolean = false
visible_soil:boolean = false
visiblesp_1:boolean = false
visiblesp_2:boolean = false
visiblesp_3:boolean = false
visiblesp_1_1:boolean = false
visiblesp_1_2:boolean = false
visiblesp_1_3:boolean = false
visiblesp_1_4:boolean = false
visiblesp_1_1_1:boolean = false
visiblesp_1_1_2:boolean = false
visiblesp_1_1_3:boolean = false
visiblesp_1_1_4:boolean = false
visiblesp_1_1_5:boolean = false
visiblesp_1_1_6:boolean = false
visiblesp_1_1_1_i:boolean = false
visiblesp_1_1_1_s:boolean = false
visiblesp_1_1_2_i:boolean = false
visiblesp_1_1_2_s:boolean = false
visiblesp_1_1_3_i:boolean = false
visiblesp_1_1_3_s:boolean = false
visiblesp_1_1_4_i:boolean = false
visiblesp_1_1_4_s:boolean = false
visiblesp_1_1_5_i:boolean = false
visiblesp_1_1_5_s:boolean = false
visiblesp_1_1_6_i:boolean = false
visiblesp_1_1_6_s:boolean = false
visiblesp_1_2_i:boolean = false
visiblesp_1_2_s:boolean = false
visiblesp_1_3_1:boolean = false
visiblesp_1_3_2:boolean = false
visiblesp_1_3_3:boolean = false
visiblesp_1_3_4:boolean = false
visiblesp_1_3_5:boolean = false
visiblesp_1_3_6:boolean = false
visiblesp_1_3_7:boolean = false
visiblesp_1_3_8:boolean = false
visiblesp_1_3_1_i:boolean = false
visiblesp_1_3_1_s:boolean = false
visiblesp_1_3_2_i:boolean = false
visiblesp_1_3_2_s:boolean = false
visiblesp_1_3_3_i:boolean = false
visiblesp_1_3_3_s:boolean = false
visiblesp_1_3_4_i:boolean = false
visiblesp_1_3_4_s:boolean = false
visiblesp_1_3_5_i:boolean = false
visiblesp_1_3_5_s:boolean = false
visiblesp_1_3_6_i:boolean = false
visiblesp_1_3_6_s:boolean = false
visiblesp_1_3_7_i:boolean = false
visiblesp_1_3_7_s:boolean = false
visiblesp_1_3_8_i:boolean = false
visiblesp_1_3_8_s:boolean = false
visiblesp_1_4_1:boolean = false
visiblesp_1_4_2:boolean = false
visiblesp_1_4_3:boolean = false
visiblesp_1_4_1_i:boolean = false
visiblesp_1_4_1_s:boolean = false
visiblesp_1_4_2_i:boolean = false
visiblesp_1_4_2_s:boolean = false
visiblesp_1_4_3_i:boolean = false
visiblesp_1_4_3_s:boolean = false





visiblesp_2_1:boolean = false
visiblesp_2_1_1:boolean = false
visiblesp_2_1_2:boolean = false
visiblesp_2_2:boolean = false
visiblesp_2_2_1:boolean = false
visiblesp_2_2_2:boolean = false
visiblesp_2_3:boolean = false
visiblesp_2_3_1:boolean = false
visiblesp_2_3_2:boolean = false
visiblesp_2_4:boolean = false
visiblesp_2_4_1:boolean = false
visiblesp_2_4_2:boolean = false
visiblesp_2_5:boolean = false
visiblesp_2_5_1:boolean = false
visiblesp_2_5_2:boolean = false
visiblesp_2_6:boolean = false
visiblesp_2_6_1:boolean = false
visiblesp_2_6_2:boolean = false


visiblesp_3_1:boolean = false
visiblesp_3_2:boolean = false

visibleg_1:boolean = false
visibleg_1_1:boolean = false
visibleg_1_2:boolean = false
visibleg_2:boolean = false
visibleg_2_1:boolean = false
visibleg_2_2:boolean = false


visible_veg_1:boolean = false
visible_veg_2:boolean = false

visible_veg_1_1:boolean = false
visible_veg_1_2:boolean = false
visible_veg_1_3:boolean = false

visible_veg_1_2_1:boolean = false
visible_veg_1_2_2:boolean = false
visible_veg_1_2_3:boolean = false
visible_veg_1_2_4:boolean = false
visible_veg_1_2_5:boolean = false
visible_veg_1_2_6:boolean = false
visible_veg_1_2_7:boolean = false
visible_veg_1_2_8:boolean = false


visible_veg_2_1:boolean = false
visible_veg_2_1_1:boolean = false
visible_veg_2_1_2:boolean = false
visible_veg_2_2:boolean = false
visible_veg_2_2_1:boolean = false
visible_veg_2_2_2:boolean = false
visible_veg_2_3:boolean = false
visible_veg_2_3_1:boolean = false
visible_veg_2_3_2:boolean = false

 
visible_can_1:boolean = false
visible_can_1_1:boolean = false
visible_can_1_2:boolean = false
visible_can_2:boolean = false
visible_can_2_1:boolean = false
visible_can_2_2:boolean = false


visible_soil_1:boolean = false
visible_soil_1_1:boolean = false
visible_soil_1_2:boolean = false
visible_soil_2:boolean = false
visible_soil_2_1:boolean = false
visible_soil_2_2:boolean = false
visible_soil_3:boolean = false

idsearch(): void{
  this.da.sendMessage('R042XB014NM')
}

onclicksp_1()
{
  this.visiblesp_1 = !this.visiblesp_1
  this.visiblesp_2 = false
  this.visiblesp_3 = false
}

onclicksp_2()
{
  this.visiblesp_1 = false
  this.visiblesp_2 = !this.visiblesp_2
  this.visiblesp_3 = false
}

onclicksp_3()
{
  this.visiblesp_1 =false
  this.visiblesp_2 =false
  this.visiblesp_3 = !this.visiblesp_3
}

onclicksp_3_1(){
  this.visiblesp_3_1 = !this.visiblesp_3_1
  this.visiblesp_3_2 = false
}

onclicksp_3_2(){
  this.visiblesp_3_2 = !this.visiblesp_3_2
  this.visiblesp_3_1 = false
}


onclicksp_1_1()
{
  this.visiblesp_1_1 = !this.visiblesp_1_1
  this.visiblesp_1_2 = false
  this.visiblesp_1_3 = false
  this.visiblesp_1_4 = false
}
onclicksp_1_2()
{
  this.visiblesp_1_1 = false
  this.visiblesp_1_3 = false
  this.visiblesp_1_4 = false
  this.visiblesp_1_2 = !this.visiblesp_1_2
}
onclicksp_1_3()
{
  this.visiblesp_1_2 = false
  this.visiblesp_1_1 = false
  this.visiblesp_1_4 = false
  this.visiblesp_1_3 = !this.visiblesp_1_3
}
onclicksp_1_4()
{
  this.visiblesp_1_2 = false
  this.visiblesp_1_3 = false
  this.visiblesp_1_1 = false
  this.visiblesp_1_4 = !this.visiblesp_1_4
}
onclicksp_1_1_1()
{
  this.visiblesp_1_1_1 = !this.visiblesp_1_1_1
  this.visiblesp_1_1_2 = false
  this.visiblesp_1_1_3 = false
  this.visiblesp_1_1_4 = false
  this.visiblesp_1_1_5 = false
  this.visiblesp_1_1_6 = false
}
onclicksp_1_1_2()
{
  this.visiblesp_1_1_1 = false
  this.visiblesp_1_1_3 = false
  this.visiblesp_1_1_4 = false
  this.visiblesp_1_1_5 = false
  this.visiblesp_1_1_6 = false
  this.visiblesp_1_1_2 = !this.visiblesp_1_1_2
}
onclicksp_1_1_3()
{
  this.visiblesp_1_1_2 = false
  this.visiblesp_1_1_1 = false
  this.visiblesp_1_1_4 = false
  this.visiblesp_1_1_5 = false
  this.visiblesp_1_1_6 = false
  this.visiblesp_1_1_3 = !this.visiblesp_1_1_3
}
onclicksp_1_1_4()
{
  this.visiblesp_1_1_2 = false
  this.visiblesp_1_1_3 = false
  this.visiblesp_1_1_1 = false
  this.visiblesp_1_1_5 = false
  this.visiblesp_1_1_6 = false
  this.visiblesp_1_1_4 = !this.visiblesp_1_1_4
}
onclicksp_1_1_5()
{
  this.visiblesp_1_1_2 = false
  this.visiblesp_1_1_3 = false
  this.visiblesp_1_1_4 = false
  this.visiblesp_1_1_1 = false
  this.visiblesp_1_1_6 = false
  this.visiblesp_1_1_5 = !this.visiblesp_1_1_5
}
onclicksp_1_1_6()
{
  this.visiblesp_1_1_2 = false
  this.visiblesp_1_1_3 = false
  this.visiblesp_1_1_4 = false
  this.visiblesp_1_1_5 = false
  this.visiblesp_1_1_1 = false
  this.visiblesp_1_1_6 = !this.visiblesp_1_1_6
}
onclicksp_1_1_1_i()
{
  this.visiblesp_1_1_1_i = !this.visiblesp_1_1_1_i
  this.visiblesp_1_1_1_s = false
}
onclicksp_1_1_1_s()
{
  this.visiblesp_1_1_1_i = false
  this.visiblesp_1_1_1_s = !this.visiblesp_1_1_1_s
}
onclicksp_1_1_2_i()
{
  this.visiblesp_1_1_2_i = !this.visiblesp_1_1_2_i
  this.visiblesp_1_1_2_s = false
}
onclicksp_1_1_2_s()
{
  this.visiblesp_1_1_2_s = !this.visiblesp_1_1_2_s
  this.visiblesp_1_1_2_i = false
}
onclicksp_1_1_3_i()
{
  this.visiblesp_1_1_3_i = !this.visiblesp_1_1_3_i
  this.visiblesp_1_1_3_s = false
}
onclicksp_1_1_3_s()
{
  this.visiblesp_1_1_3_s = !this.visiblesp_1_1_3_s
  this.visiblesp_1_1_3_i = false
}
onclicksp_1_1_4_i()
{
  this.visiblesp_1_1_4_i = !this.visiblesp_1_1_4_i
  this.visiblesp_1_1_4_s = false
}
onclicksp_1_1_4_s()
{
  this.visiblesp_1_1_4_s = !this.visiblesp_1_1_4_s
  this.visiblesp_1_1_4_i = false

}
onclicksp_1_1_5_i()
{
  this.visiblesp_1_1_5_i = !this.visiblesp_1_1_5_i
  this.visiblesp_1_1_5_s = false
}
onclicksp_1_1_5_s()
{
  this.visiblesp_1_1_5_s = !this.visiblesp_1_1_5_s
  this.visiblesp_1_1_5_i = false

}
onclicksp_1_1_6_i()
{
  this.visiblesp_1_1_6_i = !this.visiblesp_1_1_6_i
  this.visiblesp_1_1_6_s = false
}
onclicksp_1_1_6_s()
{
  this.visiblesp_1_1_6_s = !this.visiblesp_1_1_6_s
  this.visiblesp_1_1_6_i = false
}
onclicksp_1_2_i()
{
  this.visiblesp_1_2_i = !this.visiblesp_1_2_i
  this.visiblesp_1_2_s = false
}
onclicksp_1_2_s()
{
  this.visiblesp_1_2_s = !this.visiblesp_1_2_s
  this.visiblesp_1_2_i = false
}





// ##########
onclicksp_1_3_1()
{
  this.visiblesp_1_3_1 = !this.visiblesp_1_3_1
  this.visiblesp_1_3_2 = false
  this.visiblesp_1_3_3 = false
  this.visiblesp_1_3_4 = false
  this.visiblesp_1_3_5 = false
  this.visiblesp_1_3_6 = false
  this.visiblesp_1_3_7 = false
  this.visiblesp_1_3_8 = false
}
onclicksp_1_3_2()
{
  this.visiblesp_1_3_2 = !this.visiblesp_1_3_2
  this.visiblesp_1_3_1 = false
  this.visiblesp_1_3_3 = false
  this.visiblesp_1_3_4 = false
  this.visiblesp_1_3_5 = false
  this.visiblesp_1_3_6 = false
  this.visiblesp_1_3_7 = false
  this.visiblesp_1_3_8 = false
}
onclicksp_1_3_3()
{
  this.visiblesp_1_3_3 = !this.visiblesp_1_3_3
  this.visiblesp_1_3_2 = false
  this.visiblesp_1_3_1 = false
  this.visiblesp_1_3_4 = false
  this.visiblesp_1_3_5 = false
  this.visiblesp_1_3_6 = false
  this.visiblesp_1_3_7 = false
  this.visiblesp_1_3_8 = false
}
onclicksp_1_3_4()
{
  this.visiblesp_1_3_4 = !this.visiblesp_1_3_4
  this.visiblesp_1_3_2 = false
  this.visiblesp_1_3_3 = false
  this.visiblesp_1_3_1 = false
  this.visiblesp_1_3_5 = false
  this.visiblesp_1_3_6 = false
  this.visiblesp_1_3_7 = false
  this.visiblesp_1_3_8 = false
}
onclicksp_1_3_5()
{
  this.visiblesp_1_3_5 = !this.visiblesp_1_3_5
  this.visiblesp_1_3_2 = false
  this.visiblesp_1_3_3 = false
  this.visiblesp_1_3_4 = false
  this.visiblesp_1_3_1 = false
  this.visiblesp_1_3_6 = false
  this.visiblesp_1_3_7 = false
  this.visiblesp_1_3_8 = false
}
onclicksp_1_3_6()
{
  this.visiblesp_1_3_6 = !this.visiblesp_1_3_6
  this.visiblesp_1_3_2 = false
  this.visiblesp_1_3_3 = false
  this.visiblesp_1_3_4 = false
  this.visiblesp_1_3_5 = false
  this.visiblesp_1_3_1 = false
  this.visiblesp_1_3_7 = false
  this.visiblesp_1_3_8 = false
}
onclicksp_1_3_7()
{
  this.visiblesp_1_3_7 = !this.visiblesp_1_3_7
  this.visiblesp_1_3_2 = false
  this.visiblesp_1_3_3 = false
  this.visiblesp_1_3_4 = false
  this.visiblesp_1_3_5 = false
  this.visiblesp_1_3_6 = false
  this.visiblesp_1_3_1 = false
  this.visiblesp_1_3_8 = false
}
onclicksp_1_3_8()
{
  this.visiblesp_1_3_8 = !this.visiblesp_1_3_8
  this.visiblesp_1_3_2 = false
  this.visiblesp_1_3_3 = false
  this.visiblesp_1_3_4 = false
  this.visiblesp_1_3_5 = false
  this.visiblesp_1_3_6 = false
  this.visiblesp_1_3_7 = false
  this.visiblesp_1_3_1 = false
}
onclicksp_1_3_1_i()
{
  this.visiblesp_1_3_1_i = !this.visiblesp_1_3_1_i
  this.visiblesp_1_3_1_s = false
}
onclicksp_1_3_1_s()
{
  this.visiblesp_1_3_1_s = !this.visiblesp_1_3_1_s
  this.visiblesp_1_3_1_i = false
}
onclicksp_1_3_2_i()
{
  this.visiblesp_1_3_2_i = !this.visiblesp_1_3_2_i
  this.visiblesp_1_3_2_s = false
}
onclicksp_1_3_2_s()
{
  this.visiblesp_1_3_2_s = !this.visiblesp_1_3_2_s
  this.visiblesp_1_3_2_i = false
}
onclicksp_1_3_3_i()
{
  this.visiblesp_1_3_3_i = !this.visiblesp_1_3_3_i
  this.visiblesp_1_3_3_s = false
}
onclicksp_1_3_3_s()
{
  this.visiblesp_1_3_3_s = !this.visiblesp_1_3_3_s
  this.visiblesp_1_3_3_i = false
}
onclicksp_1_3_4_i()
{
  this.visiblesp_1_3_4_i = !this.visiblesp_1_3_4_i
  this.visiblesp_1_3_4_s = false
}
onclicksp_1_3_4_s()
{
  this.visiblesp_1_3_4_s = !this.visiblesp_1_3_4_s
  this.visiblesp_1_3_4_i = false
}
onclicksp_1_3_5_i()
{
  this.visiblesp_1_3_5_i = !this.visiblesp_1_3_5_i
  this.visiblesp_1_3_5_s = false
}
onclicksp_1_3_5_s()
{
  this.visiblesp_1_3_5_s = !this.visiblesp_1_3_5_s
  this.visiblesp_1_3_5_i = false
}
onclicksp_1_3_6_i()
{
  this.visiblesp_1_3_6_i = !this.visiblesp_1_3_6_i
  this.visiblesp_1_3_6_s = false
}
onclicksp_1_3_6_s()
{
  this.visiblesp_1_3_6_s = !this.visiblesp_1_3_6_s
  this.visiblesp_1_3_6_i = false
}
onclicksp_1_3_7_i()
{
  this.visiblesp_1_3_7_i = !this.visiblesp_1_3_1_i
  this.visiblesp_1_3_7_s = false
}
onclicksp_1_3_7_s()
{
  this.visiblesp_1_3_7_s = !this.visiblesp_1_3_7_s
  this.visiblesp_1_3_7_i = false
}
onclicksp_1_3_8_i()
{
  this.visiblesp_1_3_8_i = !this.visiblesp_1_3_8_i
  this.visiblesp_1_3_8_s = false
}
onclicksp_1_3_8_s()
{
  this.visiblesp_1_3_8_s = !this.visiblesp_1_3_8_s
  this.visiblesp_1_3_8_i = false
}


// ############## 


onclicksp_1_4_1()
{
  this.visiblesp_1_4_1 = !this.visiblesp_1_4_1
  this.visiblesp_1_4_2 = false
  this.visiblesp_1_4_3 = false
}
onclicksp_1_4_2()
{
  this.visiblesp_1_4_2 = !this.visiblesp_1_4_2
  this.visiblesp_1_4_1 = false
  this.visiblesp_1_4_3 = false

}
onclicksp_1_4_3()
{
  this.visiblesp_1_4_3 = !this.visiblesp_1_4_3
  this.visiblesp_1_4_2 = false
  this.visiblesp_1_4_1 = false
}

onclicksp_1_4_1_i()
{
  this.visiblesp_1_4_1_i = !this.visiblesp_1_4_1_i
  this.visiblesp_1_4_1_s = false
}
onclicksp_1_4_1_s()
{
  this.visiblesp_1_4_1_s = !this.visiblesp_1_4_1_s
  this.visiblesp_1_4_1_i = false
}
onclicksp_1_4_2_i()
{
  this.visiblesp_1_4_2_i = !this.visiblesp_1_4_2_i
  this.visiblesp_1_4_2_s = false
}
onclicksp_1_4_2_s()
{
  this.visiblesp_1_4_2_s = !this.visiblesp_1_4_2_s
  this.visiblesp_1_4_2_i = false
}
onclicksp_1_4_3_i()
{
  this.visiblesp_1_4_3_i = !this.visiblesp_1_4_3_i
  this.visiblesp_1_4_3_s = false
}
onclicksp_1_4_3_s()
{
  this.visiblesp_1_4_3_s = !this.visiblesp_1_4_3_s
  this.visiblesp_1_4_3_i = false
}


















// ########### 







onclicksp_2_1()
{
  this.visiblesp_2_1 = !this.visiblesp_2_1
  this.visiblesp_2_2 = false
  this.visiblesp_2_3 = false
  this.visiblesp_2_4 = false
  this.visiblesp_2_5 = false
  this.visiblesp_2_6 = false
}
onclicksp_2_1_1(){
  this.visiblesp_2_1_1 = !this.visiblesp_2_1_1
  this.visiblesp_2_1_2 = false
}

onclicksp_2_1_2(){
  this.visiblesp_2_1_1 = false
  this.visiblesp_2_1_2 = !this.visiblesp_2_1_2
}

onclicksp_2_2()
{
  this.visiblesp_2_2 = !this.visiblesp_2_2
  this.visiblesp_2_1 = false
  this.visiblesp_2_3 = false
  this.visiblesp_2_4 = false
  this.visiblesp_2_5 = false
  this.visiblesp_2_6 = false
}
onclicksp_2_2_1(){
  this.visiblesp_2_2_1 = !this.visiblesp_2_2_1
  this.visiblesp_2_2_2 = false
}

onclicksp_2_2_2(){
  this.visiblesp_2_2_1 = false
  this.visiblesp_2_2_2 = !this.visiblesp_2_2_2
}
onclicksp_2_3()
{
  this.visiblesp_2_3 = !this.visiblesp_2_3
  this.visiblesp_2_2 = false
  this.visiblesp_2_1 = false
  this.visiblesp_2_4 = false
  this.visiblesp_2_5 = false
  this.visiblesp_2_6 = false
}
onclicksp_2_3_1(){
  this.visiblesp_2_3_1 = !this.visiblesp_2_3_1
  this.visiblesp_2_3_2 = false
}

onclicksp_2_3_2(){
  this.visiblesp_2_3_1 = false
  this.visiblesp_2_3_2 = !this.visiblesp_2_3_2
}
onclicksp_2_4()
{
  this.visiblesp_2_4 = !this.visiblesp_2_4
  this.visiblesp_2_2 = false
  this.visiblesp_2_3 = false
  this.visiblesp_2_1 = false
  this.visiblesp_2_5 = false
  this.visiblesp_2_6 = false
}
onclicksp_2_4_1(){
  this.visiblesp_2_4_1 = !this.visiblesp_2_4_1
  this.visiblesp_2_4_2 = false
}

onclicksp_2_4_2(){
  this.visiblesp_2_4_1 = false
  this.visiblesp_2_4_2 = !this.visiblesp_2_4_2
}
onclicksp_2_5()
{
  this.visiblesp_2_5 = !this.visiblesp_2_5
  this.visiblesp_2_2 = false
  this.visiblesp_2_3 = false
  this.visiblesp_2_4 = false
  this.visiblesp_2_1 = false
  this.visiblesp_2_6 = false
}
onclicksp_2_5_1(){
  this.visiblesp_2_5_1 = !this.visiblesp_2_5_1
  this.visiblesp_2_5_2 = false
}

onclicksp_2_5_2(){
  this.visiblesp_2_5_1 = false
  this.visiblesp_2_5_2 = !this.visiblesp_2_5_2
}
onclicksp_2_6()
{
  this.visiblesp_2_6 = !this.visiblesp_2_6
  this.visiblesp_2_2 = false
  this.visiblesp_2_3 = false
  this.visiblesp_2_4 = false
  this.visiblesp_2_5 = false
  this.visiblesp_2_1 = false
}
onclicksp_2_6_1(){
  this.visiblesp_2_6_1 = !this.visiblesp_2_6_1
  this.visiblesp_2_6_2 = false
}

onclicksp_2_6_2(){
  this.visiblesp_2_6_1 = false
  this.visiblesp_2_6_2 = !this.visiblesp_2_6_2
}



speciescov(){
  this.visible_species = !this.visible_species
  this.visible_ground = false
  this.visible_veg = false
  this.visible_canopy = false
  this.visible_soil = false

}

groundcover(){
  this.visible_species = false
  this.visible_ground = !this.visible_ground
  this.visible_veg = false
  this.visible_canopy = false
  this.visible_soil = false
}

vegheight(){
  this.visible_species = false
  this.visible_ground = false
  this.visible_veg = !this.visible_veg
  this.visible_canopy = false
  this.visible_soil = false
}

canopygap(){
  this.visible_species = false
  this.visible_ground = false
  this.visible_veg = false
  this.visible_canopy = !this.visible_canopy
  this.visible_soil = false
}

soilstability(){
  this.visible_species = false
  this.visible_ground = false
  this.visible_veg = false
  this.visible_canopy = false
  this.visible_soil = !this.visible_soil
}

onclickg_1(){
  this.visibleg_1 = !this.visibleg_1
  this.visibleg_2 = false
}

onclickg_2(){
  this.visibleg_1 = false
  this.visibleg_2 = !this.visibleg_2
}
onclickg_1_1(){
  this.visibleg_1_1 = !this.visibleg_1
  this.visibleg_1_2 = false
}
onclickg_1_2(){
  this.visibleg_1_2 = !this.visibleg_2
  this.visibleg_1_1 = false
}

onclickg_2_1(){
  this.visibleg_2_1 = !this.visibleg_2_1
  this.visibleg_2_2 = false
}

onclickg_2_2(){
  this.visibleg_2_2 = !this.visibleg_2_2
  this.visibleg_2_1 = false
}


onclickveg_1(){
  this.visible_veg_1 = !this.visible_veg_1
  this.visible_veg_2 = false
}
onclickveg_2(){
  this.visible_veg_2 = !this.visible_veg_2
  this.visible_veg_1 = false
}



onclickveg_1_1(){
  this.visible_veg_1_1 = !this.visible_veg_1_1
  this.visible_veg_1_2 = false
  this.visible_veg_1_3 = false
}
onclickveg_1_2(){
  this.visible_veg_1_1 = false
  this.visible_veg_1_2 = !this.visible_veg_1_2
  this.visible_veg_1_3 = false
}
onclickveg_1_3(){
  this.visible_veg_1_1 = false
  this.visible_veg_1_2 = false
  this.visible_veg_1_3 = !this.visible_veg_1_3
}
onclickveg_1_2_1(){
  this.visible_veg_1_2_1 = !this.visible_veg_1_2_1
  this.visible_veg_1_2_2 = false
  this.visible_veg_1_2_3 = false
  this.visible_veg_1_2_4 = false
  this.visible_veg_1_2_5 = false
  this.visible_veg_1_2_6 = false
  this.visible_veg_1_2_7 = false
  this.visible_veg_1_2_8 = false

}
onclickveg_1_2_2(){
  this.visible_veg_1_2_1 = false
  this.visible_veg_1_2_2 = !this.visible_veg_1_2_2
  this.visible_veg_1_2_3 = false
  this.visible_veg_1_2_4 = false
  this.visible_veg_1_2_5 = false
  this.visible_veg_1_2_6 = false
  this.visible_veg_1_2_7 = false
  this.visible_veg_1_2_8 = false

}
onclickveg_1_2_3(){
  this.visible_veg_1_2_1 = false
  this.visible_veg_1_2_2 = false
  this.visible_veg_1_2_3 = !this.visible_veg_1_2_3
  this.visible_veg_1_2_4 = false
  this.visible_veg_1_2_5 = false
  this.visible_veg_1_2_6 = false
  this.visible_veg_1_2_7 = false
  this.visible_veg_1_2_8 = false
  
}
onclickveg_1_2_4(){
  this.visible_veg_1_2_1 = false
  this.visible_veg_1_2_2 = false
  this.visible_veg_1_2_3 = false
  this.visible_veg_1_2_4 = !this.visible_veg_1_2_4
  this.visible_veg_1_2_5 = false
  this.visible_veg_1_2_6 = false
  this.visible_veg_1_2_7 = false
  this.visible_veg_1_2_8 = false

}
onclickveg_1_2_5(){
  this.visible_veg_1_2_1 = false
  this.visible_veg_1_2_2 = false
  this.visible_veg_1_2_3 = false
  this.visible_veg_1_2_4 = false
  this.visible_veg_1_2_5 = !this.visible_veg_1_2_5
  this.visible_veg_1_2_6 = false
  this.visible_veg_1_2_7 = false
  this.visible_veg_1_2_8 = false
}
onclickveg_1_2_6(){
  this.visible_veg_1_2_1 = false
  this.visible_veg_1_2_2 = false
  this.visible_veg_1_2_3 = false
  this.visible_veg_1_2_4 = false
  this.visible_veg_1_2_5 = false
  this.visible_veg_1_2_6 = !this.visible_veg_1_2_6
  this.visible_veg_1_2_7 = false
  this.visible_veg_1_2_8 = false

}
onclickveg_1_2_7(){
  this.visible_veg_1_2_1 = false
  this.visible_veg_1_2_2 = false
  this.visible_veg_1_2_3 = false
  this.visible_veg_1_2_4 = false
  this.visible_veg_1_2_5 = false
  this.visible_veg_1_2_6 = false
  this.visible_veg_1_2_7 = !this.visible_veg_1_2_7
  this.visible_veg_1_2_8 = false

}
onclickveg_1_2_8(){
  this.visible_veg_1_2_1 = false
  this.visible_veg_1_2_2 = false
  this.visible_veg_1_2_3 = false
  this.visible_veg_1_2_4 = false
  this.visible_veg_1_2_5 = false
  this.visible_veg_1_2_6 = false
  this.visible_veg_1_2_7 = false
  this.visible_veg_1_2_8 = !this.visible_veg_1_2_8

}
onclickveg_2_1(){
  this.visible_veg_2_1 = !this.visible_veg_2_1
  this.visible_veg_2_2 = false
  this.visible_veg_2_3 = false
}
onclickveg_2_1_1(){
  this.visible_veg_2_1_1 = !this.visible_veg_2_1_1
  this.visible_veg_2_1_2 = false

}
onclickveg_2_1_2(){
  this.visible_veg_2_1_1 = false
  this.visible_veg_2_1_2 = !this.visible_veg_2_1_2
}
onclickveg_2_2(){
  this.visible_veg_2_1 = false
  this.visible_veg_2_2 = !this.visible_veg_2_2
  this.visible_veg_2_3 = false

}
onclickveg_2_2_1(){
  this.visible_veg_2_2_1 = !this.visible_veg_2_2_1
  this.visible_veg_2_2_2 = false

}
onclickveg_2_2_2(){
  this.visible_veg_2_2_1 = false
  this.visible_veg_2_2_2 = !this.visible_veg_2_2_2
}
onclickveg_2_3(){
  this.visible_veg_2_1 = false
  this.visible_veg_2_2 = false
  this.visible_veg_2_3 = !this.visible_veg_2_3
}
onclickveg_2_3_1(){
  this.visible_veg_2_3_1 = !this.visible_veg_2_3_1
  this.visible_veg_2_3_1 = false

}
onclickveg_2_3_2(){
  this.visible_veg_2_3_1 = false
  this.visible_veg_2_3_2 = !this.visible_veg_2_3_2

}

onclickcanopy_1(){
  this.visible_can_1 = !this.visible_can_1
  this.visible_can_2 = false
}
onclickcanopy_1_1(){
  this.visible_can_1_1 = !this.visible_can_1_1
  this.visible_can_1_2 = false
}
onclickcanopy_1_2(){
  this.visible_can_1_1 = false
  this.visible_can_1_2 = !this.visible_can_1_2
}
onclickcanopy_2(){
  this.visible_can_1 = false
  this.visible_can_2 = !this.visible_can_2
}
onclickcanopy_2_1(){
  this.visible_can_2_1 = !this.visible_can_2_1
  this.visible_can_2_2 = false
}
onclickcanopy_2_2(){
  this.visible_can_2_1 = false
  this.visible_can_2_2 = !this.visible_can_2_2
}

onclicksoil_1(){
  this.visible_soil_1 = !this.visible_can_1
  this.visible_soil_2 = false
  this.visible_soil_3 = false
}
onclicksoil_1_1(){
  this.visible_soil_1_1 = !this.visible_soil_1_1
  this.visible_soil_1_2 = false
}
onclicksoil_1_2(){
  this.visible_can_1_1 = false
  this.visible_soil_1_2 = !this.visible_soil_1_2
}
onclicksoil_2(){
  this.visible_soil_1 = false
  this.visible_soil_2 = !this.visible_soil_2
  this.visible_soil_3 = false
}
onclicksoil_2_1(){
  this.visible_soil_2_1 = !this.visible_soil_2_1
  this.visible_soil_2_2 = false
}
onclicksoil_2_2(){
  this.visible_soil_2_1 = false
  this.visible_soil_2_2 = !this.visible_soil_2_2
}
onclicksoil_3(){
  this.visible_soil_1 = false
  this.visible_soil_2 = false
  this.visible_soil_3 = !this.visible_soil_3
}





















ngOnChanges(changes: SimpleChanges) {

}

ngOnInit() {

 window.addEventListener('scroll',this.scrollEvent,true);
  
 this.da.getdata().subscribe((Response) => {
  this.estdata = Response;
});
}
 





















searchecoid(){

}


search(){
   if(this.Duration == ""){
     this.ngOnInit();
   }else{
     this.estdata = this.estdata.filter(res =>{
       return res.Duration.toLocaleLowerCase().match(this.Duration.toLocaleLowerCase());
     });
   }

 }

searchghs()
{
  if(this.GrowthHabitSub == ""){
    this.ngOnInit();
  }else{
    this.estdata = this.estdata.filter(res =>{
      return res.GrowthHabitSub.toLocaleLowerCase().match(this.GrowthHabitSub.toLocaleLowerCase());
    });
  }
}


 key: string = 'species';
 reverse: boolean = false;
 sort(key){
   this.key = key;
   this.reverse = !this.reverse;
 }

 scrollEvent = (event: any): void => {
   const n = event.srcElement.scrollingElement.scrollTop;
 }

  
}




































// getdatas()
// { 
  // var x;
  // document.getElementById("searchid").onclick = function find(){
  //   x = document.forms["ecoid"]["ecosideid"].value;
  // }
  // this.httpClient.get<any>('https://api.landscapedatacommons.org/api/geoindicators?EcologicalSiteId=R042XB014NM').subscribe(
  //   response => {
  //     console.log(response);
  //     //this.dataapi = response;
  //     var responser = JSON.parse(JSON.stringify(response[0]));
  //     document.getElementById("EcologicalSiteId").innerHTML = responser.EcologicalSiteId;
      
    
  //     //alert(response);
      
  //     // var s=[];
  //     // var a = JSON.parse(JSON.stringify(response));
  //   //   a.forEach(x => {
  //   //     Object.keys(x).forEach(function(k) {
  //   //       if(k === 'AH_GrassCover'){
          
  //   //         s.push(x[k]);
  //   //         //console.log(s[0]);
  //   //         for (var i in s)
  //   //         {
  //   //           // console.log(" "+s[i]);
  //   //           ss[i] = s[i];
  //   //         }
  //   //       } 
  //   //     });
  //   // });
  //   }
  // );

// }



// private readonly boxPlotData: ChartData = {
//   labels: ['Graminiod','Forb','Sub Shrub'],//,'Shrub','Tree','Succulent'],
//   datasets: [{
//     label: '',
//     backgroundColor: 'steelblue',
//     data: <any[]>[
  
//       Array.from({length: 100}).map(() => Math.random()),
//       Array.from({length: 100}).map(() => Math.random()),
//       Array.from({length: 100}).map(() => Math.random() * 0.6 + 0.2) //,
//       // Array.from({length: 100}).map(() => Math.random()),
//       // Array.from({length: 100}).map(() => Math.random()),
//       // Array.from({length: 100}).map(() => Math.random() * 0.6 + 0.2),
//       // Array.from({length: 100}).map(() => Math.random())
//     ]
//   }]
// };

// private build() {
//   this.ngZone.runOutsideAngular(() => {
//     const node: HTMLElement = this.elementRef.nativeElement;
//     this.chart = new Chart(node.querySelector('canvas'), {
//       type: 'boxplot',
//       data: this.boxPlotData
//     });
//   });
// }

