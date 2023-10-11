import { Component, OnInit } from '@angular/core';
import { ProjectDataService } from 'src/app/services/project-data.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  viewlist: any[] = []; 

  constructor(  private projectService: ProjectDataService,) { }

  ngOnInit(): void {
    this.getschedularview();
  

    


  }


getschedularview(){
  this.projectService.getschedular("scheduler/view",'all')
      .subscribe(
        (response) => {
          this.viewlist = response.response.schedulers;
        console.log('viewlist',response.response.schedulers);

        },
        (error) => {
          console.error('Error updating source:', error);

        }
      );

}
}