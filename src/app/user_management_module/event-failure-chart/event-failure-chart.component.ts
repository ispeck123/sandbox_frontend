import { Component, ElementRef, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import { EventConfig, EventData, LoginChartConfig, LoginChartData, SystemUsageConfig } from 'src/app/data-models/graph-model';
import { GetTokenService } from 'src/app/services/get-token.service';
import { GraphService } from 'src/app/services/graph.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';
import Swal from 'sweetalert2';
import {Subscription} from 'rxjs';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-event-failure-chart',
  templateUrl: './event-failure-chart.component.html',
  styleUrls: ['./event-failure-chart.component.css']
})
export class EventFailureChartComponent implements OnInit, OnDestroy  {

// @ViewChild('canvas')
  // private canvas: ElementRef = {} as ElementRef;
  // @ViewChild('system_memory')
  // private sysMem: ElementRef = {} as ElementRef;
  myeventfail:boolean=true;
  token: string | null = '';
  chart:any;
  memchart:any;
  loginConfig!:LoginChartConfig;
  loginData!: LoginChartData;
  eventConfig!:EventConfig;
  eventData!: EventData;
  Id!:number;
  userId!:number|string;
  startdate: number=0;
  enddate: number=0;
  get_user: string='All';
  userDetails: any=[];
  private _apiSubscription! : Subscription;
  private _apiSubscription1! : Subscription;
  private _apiSubscription2! : Subscription;
  eventfailChartForm = new FormGroup({
    from_date: new FormControl(''),
    to_date  : new FormControl(''),
    user: new FormControl(''),
  });
  startdat: number=0;
  enddat: number=0;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  // ctx!: CanvasRenderingContext2D | null | undefined;
  constructor(private graphService: GraphService, private tokenService: GetTokenService,private userData: UserDataService,
    public audit: AuditTrailService) { }

  ngOnInit(): void {

    Chart.register(...registerables);
    this.Id = this.tokenService.getUser_id();
    this.token = localStorage.getItem('tk');
    this.getuserid(this.token,this.Id);
    this.getUsers();
    this.audit.addUrlAudit('userAuditLog');

  }

  getuserid(token:any,id:number){
    this.graphService.showLoader=true;

    this._apiSubscription=this.graphService.checkAdmin('checkadmin',id,token!).subscribe((respArray) => {
      console.log(respArray)
      if(respArray.data[0].ROLE_NAME=="Admin")
        this.userId="";
      else
        this.userId=this.Id;
        this.getEventfailure();
    this.graphService.showLoader=false;

   });
  }

  get currentDate() {
    return new Date();
  }

  get olddate(){
    var date=new Date();
    var d= Math.round((date.setDate(date.getDate() - 15))/1000);
    return d;
  }

  get olddateraw(){
    var rdate=new Date();
    rdate.setDate(rdate.getDate() - 15);
    rdate.toString();
    return rdate.toLocaleDateString("en-CA");
  }
  getDate() {
    console.log(this.eventfailChartForm.value.from_date);
    this.startdat=this.eventfailChartForm.get('from_date')?.value ? this.eventfailChartForm.value.from_date.toLocaleDateString("en-CA") : this.olddateraw;
    this.enddat=this.eventfailChartForm.get('startdate')?.value ? this.eventfailChartForm.value.to_date.toLocaleDateString("en-CA") : this.currentDate.toLocaleDateString("en-CA");

    this.startdate = this.eventfailChartForm.get('from_date')?.value ? this.convertDateToEpochTimeStamp(this.eventfailChartForm.get('from_date')?.value)  : this.olddate;

    this.enddate = this.eventfailChartForm.get('startdate')?.value
      ? this.convertDateToEpochTimeStamp(this.eventfailChartForm.get('startdate')?.value)
      : this.convertDateToEpochTimeStamp(this.currentDate);
      console.log(this.eventfailChartForm.value.user)
      console.log(this.eventfailChartForm.get('user')?.value)
    this.get_user = this.eventfailChartForm.get('user')?.value =='All' ? 'All'  : (this.eventfailChartForm.get('user')?.value ? (this.eventfailChartForm.get('user')?.value.USER_ID):'All');

  }
  getUsers() {
    console.log('users');
    this._apiSubscription1=this.userData.userListData('allUserList').subscribe((respArray) => {
       this.userDetails = respArray.data;
       console.log(this.userDetails);
    });
  }

