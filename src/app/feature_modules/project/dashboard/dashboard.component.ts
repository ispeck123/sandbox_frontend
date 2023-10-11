import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectDataService } from 'src/app/services/project-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public router: Router,private projectData: ProjectDataService,) { }

  ngOnInit(): void {
  }

  openProject()
  {
    localStorage.removeItem("editflow");
    localStorage.removeItem("cannedProject");
    this.router.navigateByUrl('/project-list'); 
    localStorage.setItem("useflow",'useflow');
    
 } 
 
 openCannedProject()
  {
    this.router.navigateByUrl('/project-list');
    localStorage.setItem("cannedProject","canned");
    localStorage.removeItem("useflow")
  }
  openProjects(){
     
    localStorage.removeItem("editflow");
    localStorage.removeItem("cannedProject");
    this.router.navigateByUrl('/project-list'); 
    localStorage.removeItem("useflow");

 

  }

}
