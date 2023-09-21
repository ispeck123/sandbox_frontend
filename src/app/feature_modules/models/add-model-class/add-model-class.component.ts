import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { AttrDataTypeConfig, AttrDataTypeList, ModelListConfig } from 'src/app/data-models/model';
import { AttrRespConfig, AttrRespData, AttrValRespConfig, ClassListConfig, ClassRespConfig } from 'src/app/data-models/pipeline-model';
import { ClassUiChangerService } from 'src/app/services/class-ui-changer.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { GraphService } from 'src/app/services/graph.service';
import { ModelDataService } from 'src/app/services/model-data.service';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-add-model-class',
  templateUrl: './add-model-class.component.html',
  styleUrls: ['./add-model-class.component.css']
})
export class AddModelClassComponent implements OnInit {
  @ViewChild('closebutton') closebutton!: { nativeElement: { click: () => void; }; };
  @ViewChild('closebutton1') closebutton1!: { nativeElement: { click: () => void; }; };
  @ViewChild('closebutton2') closebutton2!: { nativeElement: { click: () => void; }; };
  @ViewChild('closebutton3') closebutton3!: { nativeElement: { click: () => void; }; };
  @ViewChild('closebutton4') closebutton4!: { nativeElement: { click: () => void; }; };
  @ViewChild('closebutton5') closebutton5!: { nativeElement: { click: () => void; }; };
  @ViewChild('closebutton6') closebutton6!: { nativeElement: { click: () => void; }; };
  @ViewChild("moreClassOptionsBtn") btnn!: MatMenuTrigger;

  listdata: any = [];

  data: [] = [];
  edata: [] = [];
  attrdata!: any ;
  classdata: any = [];
  attrvaldata: any = [];
  classAddResp!: ClassRespConfig;
  classListData!: ClassListConfig;
  attrResp!: AttrRespConfig;
  attrValResp!: AttrValRespConfig;
  modelList!: ModelListConfig;
  attrList!: ClassListConfig;
  attrDataType!: AttrDataTypeConfig;
  selected!: boolean;
  attrDisable: boolean = true;
  username!: string;
  mname!: any;
  model_id!: number;
  class_id!: number;
  attrValueId!: number;
  matchipControl!: MatChip;
  isChip: boolean = false;
  heading = '';
  nextUrl = '';
  hideBtn: boolean = false;
  routeChecker: boolean = false;
  cId: any;
  dType: any;
  deleteval: any;
  resp: any;

  currentAttributeField!: HTMLElement;
  selectedAttrValField!: HTMLElement

  constructor(private pipelineData: PipelineDataService,
    private modelDataService: ModelDataService,
    private ref: ChangeDetectorRef,
    private classChangeUi: ClassUiChangerService,
    private getToken: GetTokenService,
    private graphService: GraphService,
    public audit: AuditTrailService, 
    @Inject(DOCUMENT) document: Document
  ) { }

  ngOnInit(): void {
    this.FecthAll();

    if (localStorage.getItem('mname')) {
      this.mname = localStorage.getItem('mname');
      let id = this.getToken.getModelId();
      this.model_id = id;
      console.log(this.mname, id);
      this.getClassData(id);
    }

  }

  FecthAll() {
    this.getUrlData();
    this.fetchModelListData();
    this.getAttrDataType();
    //this.getClassData();
    this.username = this.getToken.getUser_name();
    this.audit.addUrlAudit('userAuditLog');
  }
  getUrlData() {
    this.routeChecker = this.classChangeUi.getClassUi();
    console.log(this.routeChecker);
    if (this.routeChecker) {
      this.heading = 'Create Model Class';
      this.nextUrl = '/model-verify';
      this.hideBtn = true;
    } else {
      this.heading = 'Choose Model Class';
      this.nextUrl = '/model-verify'
      this.hideBtn = false;
    }
  }
  addClass = new FormGroup({
    class_name: new FormControl(''),
    created_by: new FormControl(''),
    model_id: new FormControl(''),
    modified_by: new FormControl('')

  })

  editClass = new FormGroup({
    class_name: new FormControl(''),
    class_id: new FormControl(''),
    modified_by: new FormControl('')

  })

  addAttribute = new FormGroup({
    class_attribute_name: new FormControl(''),
    class_attribute_datatype_id: new FormControl(''),
    created_by: new FormControl(''),
    modified_by: new FormControl(''),
    class_id: new FormControl('')


  })


