import { Component, OnInit, OnChanges, ElementRef, SimpleChanges, NgZone } from '@angular/core';
import { Chart, ChartData } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';

// based on https://github.com/emn178/angular2-chartjs/blob/master/src/chart.component.ts

@Component({
  selector: 'app-boxplot',
  template: `<div class="chart-wrapper"><canvas></canvas></div>`,
  styles: [`.chart-wrapper {
    width: 500px;
    height: 500px;
    position: relative;
  }`]
})
export class BoxplotComponent implements OnInit, OnChanges {

  private readonly boxPlotData: ChartData = {
    labels: ['Graminiod','Forb','Sub Shrub','Shrub','Tree','Succulent'],
    datasets: [{
      label: 'Dataset 1',
      backgroundColor: 'steelblue',
      data: <any[]>[
        Array.from({length: 100}).map(() => Math.random()),
        Array.from({length: 100}).map(() => Math.random() * 0.6 + 0.2),
        Array.from({length: 100}).map(() => Math.random(),
        
        )
      ]
    }]
  };
  private chart: Chart;

  constructor(private readonly elementRef: ElementRef, private readonly ngZone: NgZone) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chart) {
      return;
    }

    // TODO handle updates

    this.chart.update();
  }

  ngOnInit() {
    this.build();
  }

  private build() {
    this.ngZone.runOutsideAngular(() => {
      const node: HTMLElement = this.elementRef.nativeElement;
      this.chart = new Chart(node.querySelector('canvas'), {
        type: 'boxplot',
        data: this.boxPlotData
      });
    });
  }
}