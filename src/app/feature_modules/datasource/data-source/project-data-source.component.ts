import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AreaListConfig, ProcessingTypeConfig, SourceData, SourceListConfig, SourceRespConfig, purposeTypeConfig } from 'src/app/data-models/pipeline-model';
import { SourceLocationConfig, ProjectListConfig, SourceDetailData, SourceDetailConfig, ProjectListData, ProjectTypeConfig, SourceUploadResp } from 'src/app/data-models/project-model';
import { GetTokenService } from 'src/app/services/get-token.service';
import { GraphService } from 'src/app/services/graph.service';
import { ModelDataService } from 'src/app/services/model-data.service';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs-compat/operator/takeUntil';
// import { FILE } from 'dns';

@Component({
  selector: 'app-project-data-source',
  templateUrl: './project-data-source.component.html',
  styleUrls: ['./project-data-source.component.css']     
})
export class ProjectDataSourceComponent implements OnInit, OnDestroy {
  @ViewChild('closebutton') closebutton!: { nativeElement: { click: () => void; }; };
  @ViewChild("deleteModal") private deleteModal!: ElementRef;

  listdata: any = [];
  value: number = 30;
  data: [] = [];
  areaList!: AreaListConfig;
  processingTypeList!: ProcessingTypeConfig;
  ProjectTypeList!: ProjectTypeConfig;
  projectlist!: ProjectListConfig;
  file:any;
  sourceResp: any;
  username!: string;
  sourceList!: SourceListConfig;
  sourceLocation!: SourceLocationConfig;
  projecttype:any;
  selectedDataSource: any = { source_id: null };
  toastMessage = "Select one item only!";
  toastSubscription!: any;
  private _apiSubscription!: Subscription;
  sourceIdToBeDeleted!: number;
  attatchedSources!: any[];
  disableNxtBtn:boolean = true;
  purpose_type: any;
  purpose !: purposeTypeConfig;
  projectTypeFlag:any;
  ProcessingTypeflag:any;
  // projectTypeList!: ProjectTypeConfig;
  buttondisable:boolean=true;
  fileName: string = '';
  formData= new FormData();
  sourceUpload!: SourceUploadResp;
  fileflag: any;
  projecttypeflag:any;
  sourcebuttonflag: boolean=false;
  project_id:any;
  source_id_sec:any;
  NextVisibleFlag:boolean=false;
  fileerrorShow:boolean=false;
  rtsperrorShow:boolean=false;
  rtspurl:string='';
  source_stored_location: any;
  file_type_name:any;
  route_PRID:any;
  isCreateMode: boolean = true;


  constructor(
    private pipelineData: PipelineDataService,
    private modelDataService: ModelDataService,
    private getTk: GetTokenService,
    private projectService: ProjectDataService,
    private graphService: GraphService,
    public audit: AuditTrailService,
    private router: Router,
    private renderer: Renderer2,
    private projectData: ProjectDataService,
    private route: ActivatedRoute
  ) {
    this.username = this.getTk.getUser_name();
    console.log(this.username)
    this.attatchedSources = [];
  }

  ngOnInit(): void {
      this.route_PRID = localStorage.getItem("tab");
      localStorage.removeItem("tab");

    


this.projectTypeFlag= localStorage.getItem("pr_type")
if(this.projectTypeFlag==null || this.projectTypeFlag=="undefined"){
  this.sourcebuttonflag=true;
  this.FetchAll();
}
else{
this.FetchAllByCondition();
this.sourcebuttonflag=false;
}
   // this.FetchAll();
    this.getProjectType();
    
  }

  getUIClass() {
    return localStorage.getItem("urlForClass")?.includes("/project-edit") ? 'Project Update' : 'Project Create';
  }
FetchAllByCondition(){
  this.graphService.showLoader = true;
  this._apiSubscription = this.pipelineData.getSourceListCondition('condition',this.projectTypeFlag,localStorage.getItem('uid')!)
    .subscribe(
      respArray => {
        this.sourceList = respArray;
        this.listdata = this.sourceList.data;
        this.graphService.showLoader = false;
        console.log(this.sourceList.data);
      }
    )
    if (localStorage.getItem('pr_id') !== null) {
      this.projectService.getProjectList("projects", localStorage.getItem('pr_id')!,localStorage.getItem("uid")!)
        .subscribe((res: ProjectListConfig) => {
          // console.clear();
          // console.log("Project List :: " , res.data[0]);
          this.attatchedSources = res.data[0].source_ids;
          if (this.attatchedSources.length  < 1) {
            this.disableNxtBtn = true;
          } else {
            this.disableNxtBtn = false;
          }
        });
    }
    this.audit.addUrlAudit('userAuditLog');
}
  FetchAll() {
    this.fetchArealist();
    this.processingTypeData();
    this.fetchSouceLocationList();
    this.fetchSourceList();
    if (localStorage.getItem('pr_id') !== null) {
      this.projectService.getProjectList("projects", localStorage.getItem('pr_id')!,localStorage.getItem("uid")!)
        .subscribe((res: ProjectListConfig) => {
          // console.clear();
          // console.log("Project List :: " , res.data[0]);
          this.attatchedSources = res.data[0].source_ids;
          if (this.attatchedSources.length  < 1) {
            this.disableNxtBtn = true;
          } else {
            this.disableNxtBtn = false;
          }
        });
    }
    this.audit.addUrlAudit('userAuditLog');
  }