  addAttributeVal = new FormGroup({
    class_attribute_value_name: new FormControl(''),
    created_by: new FormControl(''),
    modified_by: new FormControl(''),
    class_attribute_id: new FormControl('')
  })

  // @ Adding new class 
  onSubmitClass() {
    this.addClass.patchValue({ model_id: this.model_id });
    this.addClass.patchValue({ created_by: this.username });

    this.data = this.addClass.value;
    console.clear();
    console.log(this.addClass);
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Create Model Class',
      Effect: ' Model Class Created Successfully',
      Status: 1,
    }
    console.log("this data:: ", this.data);
    if (this.addClass.value.class_name != '') {
      this.pipelineData.saveClass('createClass', this.data)
        .subscribe(
          respArray => {
            this.classAddResp = respArray;

            this.closebutton.nativeElement.click();
            if (this.classAddResp.message == 'success' || this.classAddResp.message == 'Success') {
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  console.log(respArray)
                }
              )
            }
            else {
              payload.Effect = " Model Class creation Failed";
              payload.Status = 0;
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  console.log(respArray)
                }
              )

            }
            this.getClassData(this.model_id);
            console.log(this.classAddResp);
            this.addClass.reset();
          }
        )
    }
    else {
      alert("Please provide data")
    }

    console.log(this.data);
  }

  onSubmitAttr() {
    this.addAttribute.patchValue({ class_id: this.class_id });
    this.addAttribute.patchValue({ created_by: this.username });

    this.data = this.addAttribute.value;
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Create Class Attribute',
      Effect: 'Class Attribute Created Successfully',
      Status: 1,
    }
    this.pipelineData.saveAttribute('createClassAttribute', this.data)
      .subscribe(
        respArray => {
          this.attrResp = respArray;
          this.closebutton5.nativeElement.click();

          // this.ref.detectChanges();

          // if(this.attrResp.message == "success"){
          //   alert('Attribute Added')
          //   const callCheck = true;
          //   this.getClassById(callCheck);
          // }
          if (this.addAttribute.value.class_attribute_name != '' && this.addAttribute.value.class_attribute_datatype_id != '') {
            if (this.attrResp.message == 'success' || this.attrResp.message == 'Success') {
              alert('Attribute Added');
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  console.log(respArray)
                }
              )
            }
            else {
              payload.Effect = "Class Attribute creation Failed";
              payload.Status = 0;
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  console.log(respArray)
                }
              )
            }
            console.log("------------------------ add modal class close");
          }
          this.closebutton1.nativeElement.click();
          this.getClassById(true);
          this.addAttribute.reset();
        }
      )
    console.log(this.data);
  }

  onSubmitAttrVal() {
    this.addAttributeVal.patchValue({ class_attribute_id: this.attrValueId });
    this.addAttributeVal.patchValue({ created_by: this.username });

    this.data = this.addAttributeVal.value;
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Add Attribute value',
      Effect: 'Attribute Value added successfully',
      Status: 1,
    }
    this.pipelineData.saveAttributeVal('createClassAttributeValue', this.data)
      .subscribe(
        respArray => {
          this.attrValResp = respArray;
          if (this.addAttributeVal.value.class_attribute_value_name != '') {
            if (this.attrValResp.message == "success" || this.attrValResp.message == "Success") {
              alert('Attribute Value Added');
              const callCheck = true;
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  console.log(respArray)
                }
              )

            }
            else {
              payload.Effect = "Attribute value addition failed";
              payload.Status = 0;
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  console.log(respArray)
                }
              )
            }
            this.closebutton2.nativeElement.click();
            this.getClassById(true);

          }
          this.addAttributeVal.reset();
        }
      )
    console.log(this.data);
  }


  getClassData(mdl_id: number) {
    console.log(mdl_id)
    //  this.data = this.addClass.value;
    this.pipelineData.getClassListByModel('classByModel', mdl_id)
      .subscribe(
        respArray => {
          this.classListData = respArray;
          //this.ref.detectChanges();
          console.log('cl', this.classListData);
          console.log('m', this.model_id);

        }
      )
  }

  getAttrDataType() {
    this.graphService.showLoader = true;
    this.modelDataService.getDataType('classAttributeDatatype')
      .subscribe(
        respArray => {
          this.attrDataType = respArray;
          this.graphService.showLoader = false;
          console.log('ad', this.attrDataType);

        }
      )
    console.log(this.data);
  }

  setAttrDataType(id: number) {

  }

  fetchModelListData() {
    this.modelDataService.getModelListData('model', 'all',localStorage.getItem('uid')!)
      .subscribe(
        respArray => {
          this.modelList = respArray;
          console.log(this.modelList.data);

        }
      )
  }

  chipManager(event: MouseEvent, id: number, select: MatChip, isChip: boolean) {
    // console.log("Event curr Target::", event.currentTarget, event.target);
    // console.log("Event curr Target::", event.currentTarget == event.target);
    event.stopImmediatePropagation();
    event.stopPropagation();

    // if(isChip){
    this.matchipControl = select;
    this.class_id = id;
    // this.attrDisable = false;
    // }

    if (event.target === event.currentTarget) {
      this.matchipControl.toggleSelected();
    }

    if (this.matchipControl.selected === true) {
      this.attrDisable = false;
    } else {
      this.attrDisable = true;
    }


    // this.matchipControl._handleClick(event);


    //  if(isChip){
    const callCheck = false;
    this.getClassById(callCheck);
    //  }

  }

  opendelete(cid: any, type: any) {
    this.cId = 0;
    this.dType = '';
    console.log(cid)
    this.cId = cid;
    this.dType = type;
  }


  deleteClass(id: any, type: any) {
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Delete Model ' + type,
      Effect: 'Model ' + type + ' Deleted Successfully',
      Status: 1,
    }
    console.log(id)


    if (type == 'Class') {
      this.deleteval = 'classDelete';
      this.pipelineData.delClass(this.deleteval, id).
        subscribe(
          respArray => {
            if (respArray.message == "success" || respArray.message == "Success") {
              alert(type + ' deleted successfully');
              this.closebutton6.nativeElement.click();
              this.getClassData(this.model_id);
              this.resp = "Success";
            }
          });
    }
    else {
      if (type == 'Class Attribute')
        this.deleteval = 'deleteClassAttribute';
      else if (type == 'Class Attribute Value')
        this.deleteval = 'deleteClassAttributeValue';

      this.pipelineData.delModeldata(this.deleteval, id)
        .subscribe(
          respArray => {
            if (respArray.message == "success" || respArray.message == "Success") {
              alert(type + ' deleted successfully');
              this.closebutton6.nativeElement.click();
              this.resp = "Success";
            }
          })
    }
    if (this.resp == "Success") {
      this.audit.addAudit('userAuditLog', payload).subscribe(
        respArray => {
          console.log(respArray)
        }
      )

    }
    else {
      payload.Effect = 'Model ' + type + ' Delete failed';
      payload.Status = 0;
      this.audit.addAudit('userAuditLog', payload).subscribe(
        respArray => {
          console.log(respArray)
        }
      )
    }
    this.getClassById(true);

  }
  onUpdateClass() {
    console.log("updating class ")
    this.edata = this.editClass.value;
    console.log('Update Model Class', this.edata)

    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Update Model Class',
      Effect: ' Model Class Updated Successfully',
      Status: 1,
    }
    if (this.editClass.value != "") {
      this.pipelineData.updateClass('updateClass', this.edata)
        .subscribe(
          respArray => {
            console.log(respArray)
            this.classAddResp = respArray;

            this.closebutton1.nativeElement.click();
            if (this.classAddResp.message == 'success' || this.classAddResp.message == 'Success') {
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  console.log(respArray)
                }
              )
            }
            else {
              payload.Effect = " Model Class Update Failed";
              payload.Status = 0;
              this.audit.addAudit('userAuditLog', payload).subscribe(
                respArray => {
                  console.log(respArray)
                }
              )

            }
            this.getClassData(this.model_id);
            console.log(this.classAddResp);
            this.editClass.reset();
          }
        )
    }
    else {
      alert("Please provide data")
    }

  }

  onUpdateAttr() {
    this.attrdata = this.addAttribute.value;
    console.log(this.attrdata.class_attribute_name);
    this.currentAttributeField.textContent = this.attrdata.class_attribute_name;
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Update Class Attribute',
      Effect: 'Class Attribute Updated Successfully',
      Status: 1,
    }
    if (this.addAttribute.value != "") {
      this.pipelineData.updateAttribute('updateClassAttribute', this.attrdata).
        subscribe(respArray => {
          this.attrResp = respArray
          this.closebutton3.nativeElement.click();
          if (this.attrResp.message == 'success' || this.attrResp.message == 'Success') {
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
          else {
            payload.Effect = "Class Attribute Update Failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
        })
    }
    else {
      alert("Please provide data")
    }

  }
  onUpdateAttrVal() {
    this.attrvaldata = this.addAttributeVal.value;
    console.log(this.attrvaldata);
     this.selectedAttrValField.textContent = this.attrvaldata.class_attribute_value_name;
     
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Update Class Attribute Value',
      Effect: 'Class Attribute Value Updated Successfully',
      Status: 1,
    }
    if (this.addAttributeVal.value != "") {
      this.pipelineData.updateAttributeVal('updateClassAttributeValue', this.attrvaldata).
        subscribe(respArray => {
          this.attrValResp = respArray;
          localStorage.setItem("currentAttributeValue", `${this.attrvaldata.class_attribute_value_name}|${this.attrvaldata.class_attribute_value_id}`)
          this.closebutton4.nativeElement.click();
          if (this.attrValResp.message == 'success' || this.attrValResp.message == 'Success') {
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
          else {
            payload.Effect = "Class Attribute Value Update Failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )

          }
        }, err => {
          console.log("error in updating attribute value", err);
        }, () => {
          console.clear();
          console.log(this.attrList.data);
          // Fetching class by id 
          this.pipelineData.getClassList("class", this.class_id).subscribe((res:ClassListConfig) => {
            // console.log("Selected Class Data ", res.data[0]);
            let currentAttributeValue = res.data[0].class_attributes.find((attr) => {
              return attr.attribute_values.find((attrVals) => {
                if (attrVals.class_attribute_id === this.attrvaldata.class_attribute_id && 
                    attrVals.class_attribute_value_id === this.attrvaldata.class_attribute_value_id) {
                      return attrVals.class_attribute_value_id;
                    } else {
                      return null;
                    }
              });
            });

            console.log("Current Attribute Value:: ", currentAttributeValue);

          });
          // Fetching class by id

        })
    }
    else {
      alert("Please provide data")
    }

  }
  getClassById(callCheck: boolean) {

    this.pipelineData.getClassList('class', this.class_id)
      .subscribe(
        respArr => {
          this.attrList = respArr;
          this.listdata = this.attrList.data;
          this.ref.detectChanges();
          console.log('atrl', this.attrList.data);
        }
      )
  }

  getClassDetail(id: any) {
    this.pipelineData.getClassList('class', id).
      subscribe(respArr => {
        this.classdata = respArr.data;
        this.editClass.patchValue({
          class_name: this.classdata[0].class_name,
          class_id: this.classdata[0].class_id,
          modified_by: this.getToken.getUser_name(),
        })
        console.log(this.classdata)
        console.log(this.classdata[0].class_name)
      })
  }

  attrValueIdGetter(attrid: number) {
    this.attrValueId = attrid;
    console.log('attrval', attrid)
  }

  getAttributeDetail(attval: any, selectedAttrFieldID: string) {
    this.addAttribute.addControl('class_attribute_id', new FormControl(''));
    console.log("Selected Attribute to Change:: ", selectedAttrFieldID);
    this.currentAttributeField = document.querySelector("#"+selectedAttrFieldID)!;
    console.log(this.currentAttributeField);

    this.addAttribute.patchValue({
      class_attribute_id: attval.class_attribute_id,
      class_attribute_name: attval.class_attribute_name,
      class_attribute_datatype_id: attval.class_attribute_datatype_id,
      class_id: this.class_id,
      modified_by: this.getToken.getUser_name(),
    });
    // currentAttrValField.textContent = "Charimsa";

  }
  getAttributeValDetail(attvals: any, attrValFieldID: string) {
    console.log(attvals)
    this.addAttributeVal.addControl('class_attribute_value_id', new FormControl(''));
    this.selectedAttrValField = document.querySelector("#"+attrValFieldID)!;

    this.addAttributeVal.patchValue({
      class_attribute_value_name: attvals.class_attribute_value_name,
      class_attribute_value_id: attvals.class_attribute_value_id,
      class_attribute_id: attvals.class_attribute_id,
      modified_by: this.getToken.getUser_name(),
    })

  }
  onMoreOptionsButtonClick(matChipSelector: MatChip) {
    // matChipSelector.selectionChange.subscribe((res) => {
    //   if (res.isUserInput) {
    //     if (matChipSelector.selected) {
    //       matChipSelector.select();
    //     } else {
    //       matChipSelector.deselect();
    //     }
    //   }
    //   // console.log("selection change listener::", res)
    // })
  }

  // getClassAttributesTemp () {
  //   this.getClassById
  //   this.getClassData(this.model_id)
  // }

}
