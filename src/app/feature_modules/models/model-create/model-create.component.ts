import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FrameworkListConfig,
  AlgoListConfig,
  ModelListConfig,
  AddModelRespConfig,
  ModelConfigType,
  ModelCategoryconfig,
  ArtifactConfig,
  ModalTypeConfig,
} from 'src/app/data-models/model';
import { ClassUiChangerService } from 'src/app/services/class-ui-changer.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { GraphService } from 'src/app/services/graph.service';
import { ModelDataService } from 'src/app/services/model-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.css'],
})
export class ModelCreateComponent implements OnInit {
  constructor(
    private modelDataService: ModelDataService,
    private classuichange: ClassUiChangerService,
    private getTk: GetTokenService,
    private route: ActivatedRoute,
    private graphService: GraphService,
    public audit: AuditTrailService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private cd: ChangeDetectorRef
  ) { }

  @ViewChild('uploadedFileNameDiplayer') uploadedFileField!: ElementRef;
  modelType!: ModalTypeConfig;
  frameworkList!: FrameworkListConfig;
  algoList!: AlgoListConfig;
  individualModel!: ModelListConfig;
  frameworkByID!: FrameworkListConfig;
  modelConfigType!: ModelConfigType;
  modelCategory!: ModelCategoryconfig;
  public href: string = '';
  username!: string;
  data: [] = [];
  fileName: string = '';
  modelResp!: AddModelRespConfig;
  artiFacts!: ArtifactConfig;
  formData = new FormData();
  modalId: number = 0;
  isNewModel = false;
  isCreate!: boolean;
  modalListById!: ModelListConfig;
  isMatch: string = '-1';
  disableNextBtn = false;
  fileCount = 0;
  modelcat:any;
  showSubmitButton = true;
  showNextButton = false;

  // framework_id        = new FormControl('');
  // algo_id              =  new FormControl('');
  // model_category_id   = new FormControl('');

  ngOnInit(): void {
    localStorage.removeItem('mname');
    console.log("%c /urlForClass=%s", "color: red; font-size: 24px", localStorage.getItem("urlForClass")?.includes("create"));
    if (localStorage.getItem('urlForClass')?.includes("create")) {
      this.disableNextBtn = true;
    }
    this.modalId = this.route.snapshot.params['id'];
    // console.log("ROUTER EDIT", !this.modalId, this.route.snapshot.params['id']);
    this.isCreate = !this.modalId;
    if (!this.isCreate) {
      // console.clear();
      // console.clear();
      // console.log("in update model");
      this.fetchModalById(this.modalId);
      this.loadUploadedFilesData();
      this.isNewModel = false;
      this.showNextButton = true;
    } else {
      // console.clear();
      // console.log("in create new model:::")
      this.isNewModel = true;
    }

    this.fetchFrameworkList();
    this.fetchAlgoList();
    this.fetchModelConfigType();
    this.fetchArtifactList();
    this.fetchModelCategory();
    this.username = this.getTk.getUser_name();
    this.fetchModelTypeList();
    this.audit.addUrlAudit('userAuditLog');

  }

  loadUploadedFilesData() {
    // console.clear()
    console.log("already uploaded data for model id", this.modalId, "this end");
  }


  frameWorkSelect(framework_id: number, event: any) {
    if (event.isUserInput) {
      this.fetchFrameworkByID(framework_id);
      // console.log(framework_id);
    }
  }

  fetchFrameworkList() {
    this.modelDataService
      .getFrameworkByID('framework', 'ALL')
      .subscribe((respArray) => {
        //this.frameworkList = respArray;
        // console.log(this.frameworkList.data);
      });
  }

  fetchAlgoList() {
    this.modelDataService
      .getAlgoByID('algorithm', 'ALL')
      .subscribe((respArray) => {
        this.algoList = respArray;
        // console.log(this.algoList.data);
      });
  }

  fetchFrameworkByID(framework_id: number) {
    this.modelDataService
      .getFrameworkByID('framework', framework_id)
      .subscribe((respArray) => {
        this.frameworkByID = respArray;
        // console.log(this.frameworkByID.data);
      });
  }

  fetchModelConfigType() {
    this.modelDataService
      .getModelConfigType('artifacts/all')
      .subscribe((respArray) => {
        this.modelConfigType = respArray;
        // // console.log("MODEL CONFIG TYPE", this.modelConfigType.data);
      });
  }