  addSource = new FormGroup({
    source_name: new FormControl('',Validators.required),
    area_id: new FormControl('',Validators.required),
    fps: new FormControl('',Validators.required),
    process_type: new FormControl('',Validators.required),
    project_id: new FormControl('',),
    source_stored_location_id: new FormControl('',Validators.required),
    created_by: new FormControl('',),
    modified_by: new FormControl('',),
    description: new FormControl('',),
    filename:new FormControl('',),
    rtspurl: new FormControl('',),
    project_type: new FormControl('',Validators.required)

  })
  addProject   = new FormGroup({
    project_name   : new FormControl(''),
    project_type_id: new FormControl(''),
    created_by     : new FormControl(''),
    modified_by    : new FormControl(''),
    pipeline_id    : new FormControl('')
  });

  fetchArealist() {
    this.pipelineData.getAreaList('area', 'all')
      .subscribe(
        respArray => {
          this.areaList = respArray;
          console.log(respArray);
        }
      )
  }
  getProTypeName(proTypeName: string) {
    // alert(proTypeName)
    localStorage.setItem('proTypeName', proTypeName);
    
    if(this.addProject.value.project_name!='' && proTypeName!='')
    {
      this.buttondisable=false;
    } 
  }
  createAvaterName(userName: string) {
    const name = userName.trim().split(' ');
    let avater: string;
    if (name.length > 1) {
      avater = name[0].substring(0, 1) + '' + name[1].substring(0, 1);
    } else {
      avater = userName.substring(0, 2);
    }
    return avater;
  }
  processingTypeData() {
    this.pipelineData.getProcessingTypeData('processing', 'ALL')
      .subscribe(
        respArray => {
          this.processingTypeList = respArray;
          // this.ProjectTypeList = respArray;
          console.log(this.processingTypeList.data);
        }
      )
  }
  colorVariation(index: number) {
    return index % 10;
  }