  equalizedata(data:any){
    for(var arr=[],dt=new Date(this.startdat); dt<=new Date(this.enddat); dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt).toLocaleDateString("en-CA"));
  }
  console.log(arr);
     for(var k=0;k<data.length;k++)
     {
       for(var l=0;l<arr.length;l++)
       {
        var data_exist=false;
         for(var t=0;t<data[k].dataa.length;t++)
         {
            if(data[k].dataa[t].the_date==(arr[l]))
            {
              data_exist= true;
            }
         }
         if(!data_exist)
         data[k].dataa.push({
          count:0,
          the_date:arr[l],
          user_name:data[k].dataa[0].user_name
        })
      }
     }
     console.log(data);

     return data;
  }
  convertDateToEpochTimeStamp(dateString: Date) {
    console.log(dateString);
    return Math.round(dateString.getTime() / 1000);
  }

  getEventfailure(){
    // this.graphService.fetchEvent('eventFailureChart', this.userId)
    // .subscribe(respArray => {
    //   this.loginConfig = respArray;
    //   let loginCount = this.loginConfig.data.map((item : any) => item.count);
    //   let loginDate  = this.loginConfig.data.map((item : any) => item.the_date);
    //   let event_type  = this.loginConfig.data.map((item : any) => item.event_type);
    //   this.eventFailure(loginCount, loginDate, event_type)
    // })
    this.myeventfail = true;
    this.getDate();
    this.eventfailChartForm.patchValue({
      from_date: this.startdate,
      to_date: this.enddate,
      user: this.get_user,
    });
    let data: [] = this.eventfailChartForm.value;

    this._apiSubscription2=this.graphService.fetchEventfail('eventFailureChart',data, this.userId)
    .subscribe(respArray => {
        this.loginConfig = respArray;
        console.log(this.loginConfig.data[0])
        let p=this.equalizedata(this.loginConfig.data[0])
        this.eventFailure(p)
    })
  }

  eventFailure(loginData:any){

    let labels=[]; //declare an object````````````````````````````````````````````````````````
    let graphdata=[]; //declare an object````````````````````````````````````````````````````````

    let count:any=[];

  console.log("nn",loginData)
      for(var i=0;i<loginData.length;i++)
      {
        let count:any=[];

         for(var j=0;j<loginData[i].dataa.length;j++)
        {
          graphdata[i]={
            label:loginData[i].dataa[j].user_name,
            backgroundColor:'#'+Math.floor(Math.random()*16777215).toString(16),
           data:0
          }
          labels[j]=loginData[i].dataa[j].the_date;
            if(j==0)
            count[j]=loginData[i].dataa[j].count;
            else
            count=[...count,loginData[i].dataa[j].count]
            graphdata[i].data=count;
            }

      }
     console.log(graphdata)
     if (this.chart != undefined)
     this.chart.destroy();
        this.chart = new Chart('event-failure',{
        type: 'line',
        data :
        {
          labels : labels,
          datasets : graphdata,
        },
      })
      this.startdat=0;
      this.enddat=0;
      labels=[];
      this.eventfailChartForm.reset();
      if(graphdata.length==0)
      {
        this.myeventfail=false;
        Swal.fire('No Graph data found!');
      }
    // this.chart = new Chart('event-failure',{
    //   type: 'bar',
    //    data : {
    //     labels:
    //      eventtype
    //     ,
    //     datasets: [{
    //       label: 'Login Chart',
    //       data: loginCount,
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(255, 159, 64, 0.2)',
    //         'rgba(255, 205, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(201, 203, 207, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgb(255, 99, 132)',
    //         'rgb(255, 159, 64)',
    //         'rgb(255, 205, 86)',
    //         'rgb(75, 192, 192)',
    //         'rgb(54, 162, 235)',
    //         'rgb(153, 102, 255)',
    //         'rgb(201, 203, 207)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   }
    // })
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
    this._apiSubscription1.unsubscribe();
    this._apiSubscription2.unsubscribe();
  }
 

}