  fetchModelCategory() {
    this.modelDataService.getModelCategory('modelCategory/all')
      .subscribe((respArray) => {
        this.modelCategory = respArray;
        // console.log('cat',this.modelCategory);
      });
  }
  getModelType(id:any)
  {
    this.modelDataService
      .getModelType('GetmodelTypebymodelcat',id)
      .subscribe((respArray) => {
        this.modelType = respArray;
        // console.log('cat',this.modelCategory);
      });
  }
  getFramework(id:any)
  {
    this.modelDataService
    .getFramework('GetFramework',id)
    .subscribe((respArray) => {
      this.frameworkList = respArray;
      // console.log('cat',this.modelCategory);
    });
  }
  getFrameworklist(id:any)
  {
    this.modelDataService
    .getFrameworklist('GetFrameworklist',id)
    .subscribe((respArray) => {
      this.frameworkList = respArray;
      console.log(this.frameworkList)
      // console.log('cat',this.modelCategory);
    });
  }
  setUrlData() {
    this.classuichange.setClassUi();
  }

  addModel = new FormGroup({
    model_name: new FormControl(''),
    model_version: new FormControl(''),
    algo_id: new FormControl(''),
    framework_id: new FormControl(''),
    model_category_id: new FormControl(''),
    created_by: new FormControl(''),
    modified_by: new FormControl(''),
    is_registered: new FormControl(''),
    model_type: new FormControl(''),
    description: new FormControl('')
  });

  fetchModalById(id: number) {
    this.modelDataService.getModelListData('model', id)
      .subscribe(
        (respArray) => {
          this.modalListById = respArray;
          console.log('n', this.modalListById)
          this.addModel.addControl('model_id', new FormControl(''));
          this.addModel.patchValue({
            model_id: this.modalListById.data[0].model_id,
            model_name: this.modalListById.data[0].model_name,
            model_version: this.modalListById.data[0].model_version,
            algo_id: this.modalListById.data[0].algo_id,
            framework_id: this.modalListById.data[0].framework_id,
            model_type: this.modalListById.data[0].model_type,
            created_by: this.modalListById.data[0].created_by,
            modified_by: this.username,
            is_registered: this.modalListById.data[0].is_registered,
            description: this.modalListById.data[0].description

          })
          //  // console.log('n', this.addModel.value)
          localStorage.setItem('mname', this.addModel.value.model_name);
          localStorage.setItem('mid', this.addModel.value.model_id);
        }

      )
  }

