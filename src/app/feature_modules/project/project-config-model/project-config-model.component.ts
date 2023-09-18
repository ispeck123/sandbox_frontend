import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { JsonEditorOptions } from '@maaxgr/ang-jsoneditor';
import { FormGroup } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { ModelDataService } from 'src/app/services/model-data.service';
import { MatChip } from '@angular/material/chips';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { Router } from '@angular/router';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-project-config-model',
  templateUrl: './project-config-model.component.html',
  styleUrls: ['./project-config-model.component.css'],
})
export class ProjectConfigModelComponent implements OnInit {
  configuredata!: any;
  configData!: any;
  nextUrl!: string;
  Object = Object;
  key: any;
  selected!: boolean;
  keyname: any;
  checkData: any ;
  valueArray: any[] = [];
  parsedResp: any[] = [];
  modelData: any = [];
  attrList: any = [];
  attrFile: any = [];
  datas:any;
  res:any;
  cdatas:any;
  arra:any;
  checkdata: boolean = false;
  selectedModelChip!: number;
  pr_type:any;
  projecttype:any;
  formData = new FormData();
  selectedFiles: any=[];
  projectsessionId:any;
  pipelinesessionid:any;
  modelsessionid:any;
  sourcesessionid:any;
  artifacttypesessionid:any=[];
  public editorOptions!: JsonEditorOptions;
  public initialData: any;
  public visibleData: any;
  showAtrributes: boolean=false;
  noFileChosen_0: boolean = true;
  noFileChosen_1: boolean = true;
  noFileChosen_2: boolean = true;
  proType:any;

  progress: { percentage: number } = { percentage: 0 };

  // public editorOptions!: JsonEditorOptions;
  form!: FormGroup;
  data: any;
  fileName: string = '';
  // @ViewChild(JsonEditorComponent, { static: false }) editor!: JsonEditorComponent;
  constructor(
    private projectService: ProjectDataService,
    private getTk: GetTokenService,
    private getToken: GetTokenService,private modelDataService: ModelDataService,
    public audit: AuditTrailService,private pipelineData: PipelineDataService,
    public router: Router, private graphService : GraphService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
  }

  ngOnInit(): void {
    this.pr_type= localStorage.getItem("pr_type")
    this.projectsessionId= localStorage.getItem("pro_id")
    this.pipelinesessionid= localStorage.getItem("pipeline_id")
    this.modelsessionid= localStorage.getItem("model_id")
    // alert(this.modelsessionid)
    this.sourcesessionid= localStorage.getItem("source_id_session")
    // alert(this.modelsessionid)
    this.projectService.getProjectType('projecttype', this.pr_type)
  .subscribe(
    respArray => {
      this.projecttype = respArray.data[0];
      this.projecttype=this.projecttype.operation_type_name
    })
    // this.getUrl();
    this.audit.addUrlAudit('userAuditLog');
    //  this.dataParser();
    //   this.data = this.configData.data;
    this.visibleData = this.data;
    this.getModels(this.pipelinesessionid);
    this.getAttributes();
    
    if(Object.keys({})== null){
      return;
    }
  }

  

  getModels(id:any){
    this.pipelineData.getPipeModelList('modelByPipeline', id)
    .subscribe(respArray =>{
      console.log(respArray.data);
      this.modelData = respArray.data;
      console.log(this.modelData[0].model_id);
      this.modelConfig(this.modelData[0].model_id);
    })
  }

  showJson(d: Event) {
    this.visibleData = d;
  }

  getUrl() {

    this.proType = this.getToken.getProjectType();
    if (this.proType == 'Training') {
    
      this.nextUrl = '/model-class';
    } else if (this.proType == 'Inference') {
      this.nextUrl = '/alert-rules';
    } else {
      this.nextUrl = '/deploy-project';
    }
  }


 
  dataParser(configData:any) {
 
     this.configuredata = configData

    // console.log(configData)
       let arr:any =[];
  
    if (Object.keys(this.configuredata).length === 1 && this.configuredata.server_id) 
    return;
   
      delete configData['EDITABLE1'];
    delete configData['ADDABLE2'];
    let name: string;
    let respArray = Object.keys(this.configuredata);
    let prop: any;
    let values: any[] = [];
    let i = 0;

    for (prop of respArray) {
      if (i <= 1) {
          this.parsedResp.push(configData[prop]);
        for (this.key of Object.keys(this.configuredata[prop])) {
          values.push(this.configuredata[prop][this.key].split(/[, ]+/));
        }
        this.valueArray.push(values);
         console.log('v', this.valueArray);
        let the: string;
       // arr.push((the = 'that'));
        this.checkData = Object.keys(this.configuredata[prop]);
      }
      
      i++;
    }
    
 
  
  }

  modelConfig(id:any){
    this.selectedModelChip = id;
    this.showAtrributes=true;
    console.log(id,localStorage.getItem('pr_id'));
    let payload = {
      model_id : id
    }
    this.modelDataService.getArtifactByModel('artifactList',payload).
    subscribe(respArray =>{
      this.attrFile = respArray.data;
      this.attrFile = JSON.parse(this.attrFile)
      console.log(this.attrFile[0])

    })

  }

