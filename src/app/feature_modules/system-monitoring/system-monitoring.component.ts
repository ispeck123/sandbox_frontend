import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {    Chart, registerables} from 'chart.js';
import { GpuUsageConfig, SystemUsageConfig , GpuUsageData,ProcessConfig} from 'src/app/data-models/graph-model';
import { GraphService } from 'src/app/services/graph.service';
import {Subscription} from 'rxjs';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-system-monitoring',
  templateUrl: './system-monitoring.component.html',
  styleUrls: ['./system-monitoring.component.css']
})
export class SystemMonitoringComponent implements OnInit {
  // @ViewChild('canvas')
  // private canvas: ElementRef = {} as ElementRef;
  // @ViewChild('system_memory')
  // private sysMem: ElementRef = {} as ElementRef;
  chart:any;
  gpuUsageData!: GpuUsageConfig;
  gpuData:any=[];
  process!:ProcessConfig;
  memchart:any;
  graphData!:SystemUsageConfig;
  graphdata:any=[];
  processdata:any=[]
  freeCpu:number=100;
  usedMem:number = 0
  private _apiSubscription! : Subscription;
  private _apiSubscription1! : Subscription;
  private _apiSubscription2! : Subscription;
  // ctx!: CanvasRenderingContext2D | null | undefined;
  constructor(private graphService: GraphService,public audit: AuditTrailService ) { }

  ngOnInit(): void {

    Chart.register(...registerables);
    this.getSystemUsage();
    this.getGpuUsage();
    this.getProcess();
    this.audit.addUrlAudit('userAuditLog');

  }

  getSystemUsage(){
    this.graphService.showLoader=true;

    this._apiSubscription=this.graphService.fetchSystemUsage('serverUsage')
    .subscribe(respArray => {
      this.graphData = respArray;
      this.graphdata = this.graphData.data;
      console.log(this.graphData);
      this.graphdata.totalmemory=parseFloat(this.graphdata.totalmemory).toFixed(2);
      this.graphdata.freememory=parseFloat(this.graphdata.freememory).toFixed(2);
       this.freeCpu  = (100 - this.graphdata.CPUUsage);
       this.usedMem  = parseInt((this.graphdata.totalmemory)) - parseInt((this.graphdata.freememory));
       this.cpuUsageGraph(this.graphData);
       this.sysMemGraph(parseInt((this.graphdata.freememory)));
    this.graphService.showLoader=false;

    })
  }

  getGpuUsage(){
    this._apiSubscription1=this.graphService.fetchGpuUsage('gpuUsage')
    .subscribe(respArray => {
      this.gpuUsageData = respArray;
      this.gpuData = this.gpuUsageData.data;
      console.log(this.gpuUsageData)
       this.gpuUsageGraph(this.gpuData);
       this.gpuUsageTempGraph(this.gpuData)

    })
  }
 getProcess(){
    this.graphService.showLoader = true;
    this._apiSubscription2=this.graphService.fetchprocess('processDetails')
    .subscribe(respArray => {
      this.process = respArray;
      this.processdata =this.process.data;
      console.log(this.process)
       console.log(this.process.data)
    }, (error) => {
      console.log("error in fetching cpu process", error);
    }, () => {
      this.graphService.showLoader = false;
      console.log("process had been fetched successfully...");
    })
  }

  cpuUsageGraph(cpuData:object){

    this.chart = new Chart('canvas',{
      type: 'doughnut',
       data : {
        labels: [
          'Cpu Used',
          'Free Cpu',
        ],
        datasets: [{
          label: 'Cpu Usage',
          data: [this.graphdata.CPUUsage, this.freeCpu],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    })
  }

  sysMemGraph(freeMem:number){
  console.log(parseInt((this.graphdata.totalmemory)) - parseInt((this.graphdata.freememory)));

    this.chart = new Chart('system_memory',{
      type: 'doughnut',
       data : {
        labels: [
          'Used Memory',
          'Free Memory',
        ],
        datasets: [{
          label: 'System Memory Usage',
          data: [this.usedMem, freeMem],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    })
  }

  gpuUsage(freeMem:number){

        this.chart = new Chart('gpu_usage',{
          type: 'doughnut',
           data : {
            labels: [
              'Used Gpu Memory',
              'Free Gpu Memory',
            ],
            datasets: [{
              label: 'System Memory Usage',
              data: [this.usedMem, freeMem],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          }
        })
      }

  gpuUsageGraph(data: GpuUsageData){
      console.log('d',data)

        let usedGpu = parseInt((data.gpu_util).replace('%', ''));
        console.log('us',usedGpu)
        let freeGpu:number = 100 - usedGpu
            this.chart = new Chart('gpu_usage',{
              type: 'doughnut',
               data : {
                labels: [
                  'Used Gpu',
                  'Free Gpu',
                ],
                datasets: [{
                  label: 'System Memory Usage',
                  data: [usedGpu, freeGpu],
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                  ],
                  hoverOffset: 4
                }]
              }
            })
        }

  gpuUsageTempGraph(data: GpuUsageData){
            console.log('d',data)

              let gpuTemp = parseInt((data.gpu_temp).replace('deg', ''));

                  this.chart = new Chart('gpu_temp',{
                    type: 'line',
                     data : {
                      labels: [
                        '',

                      ],
                      datasets: [{
                        label: '',
                        data: [gpuTemp],
                        fill: false,
                        borderColor: 'rgb(255,0,0)',
                        backgroundColor: 'rgb(151, 24, 13)',

                        tension: 0.1

                      }]
                    },
                    options: {
                      scales: {
                          x: {
                              ticks: {
                                  color: '#000'
                              }
                          },
                          y: {
                            ticks: {
                                color: 'rgb(151, 24, 13)'
                            }
                        }
                      }
                  }
                  })
        }
  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
    this._apiSubscription1.unsubscribe();
    this._apiSubscription2.unsubscribe();
  }

}