  onSubmit() {

    this.data = this.addModel.value;
    const payload = {
      Id: this.getTk.getUser_id(),
      Type: 'Create Model',
      Effect: 'Model created Successfully',
      Status: 1,
    }

    if (this.isCreate) {
      if (this.addModel.value.model_name == "" || this.addModel.value.model_version == "" || this.addModel.value.model_type == "" ||
        this.addModel.value.model_category_id == "" || this.addModel.value.algo_id == "" || this.addModel.value.framework_id == ""  ) {
        alert("Please fill the required fields")
      }
      else {
        // console.log("This AdModel::", this.addModel);
        this.addModel.value.is_registered = true;
        this.data = this.addModel.value;
        // console.log(this.data);
        this.graphService.showLoader = true;
        this.modelDataService.saveModal('createModel', this.data)
          .subscribe((respArray) => {
            // console.log('eeeeee');
            this.modelResp = respArray;
            this.graphService.showLoader = false;
            // console.log( this.modelResp)
            // console.log( this.modelResp.data)
            if (this.modelResp.data.model_id != null) {
              this.isNewModel = false;
              this.showSubmitButton = false;
              this.showNextButton = true;
              // console.log(this.modelResp.data.model_id)
              localStorage.setItem('mid', this.modelResp.data.model_id.toString());
              alert(this.modelResp.message);
              // this.addModel.reset();
              // this.audit.addAudit('userAuditLog', payload).subscribe(
              //   respArray => {
              //     // console.log(respArray)
              //   }
              // )
              this.router.navigateByUrl('/model-list');
            }
            else {
              payload.Effect = "Model creation failed";
              payload.Status = 0;
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  // console.log(respArray)
                }
              )
            }
          });
      }

    }
    else {
      payload.Type = 'Update model';
      payload.Effect = 'Model updated successfully';
      // console.log(this.data);
      this.modelDataService
        .updateModal('updateModel', this.data)
        .subscribe((respArray) => {
          // console.log('eeeeee');
          this.modelResp = respArray;
          if (this.modelResp.data.model_id != null) {
            alert(this.modelResp.message);
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                // console.log(respArray)
              }
            )
          }
          else {
            payload.Effect = "Model update failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                // console.log(respArray)
              }
            )
          }
        });
    }

  }

  uploadInitiater(id: string) {
    this.document.getElementById(id)?.click();
  }

  addFiles = new FormGroup({});
  // file selection #####################
  onFileSelection(e: Event, artifact_id: number, filenameId: string, filenameDisplay: HTMLParagraphElement) {
    console.log("File selection: ", this.fileCount++);
    if (this.fileCount >= 3) {
      this.disableNextBtn = false;
    }
    // console.log("ARTIFACT#FILE::", artifact_id, filenameId);
    this.formData.delete("artifact_type_id");
    this.formData.delete("location");
    this.formData.delete("location");
    this.formData.delete("file");

    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.isMatch = filenameId;
    // console.log("isMatch::", this.isMatch)
    this.fileName = file.name;
    // console.log(this.fileName)
    // console.log(filenameId);
    const model_id = <string>localStorage.getItem('mid')?.toString();

    filenameDisplay.textContent = this.fileName;

    // console.log("modelTYpe", this.modelType);
    this.formData.append('model_id', model_id);
    // console.clear();
    console.log("Artifact type id:::", artifact_id.toString());
    this.formData.append('artifact_type_id', artifact_id.toString());
    this.formData.append('location', "default");
    this.formData.append('file', file, file.name);

    if (artifact_id === 4) {
      this.uploadWeightsData();
      console.log("uploading weights data___");
    } else {
      this.uploadFile();
    }

  }

  getExtensions(artifact: any) {

    // console.clear();
    // console.log(artifact);
    if (artifact === '4') {
      return '.pt,.pb,.pth,.weights,.tf,.h5,.caffe';
    }
    else {
      return '.cfg,.yaml,.ini';
    }
  }

  // sending http request to send file to the server ###########
  uploadFile() {
    const payload = {
      Id: this.getTk.getUser_id(),
      Type: 'File upload',
      Effect: 'File uploaded Successfully',
      Status: 1,
    }
    this.modelDataService
      .uploadConfigFile('artifactStore', this.formData)
      .subscribe((respArray) => {
        console.log('Response from Server:: ', respArray);
        this.addFiles.reset();
        if (respArray.message == "success" || respArray.message == "Success") {
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              console.log("Success::AUDIT: ", respArray)
            }
          )
        }
        else {
          payload.Effect = "File upload failed";
          payload.Status = 0;
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              console.log("Failed::AUDIT: ", respArray)
            }
          )
        }
      });
  }

  // @ upoad weights data # # # # # # #
  uploadWeightsData() {
    const payload = {
      Id: this.getTk.getUser_id(),
      Type: 'File upload',
      Effect: 'File uploaded Successfully',
      Status: 1,
    }
    this.modelDataService
      .uploadConfigFile('artifactWeightStore', this.formData)
      .subscribe((respArray) => {
        console.log('Response from Server:: ', respArray);
        this.addFiles.reset();
        if (respArray.message == "success" || respArray.message == "Success") {
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              console.log("Success::AUDIT: ", respArray)
            }
          )
        }
        else {
          payload.Effect = "File upload failed";
          payload.Status = 0;
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              console.log("AUDIT::Failed: ", respArray)
            }
          )
        }
      });
  }

  fetchArtifactList() {
    this.modelDataService.getArtifactList('artifacts', 'all')
      .subscribe(
        respArray => {
          this.artiFacts = respArray;
          this.cd.detectChanges();
          // console.log("Artifcats List::", this.artiFacts);
        }
      )
  }

  fetchModelTypeList() {
    this.graphService.showLoader = true;
    this.modelDataService.getModalType('modelType', 'all')
      .subscribe(
        respArray => {
          //this.modelType = respArray;
          console.log(this.modelType);
          this.graphService.showLoader = false;

        }
      )
  }


}