  openArtifact(data:any){
    console.log(data)
    console.log(this.attrFile[0].length)
     for(var i=0;i<this.attrFile[0].length;i++)
     {
      this.keyname = data.artifacts_type_name;
      if(data.artifacts_type_name == this.attrFile[0][i].artifacts_type_name)
      {
        let artficattype = this.attrFile[0][i].artifacts_type_name;
        this.modelDataService.getArtifactfile('artifactRetrieve',this.attrFile[0][i].artifacts_file_id,data.artifacts_type_id).
        subscribe(respArray =>{
          console.log(respArray.data)
          this.res = respArray.data;
        if(artficattype == 'Configuration')
          this.datas = this.res.Configuration;
        else if(artficattype == 'Measures')
          this.datas = this.res.Measures;
        else if(artficattype == 'Hyperparameter')
          this.datas = this.res.Hyperparameter;
        else if(artficattype == 'Threshold')
          this.datas = this.res.Threshold;
        else if(artficattype == 'Parameter')
          this.datas = this.res.Parameter;
        else if(artficattype == 'Operational_Parameter')
        this.datas = this.res.Operational_Parameter
      //    let former = this.attrFile[0][i].artifacts_type_name;
      if(this.datas == null){
        this.checkdata = true;
      }
      else
      {
        this.checkdata = false;
        this.dataParser(this.datas)
      }
         console.log(this.arra)

        });
      }

     }
  }
  g:boolean =false;
  getData(cdata:any,i:any){
    // this.g=true;
    console.log(cdata,i)
    this.cdatas = cdata[i];
  }
  getAttributes(){
    this.modelDataService.getArtifactList('artifacts','all')
    .subscribe(
      respArray => {
        this.attrList = respArray.data;
        if(this.projecttype=='Inference')
        {
       
          this.attrList = this.attrList.filter((m: { artifacts_type_name: string }) =>
          m.artifacts_type_name !== "Hyperparameter" && m.artifacts_type_name !== "Configuration"
        );

          console.log("Filter data",this.attrList);
        }
        else
        {
    
          this.attrList = respArray.data;
          console.log("Filter data",this.attrList);
          
        }
        this.myFunc(this.attrList)
        console.log("*************")
        console.log(this.attrList)
      }
    )
  }
  addFiles = new FormGroup({});
  


  myFunc(items: any){
      for(let i=0; i<items.length; i++){
        items[i]["isVisible"] = true;
      }
  }


  selectFiles(event: any, artifact_type_id: any, items: any) {
    if (event.target.files.length > 0) {
      this.artifacttypesessionid.push(artifact_type_id);
      this.selectedFiles.push(event.target.files[0]);
      items.isVisible = false;
  
      console.log("Selected files: ", this.selectedFiles);
    }
  }

 

  upload() {
  
    var protypecheck = localStorage.getItem('proTypeName');
    
    if (protypecheck == "Training") {
      if (this.selectedFiles.length !== 3) {
        alert('Please select 3 files to upload.');
        return;
      }
    } else if (protypecheck == "Inference") {
      if (this.selectedFiles.length !== 1) {
        alert('Please select files to upload.');
        return;
      }
    }
    
    // ... (other parts of your code)
    
    var formData = new FormData();
    
    formData.append('model_id', this.modelsessionid);
    formData.append('pipeline_id', this.pipelinesessionid);
    formData.append('project_id', this.projectsessionId);
    // formData.append('location', "Mongo");
    formData.append('sourceid', this.sourcesessionid);
    
    
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file', this.selectedFiles[i]);
      formData.append('artifact_type_id', this.artifacttypesessionid[i]);

      if (this.artifacttypesessionid[i] === 4) {
        formData.append('location', 'default');
      } else {
        formData.append('location', 'Mongo');
      }
  
    
      if (this.artifacttypesessionid[i]=== 4) {
        this.graphService.showLoader=true;
        this.modelDataService.uploadWeightFile('artifact/weight/store', formData).subscribe(
          (respArray) => {
            console.log('Response from Server:', respArray); // Log the response from the API
            
            if (respArray.msg === 'success' || respArray.msg === 'Success') {
              this.proType = this.getToken.getProjectType();
              this.graphService.showLoader=false;
              // alert(this.proType)
              this.addFiles.reset();
              if (this.proType == "Training") {
                this.router.navigateByUrl('/deploy-project');
              }
              if (this.proType == "Inference") {
                this.router.navigateByUrl('/zone-creation');
              } 
            } else {
              alert(respArray.msg);
            }
          },
          (error) => {
            console.error('Error during API call:', error); // Log API call errors
          }
        );
      } else {
        this.graphService.showLoader=true;
        // Call the default API for other artifact_type_id values
        this.modelDataService.uploadConfigFile('artifact/store', formData).subscribe(
          (respArray) => {
            console.log('Response from Server:', respArray); // Log the response from the API
            
            if (respArray.msg === 'success' || respArray.msg === 'Success') {
              this.proType = this.getToken.getProjectType();
              this.graphService.showLoader=false;
              // alert(this.proType)
              this.addFiles.reset();
              if (this.proType == "Training") {
                this.router.navigateByUrl('/deploy-project');
              }
              if (this.proType == "Inference") {
                this.router.navigateByUrl('/zone-creation');
              } 
            } else {
              alert(respArray.msg);
            }
          },
          (error) => {
            console.error('Error during API call:', error); // Log API call errors
          }
          
        );
      }

    }
    
    alert("File Upload Success");
  }
  
  
}