  onSubmit() {
    
    if(this.addSource.invalid){
      if( this.fileflag=="FILE" )
      {
        if(this.fileName==null || this.fileName=='undefined' || this.fileName=="")
        {
            this.fileerrorShow=true;
        }
        else{
          this.fileerrorShow=false;
          return;
        }
      }
      else if( this.fileflag=="IMAGE" )
      {
        if(this.fileName==null || this.fileName=='undefined' || this.fileName=="")
        {
            this.fileerrorShow=true;
        }
        else{
          this.fileerrorShow=false;
          return;
        }
        
      }
      else if( this.fileflag=="VIDEO" )
      {
        if(this.fileName==null || this.fileName=='undefined' || this.fileName=="")
        {
            this.fileerrorShow=true;
        }
        else{
          this.fileerrorShow=false;
          return;
        }
        
      }

      else  if( this.fileflag=="RTSP" ){
        const rtspurlvalue=this.addSource.get('rtspurl')?.value
        const encodedUrl = encodeURIComponent(rtspurlvalue);
        console.log(encodedUrl);
        if(rtspurlvalue==null || rtspurlvalue=='undefined' || rtspurlvalue=="")
        {
            this.rtsperrorShow=true;
        }
        else{
          this.rtsperrorShow=false;
          return;
        }
      }
      return;
      }
     else{     
    this.addSource.value.project_id = localStorage.getItem('pr_id');
    // this.data = this.addSource.value;
    // console.log(this.addSource.valid);
    const payload = {
      Id: this.getTk.getUser_id(),
      Type: 'Create Project Datasource',
      Effect: 'Project Datasource Created Successfully',
      Status: 1,
    }
    this.formData.append('source_name', this.addSource.get('source_name')?.value);
    this.formData.append('area_id',this.addSource.get('area_id')?.value);
    this.formData.append('fps', this.addSource.get('fps')?.value);
    this.formData.append('process_type',this.addSource.get('process_type')?.value);
    // this.formData.append('project_id',this.addSource.get('project_id')?.value);
    this.formData.append('source_stored_location_id',this.addSource.get('source_stored_location_id')?.value);
    this.formData.append('created_by',this.addSource.get('created_by')?.value);
    this.formData.append('modified_by',this.addSource.get('modified_by')?.value);
    this.formData.append('description',this.addSource.get('description')?.value);
    // this.formData.append('filename',this.addSource.get('filename')?.value);
    // this.formData.append('rtspurl',this.addSource.get('rtspurl')?.value);
    this.formData.append('project_type',this.addSource.get('project_type')?.value);
    // this.formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });
    this.graphService.showLoader = true;

    this.pipelineData.saveSource('/source/create', this.formData)
      .subscribe(
        respArray => {
          
          console.log("sourcereSPONSE",respArray)
          if(respArray.msg=='Success')
          {
            this.sourceResp = respArray;
            this.closebutton.nativeElement.click();
            
            this._apiSubscription = this.pipelineData.getSourceList('source', 'all',localStorage.getItem('uid')! )
              .subscribe(
                respArray => {
                  this.sourceList = respArray;
                  this.listdata = this.sourceList.data;
                  this.graphService.showLoader = false;
                  console.log(this.sourceList.data);
                }
              )
            this.addSource.reset();
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
          else{
            alert(respArray.msg)
            return;
            // payload.Effect = "Project Datasource creation Failed";
            // payload.Status = 0;
            // this.audit.addAudit('userAuditLog', payload).subscribe(
            //   respArray => {
            //     console.log(respArray)
            //   }
            // )
          }
        }
      )
    }
  }

  fetchSourceList() {
    this.graphService.showLoader = true;
    this._apiSubscription = this.pipelineData.getSourceList('source', 'all',localStorage.getItem('uid')!)
      .subscribe(
        respArray => {
          console.log(respArray)
          
          
          this.sourceList = respArray;
          this.listdata = this.sourceList.data;
          this.graphService.showLoader = false;
          console.log("checking",respArray);
        }
      )
  }
  getProjectType() {
    this.graphService.showLoader=true;
    this.projectData.projectTypeData('projectTypes').subscribe((respArray) => {
      this.ProjectTypeList = respArray;
      this.graphService.showLoader=false;

    });
  }

  fetchSouceLocationList() {
    this.projectService.getSourceLocation('sourceLocationType', 'all')
      .subscribe(
        respArray => {
          this.sourceLocation = respArray;
          console.log(this.sourceLocation)

        }
      )
  }

  // @ select clicked Data Source # # # # # # # 
  selectSource(source: SourceData, e: Event) {

     this._apiSubscription = this.pipelineData.getSourceList('source', source.source_id, localStorage.getItem('uid')!)
     .subscribe(
       respArray => {
        console.log('file',respArray);
        
       this.source_stored_location=respArray.data[0].source_stored_location_id
       this.file_type_name=respArray.data[0].processing_type_name


      //  alert(this.source_stored_location)
      if(this.route_PRID=="tab")
      {
        this.NextVisibleFlag=true;
      }
      else
      {
        this.NextVisibleFlag=false;
      }
    this.source_id_sec=source.source_stored_location_id
    localStorage.setItem('source_id_session', String(source.source_id));
    localStorage.setItem('source_location_session_id',this.source_stored_location );
    localStorage.setItem('processing_type_name',this.file_type_name );
    // alert(this.file_type_name)
    // alert(this.source_stored_location)

    });
    
 
    if (!this.isSourceAttatched(source.source_id)) {
      this.selectedDataSource = {};
      let ele = (<HTMLElement>e.target).parentNode;
      this.selectedDataSource = source;

      this.projectService.mapProjectSource("projectSourceMap", parseInt(localStorage.getItem("pr_id")!), source.source_id, localStorage.getItem("uid")!)
        .subscribe((res) => {
          console.log("Mapping Source to Project by id:: ", res);
        }, err => {
          console.log("Error in Mapping source to project", err);
        })

      // console.log(ele);
    }
  }

  // @ Deleting Source From Project # # # # # # # # 
  openDeleteDialog(source_id: number) {
    this.sourceIdToBeDeleted = source_id;
    this.renderer.setAttribute(this.deleteModal.nativeElement, "data-sourceid", source_id.toString());
    this.renderer.addClass(this.deleteModal.nativeElement, "modalOpen");
    setTimeout(() => {
      this.renderer.addClass(this.deleteModal.nativeElement, "show");
    }, 1);
  }

  deleteSourceFromProject(event: MouseEvent) {
    this.projectService.deleteProjectSource("deleteSourceFromProject", parseInt(localStorage.getItem("pr_id")!), this.sourceIdToBeDeleted)
      .subscribe((res) => {
        console.log(res);
        console.log("source id deleted just now", this.sourceIdToBeDeleted);
        // setTimeout(() => {
        //   this.ngOnInit();
        // }, 100);
      })
    this.closeDeleteDialog();
  }

  closeDeleteDialog() {
    setTimeout(() => {
      this.renderer.removeClass(this.deleteModal.nativeElement, "modalOpen");
    }, 100);
    this.renderer.removeClass(this.deleteModal.nativeElement, "show");
  }
  // @ Deleting Source From Project # # # # # # # # 

  // @ Checking Source Attached to current project or not
  // isSourceAttatched(source_id: number) {
  
  //   if (localStorage.getItem("pr_id") !== null) {
  //     let isAttatched = this.attatchedSources.includes(source_id, 0);
  //     return isAttatched;
  //   } else {
  //     return false;
  //   }
  //   // console.clear();
  //   // console.log(source_id, "source attatched", isAttatched);
  // }
  isSourceAttatched(source_id: number) {
    if (localStorage.getItem("pr_id") !== null) {
      if (Array.isArray(this.attatchedSources)) {
        let isAttatched = this.attatchedSources.includes(source_id, 0);
        return isAttatched;
      }

    }
    return false;
  }
  


  editDatasource(id: any) {
    this.router.navigate(['datasource-edit', id]);
  }

  ngOnDestroy(): void {
  this._apiSubscription.unsubscribe();
  }
  getProjectTypeflag(id:any){
  this.projectTypeFlag=id;
  }
  getProcessingTypeflag(name:any){
  this.ProcessingTypeflag=name;
 if(name=="FILE"){
  this.fileflag="FILE";

}
else if(name=="IMAGE"){
  this.fileflag="IMAGE";
}
else if (name=="VIDEO"){
  this.fileflag="VIDEO"
}
else{
  this.fileflag="RTSP";
}
  }

  onFileSelection(e: Event) {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
  
    if (file) {
      const allowedExtensions = ['zip', 'png', 'mp4'];
      const fileExtension = file.name.split('.').pop();
      const lowerCaseExtension = fileExtension!.toLowerCase();
  
      if (allowedExtensions.includes(lowerCaseExtension)) {
        // Valid file selected
        this.fileName = file.name;
        this.fileerrorShow = false;
        this.formData.append('file', file, file.name);
      } else {
        this.fileerrorShow = true;
        this.fileName = '';
  
        // Clear the chosen file input
        target.value = '';
  
        if (this.fileflag === "FILE" && !allowedExtensions.includes('zip')) {
          alert("Please upload only ZIP files.");
        } else if (this.fileflag === "IMAGE" && !allowedExtensions.includes('png')) {
          alert("Please upload only PNG files.");
        } else if (this.fileflag === "VIDEO" && !allowedExtensions.includes('mp4')) {
          alert("Please upload only MP4 files.");
        } else {
          alert("Invalid file type selected.");
        }
      }
    } else {
      // No file chosen
      this.fileName = '';
      this.fileerrorShow = false;
    }
  }
  

  // onFileSelection(e: Event) {
  //   const target = e.target as HTMLInputElement;
  //   const file: File = (target.files as FileList)[0];
  //   this.fileName = file.name;
  //   this.fileerrorShow=false;
  //   // this.formData.append('filename', this.fileName);
  //   this.formData.append('file', file, file.name);

  //   // this.uploadSourceFile();
  // }
  // onFileSelection(e: Event) {
  //   const target = e.target as HTMLInputElement;
  //   const file: File = (target.files as FileList)[0];
    
  //   if (file) {
  //     const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
      
  //     if (fileSizeInMB >= 100) {
  //       this.fileName = file.name;
  //       this.fileerrorShow = false;
  //       this.formData.append('file', file, file.name);
        
  //       // Now, you can proceed with uploading the file or performing any other actions.
  //       // this.uploadSourceFile();
  //     } else {
  //       // Display an error message because the file size is less than 100MB
  //       this.fileerrorShow = true;

  //     }
  //   }
  // }
  
    
 
  // uploadSourceFile() {
  //   this.projectService.uploadSourceFile
  //   ('sourceFileUpload', this.formData)
  //      .subscribe((respArray) => {
  //        this.sourceUpload= respArray;
  //        console.log(this.sourceUpload)
  //      });
 //  }

 nexttype(){
  this.graphService.showLoader=true;
  this.projectTypeFlag= localStorage.getItem("pr_type")
   localStorage.setItem('pr_id', this.project_id);
  this.projectService.getProjectType('projecttype', this.projectTypeFlag)
  .subscribe(
    respArray => {
      this.projecttype = respArray.data[0];
      this.projecttype=this.projecttype.operation_type_name
      this.graphService.showLoader=false;
      if(this.projecttype=="Training")
{
  this.router.navigate(['config-model']);
}
else{ 
  this.router.navigate(['config-model']);
}
    })
    
 }
 errorMessages = {
  required: 'This field is Required',
  maxLength: 'max length 10',
  minLength: 'minimum length is 5'
 }
 errorMessage = '';
}
