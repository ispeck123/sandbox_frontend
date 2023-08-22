import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
  OnInit,
  Output,
  Input,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ZoneRespConfig } from 'src/app/data-models/pipeline-model';
import { ZoneDataService } from 'src/app/services/zone-data.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { fabric } from "fabric";
import { ZoneCoordinates } from './zone-coords.model';
import { Router } from '@angular/router';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { saveAs } from 'file-saver';


@Component({
  selector: 'app-zone-creation',
  templateUrl: './zone-creation.component.html',
  styleUrls: ['./zone-creation.component.css'],
})
export class ZoneCreationComponent implements OnInit {
  @ViewChild('canvas')
  private canvas: ElementRef = {} as ElementRef;



  @ViewChild("zoneImageContainer") private zoneImageContainer!: ElementRef;

  snapshot!: any;
  bgSnapshot: any;

  colorCode: string = '#7fff00';
  lineWidth: number = 3;
  bgColor: string = '#ad78f5';
  bgOpacity: number = 1;
  isSaveSettings = true;
  isSaveBtn = true;
  isToolBarOpen = false;
  selectedTool: string = "";
  strokeWidth = 2;
  strokeColor = "#7fff00";
  source_id_session:any;

  isDrawing = false;
  rectanglePlaceholder!: any;
  tempPoly!: any;
  isFirst: boolean = true;
  isSettings: boolean = false;
  sourcesessionid:any;
  sourcesessionlocationid:any;
  processingtype:any
  
  selectedZoneImage!: string;
  updateZoneCoordinates: boolean = false;

  shapeDeleteButton!: boolean;
  b64: any;
  videoUrl:any;


  zoneImages = [
    "https://images.unsplash.com/photo-1514235986586-9b1e33c38fa3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", 
    "https://media.istockphoto.com/photos/aerial-view-of-car-parking-top-view-picture-id856857870?k=20&m=856857870&s=612x612&w=0&h=E7NUAsZTkUnWrQYVoUTnuM89kC8Fv6lgGgTpbpOZW-g=", 
    "https://thumbs.dreamstime.com/b/aerials-miami-beach-luxury-homes-water-156348627.jpg", 
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", 
    "https://thumbs.dreamstime.com/b/airport-parking-lot-cars-39330643.jpg", 
    "https://media.istockphoto.com/photos/dealer-new-cars-stock-picture-id480652712?k=20&m=480652712&s=612x612&w=0&h=dbyTkQ3-PJJMAlNAR2hGxPWX1ODvSJspuDsdvQmOKlI="
  ];
  
  zoneCoordinates!: [
    {
      polygons: ZoneCoordinates[], 
      rectangles: ZoneCoordinates[], 
      lines: ZoneCoordinates[], 
    }
  ]



  // zoneCoordinates = [
  //   {
  //     polygons: [
  //       // new ZoneCoordinates([ [100, 100], [400, 100], [500, 300], [300, 400], [100, 100] ], "red", 4, "20"),
  //       // new ZoneCoordinates([ [216, 32], [400, 100], [101, 100], [216, 32] ], "red", 7, "10"),
  //     ], 
  //     rectangles: [
  //         new ZoneCoordinates([[54, 297], [148, 297], [148, 372], [54, 372]], "white", 8, "95")
  //     ], 
  //     lines: [
  //       new ZoneCoordinates([[20, 30], [100, 120]], "red", 7, "5"), 
  //       new ZoneCoordinates([[200, 300], [100, 120]], "red", 7, "5"), 
  //     ]
      
  //   }
  // ];
  zoneResp!: ZoneRespConfig;
  lineHolder!: fabric.Line;
 

  constructor(
    private sanitizer: DomSanitizer,
    private renderer2: Renderer2,
    private getToken: GetTokenService,
    public audit: AuditTrailService,
    private zoneData: ZoneDataService, 
    private router: Router,
      private projectService: ProjectDataService,
  
    @Inject(DOCUMENT) private document: Document
  ) {
    
  }

  title = 'zone-detection-app';
  ctx!: any;
  canvasWidth = 1200; 
  canvasHeight = 500;

  @HostListener("click", ['$event']) onClickOutside (event: MouseEvent) {
    console.log((<HTMLElement>event.target).innerHTML === (<HTMLElement>this.canvas.nativeElement).innerHTML);
    if ((<HTMLElement>event.target).innerHTML === (<HTMLElement>this.canvas.nativeElement).innerHTML) {
      ;
    } else {
        // @ Completing Polygon creation # # # # # # # # # #  #
        if (this.tempPoly && this.isFirst === false) {
          this.tempPoly.points.push(new fabric.Point(this.tempPoly.firstPointX, this.tempPoly.firstPointY))
          this.ctx.add(new fabric.Polyline(this.tempPoly.points, {
            fill: this.bgColor, 
            stroke: this.strokeColor, 
            strokeWidth: this.strokeWidth, 
          }));
          this.ctx.remove(this.tempPoly);
          this.ctx.renderAll();
          this.tempPoly = {};
          this.isFirst = true;
      }
      console.log(this.selectedTool)
    }
  }
  ngOnInit(): void {
    this.sourcesessionid = localStorage.getItem("source_id_session");
    // alert(localStorage.getItem("source_id_session"))
    this.processingtype=localStorage.getItem("processing_type_name");
    // alert(localStorage.getItem("processing_type_name"))
    // this.sourcesessionid = localStorage.getItem("source_location_session_id");
  
    this.projectService.getSourceFile('source/file/view', this.sourcesessionid, localStorage.getItem("source_location_session_id"))
  .subscribe(
    respArrayBuffer => {
      console.log("file:", respArrayBuffer);
      if (this.processingtype == 'VIDEO') {
        const videoBlob = new Blob([respArrayBuffer], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
        this.selectedZoneImage = this.videoUrl;  // Set selectedZoneImage here for videos
        this.audit.addUrlAudit('userAuditLog');
        if (localStorage.getItem("urlForClass")?.includes("edit")) {
          this.updateZoneCoordinates = true;
        } else {
          this.updateZoneCoordinates = false;
        }

      } else {
        const fileBlob = new Blob([respArrayBuffer], { type: 'image/png' });
        const reader = new FileReader();

        reader.onloadend = () => {
          this.b64 = reader.result as string;
          console.log("Base64 data:", this.b64);
          this.selectedZoneImage = this.b64; // Set selectedZoneImage here for images
          this.audit.addUrlAudit('userAuditLog');
          if (localStorage.getItem("urlForClass")?.includes("edit")) {
            this.updateZoneCoordinates = true;
          } else {
            this.updateZoneCoordinates = false;
          }
        };
        reader.readAsDataURL(fileBlob);
      }
    },
    error => {
      console.error('Failed to retrieve the file:', error);
    }
  );

    
  
    
  
    // Rest of the code...

    
    // this.selectedZoneImage = this.zoneImages[0];
    // this.audit.addUrlAudit('userAuditLog');

    // if (localStorage.getItem("urlForClass")?.includes("edit")) {
    //   this.updateZoneCoordinates = true;
    // } else {
    //   this.updateZoneCoordinates = false;
    // }

    this.zoneCoordinates = [
      {
        polygons: [
          // new ZoneCoordinates([ [100, 100], [400, 100], [500, 300], [300, 400], [100, 100] ], "red", 4, "20"),
          // new ZoneCoordinates([ [216, 32], [400, 100], [101, 100], [216, 32] ], "red", 7, "10"),
        ], 
        rectangles: [
            // new ZoneCoordinates([[54, 297], [148, 297], [148, 372], [54, 372]], "white", 8, "95")
        ], 
        lines: [
          // new ZoneCoordinates([[20, 30], [100, 120]], "red", 7, "5"), 
          // new ZoneCoordinates([[200, 300], [200, 180]], "red", 7, "5"), 
        ]
        
      }
    ];

    if (this.zoneCoordinates[0].lines.length <= 0 && this.zoneCoordinates[0].polygons.length <= 0 && this.zoneCoordinates[0].rectangles.length <= 0) {
      console.log("it's not new zone or canvas....\n");
    } else {
      console.log("it's new zone or canvas....\n");
    }
  }
  

  
  
  
  // ngOnInit(): void {
  //   this.sourcesessionid= localStorage.getItem("source_id_session")
  //   this.sourcesessionlocationid= localStorage.getItem("source_location_session")
  //   // alert(this.sourcesessionlocationid)
  // //   this.projectService.getSourceFile('source/file/view', this.sourcesessionid,this.sourcesessionlocationid)
  // // .subscribe(
  // //   respArray => {

      
      
  // //   })
  // this.projectService.getSourceFile('source/file/view', this.sourcesessionid, this.sourcesessionlocationid)
  // .subscribe(
  //   respArrayBuffer => {
  //     const uint8Array = new Uint8Array();
  //     const fileBlob = new Blob([uint8Array], { type: 'application/octet-stream' });
  //     const fileUrl = URL.createObjectURL(fileBlob);
  //     window.open(fileUrl);
  //   },
  //   error => {
  //     console.error('Failed to retrieve the file:', error);
  //   }
  // );








  //   this.selectedZoneImage = this.zoneImages[0];
  //   this.audit.addUrlAudit('userAuditLog');

  //   if (localStorage.getItem("urlForClass")?.includes("edit")) {
  //     this.updateZoneCoordinates = true;
  //   } else {
  //     this.updateZoneCoordinates = false;
  //   }

  //   this.zoneCoordinates = [
  //     {
  //       polygons: [
  //         // new ZoneCoordinates([ [100, 100], [400, 100], [500, 300], [300, 400], [100, 100] ], "red", 4, "20"),
  //         // new ZoneCoordinates([ [216, 32], [400, 100], [101, 100], [216, 32] ], "red", 7, "10"),
  //       ], 
  //       rectangles: [
  //           // new ZoneCoordinates([[54, 297], [148, 297], [148, 372], [54, 372]], "white", 8, "95")
  //       ], 
  //       lines: [
  //         // new ZoneCoordinates([[20, 30], [100, 120]], "red", 7, "5"), 
  //         // new ZoneCoordinates([[200, 300], [200, 180]], "red", 7, "5"), 
  //       ]
        
  //     }
  //   ];

  //   if (this.zoneCoordinates[0].lines.length <= 0 && this.zoneCoordinates[0].polygons.length <= 0 && this.zoneCoordinates[0].rectangles.length <= 0) {
  //     console.log("it's not new zone or canvas....\n");
  //   } else {
  //     console.log("it's new zone or canvas....\n");
  //   }


  // }
  
  public ngAfterViewInit() {
    this.zoneImageContainer.nativeElement.setAttribute("src", this.selectedZoneImage);
    this.ctx = new fabric.Canvas("drawBoard", {
      width: this.canvasWidth, 
      height: this.canvasHeight, 
    });
    // fabric.Image.fromURL("/assets/images/traffic.jpg", (img) => {
    //   img.scaleToWidth(this.canvasWidth);
    //   img.scaleToHeight(this.canvasHeight);
    //   this.ctx.backgroundImage = img;
    //   this.ctx.renderAll();
    // });

    fabric.Object.prototype.transparentCorners = true;
    fabric.Object.prototype.cornerSize = 0;
    // fabric.Object.prototype.borderColor = "";
    fabric.Object.prototype.borderScaleFactor = 4;
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.hoverCursor = "normal";
    fabric.Object.prototype.setControlVisible("mtr", false);

    fabric.Object.prototype.lockMovementX = true;
    fabric.Object.prototype.lockMovementY = true;
    fabric.Object.prototype.lockScalingX = true;
    fabric.Object.prototype.lockScalingY = true;
    fabric.Object.prototype.lockRotation = true;
    fabric.Object.prototype.lockSkewingX = true;
    fabric.Object.prototype.lockSkewingY = true;


    this.ctx.on("mouse:down", (e: any) => this.startDrawing(e));
    this.ctx.on("mouse:move", (e: any) => this.drawing(e))
    this.ctx.on("mouse:up", (e: any) => this.stopDrawing(e));
    this.ctx.on("selection:created", (e:any) => {
      this.shapeDeleteButton = true;
    });

    this.ctx.on("selection:cleared", (e:any) => {
      this.shapeDeleteButton = false;
    });

    this.loadPreloadedShapes();
    
  }

  startFreeFormDrawing() {
    console.log();
    this.ctx.isDrawingMode = true;
    this.ctx.freeDrawingBrush.width = this.strokeWidth;
  }

  stopFreeFormDrawing() {
    this.ctx.isDrawingMode = false;
  }

  onToggleToolBar() {
    this.isToolBarOpen = !this.isToolBarOpen;
  }

  onSelectTool (toolName: string) {
    this.selectedTool = toolName;
    this.stopFreeFormDrawing();
    
    if (this.selectedTool === "randomline") {
      // this.startFreeFormDrawing();
    } else if (this.selectedTool === "rectangle") {
      this.stopFreeFormDrawing();
    } else if (this.selectedTool === "polygon") {
      this.stopFreeFormDrawing();
    }
    else {
    }


    // resetting temp polygon, adding new poly to canvas on the same points of temppoly
    // if (this.tempPoly && this.isFirst === false) {
    //   this.tempPoly.points.push(new fabric.Point(this.tempPoly.firstPointX, this.tempPoly.firstPointY))
    //   this.ctx.add(new fabric.Polyline(this.tempPoly.points, {
    //     fill: this.bgColor, 
    //     stroke: this.strokeColor, 
    //     strokeWidth: this.strokeWidth, 
    //   }));
    //   this.ctx.remove(this.tempPoly);
    //   this.ctx.renderAll();
    //   this.tempPoly = {};
    //   this.isFirst = true;
    // }
    console.log("selected :: ", this.selectedTool);
  }

startDrawing (e: any) {
  this.isDrawing = true;

  if(this.selectedTool === 'rectangle' || this.selectedTool === 'polygon'|| this.selectedTool === 'randomline') {
    this.isSaveBtn = false;
  }

  if (this.isDrawing) {

    if (this.selectedTool === "rectangle") {
      console.log("selected tool is ", this.selectedTool);
      console.log("in rectanglle creation", this.bgColor.concat((this.bgOpacity*10).toString()).toString());
        let alpha = (this.bgOpacity*9).toFixed();
        let hexa = this.bgColor.concat(alpha).concat(alpha);
        this.rectanglePlaceholder = new fabric.Rect({
        left: e.pointer.x, 
        top: e.pointer.y, 
        width: 1, 
        height: 1, 
        fill: hexa, 
        stroke: this.strokeColor, 
        strokeWidth: this.strokeWidth, 
        selectable: true
      });

      this.ctx.renderAll();
      this.ctx.add(this.rectanglePlaceholder);
      console.log(this.rectanglePlaceholder);
      this.rectanglePlaceholder.prevX = e.pointer.x;
      this.rectanglePlaceholder.prevY = e.pointer.y;
    } else if (this.selectedTool === "polygon") {
      this.drawPolygon(e);
    } else if (this.selectedTool === 'randomline') {
      this.lineHolder = new fabric.Line([e.pointer.x, e.pointer.y, e.pointer.x+1, e.pointer.y+1], {
        stroke: this.strokeColor, 
        strokeWidth: this.strokeWidth, 
      });
      this.ctx.add(this.lineHolder);
      this.ctx.renderAll();
    }
  }
}

  drawing(e: any) {
    if (this.isDrawing) {
      console.log("drawing with  ", this.selectedTool)
      console.log("now drawing...")
      if (this.selectedTool === "rectangle") {
        this.rectanglePlaceholder.set("width", e.pointer.x - this.rectanglePlaceholder.prevX);
        this.rectanglePlaceholder.set("height", e.pointer.y - this.rectanglePlaceholder.prevY);
        this.ctx.renderAll();
      } else if (this.selectedTool === "randomline") {
        this.lineHolder.set('x2', e.pointer.x);
        this.lineHolder.set('y2', e.pointer.y);
        this.ctx.renderAll();
      }
    }
  }
  
  stopDrawing(e: any) {
    this.isDrawing = false;
    fabric.Object.prototype.selectable = true;

    if (this.selectedTool === "rectangle") {
      this.selectedTool = "";
    } else if (this.selectedTool === "randomline") {
      this.selectedTool = "";
    }
    console.log("stopped drawing")
  }

  drawPolygon(e: any) {
    let alpha = (this.bgOpacity*9).toFixed();
    let hexa = this.bgColor.concat(alpha).concat(alpha);

    if (this.isFirst) {
      this.isFirst = false;
      this.tempPoly = new fabric.Polyline([
        {x: e.pointer.x, y: e.pointer.y}
      ], {
        fill: hexa, 
        stroke: this.strokeColor, 
        strokeWidth: this.strokeWidth, 
        objectCaching: false, 
      });
      this.tempPoly.firstPointX = e.pointer.x;
      this.tempPoly.firstPointY = e.pointer.y;

      this.ctx.add(this.tempPoly);
      this.ctx.renderAll();
    } else {
      this.tempPoly.points?.push(new fabric.Point(e.pointer.x, e.pointer.y));
      this.ctx.renderAll();
    }
  }



  onStrokeColorChange () {
    this.isSaveSettings = false;
  }

  onStrokeWidthChange () {
    this.isSaveSettings = false;
  }

  onBgColorChange () {
    this.isSaveSettings = false;
    
  }

  onBgOpacityChange () {
    this.isSaveSettings = false;
  }

  clearCanvas () {
    setTimeout(() => {
      this.selectedTool = "";
      this.isSaveBtn = true;
      let shapes = this.ctx.getObjects();
      shapes.forEach((shape:any) => {
        this.ctx.remove(shape);
      });
      this.zoneCoordinates[0].rectangles = [];
      this.zoneCoordinates[0].polygons = [];
      this.zoneCoordinates[0].lines = [];
    }, 100);
  }

  @HostListener('window:keyup', ['$event'])
  finishDrawingEvent(event: KeyboardEvent) {
    if (event.keyCode === 46) {
      this.ctx.remove(this.ctx.getActiveObject());
      this.isSaveBtn = false;
    }
  }

  saveSettings() {
    this.ctx.freeDrawingBrush.width = this.strokeWidth;
    this.ctx.freeDrawingBrush.color = this.strokeColor;
    let activeObj = this.ctx.getActiveObject();
    if (activeObj) {
      activeObj.set({
        fill: this.bgColor, 
        strokeWidth: this.strokeWidth, 
        opacity: this.bgOpacity, 
        stroke: this.strokeColor
      });
      this.ctx.renderAll();
    }

    // changing settings for most recent object ######################
    // let allShapes = this.ctx.getObjects();
    // let alpha = (this.bgOpacity*9).toFixed();
    // let hexa = this.bgColor.concat(alpha).concat(alpha);
    // console.log(hexa)
    // console.log(allShapes[allShapes.length - 1]);
    // let recentShape = allShapes[allShapes.length - 1];
    // if (allShapes.length >= 1) {
    //   console.log(recentShape.get("type"));
    //   if (recentShape.get("type") === 'path') {
    //     recentShape.set({
    //       stroke: this.strokeColor, 
    //       strokeWidth: this.strokeWidth,  
    //     });
    //   } else {
    //     allShapes[allShapes.length - 1].set({
    //       fill: hexa,   
    //       stroke: this.strokeColor, 
    //       strokeWidth: this.strokeWidth, 
    //     });
    //   }
    //   this.ctx.renderAll();
    // }

    this.isSaveSettings = !this.isSaveSettings;
  }

  saveZone() {
    // resetting @ this.zoneCoordinates to fill with new ones
    this.zoneCoordinates[0].rectangles = [];
    this.zoneCoordinates[0].polygons = [];
    this.zoneCoordinates[0].lines = [];

    const payload= {
      Id     : this.getToken.getUser_id(),
      Type   : 'Zone create',
      Effect : 'Zone created successfully',
      Status : 1,
    }

    
    let shapeObjsToSend = this.ctx.getObjects();

    // console.log(shapeObjsToSend);
    //  ############### COORDS CALCULATION AND Creating shapes on them ##################
    shapeObjsToSend.forEach((shape:any) => {
        if (shape.type === "rect") {
          let coordsTemp: {x: number, y:number}[] = shape.getCoords();
          let coordsArr: number[][] = [];
          for (let i = 0; i < coordsTemp.length; i++) {
            const x = Math.floor(coordsTemp[i].x);
            const y = Math.floor(coordsTemp[i].y);
            let singleCoord = new Array(x, y);
            // console.log(i, "::", [x, y]);
            coordsArr.push(singleCoord);
            // console.log("CoordsARRAY::", coordsArr);
          }
          this.zoneCoordinates[0].rectangles.push(new ZoneCoordinates(coordsArr, shape.fill, shape.strokeWidth, "50%"))
      } else if (shape.type === "polyline") {
        let tempCoords = shape.points;  
        let coordsArr: number[][] = [];
        for (let i = 0; i < tempCoords.length; i++) {
          const {x, y} = tempCoords[i];
          let singleCoord = new Array(Math.floor(x), Math.floor(y));
          coordsArr.push(singleCoord);
        }
        this.zoneCoordinates[0].polygons.push(new ZoneCoordinates(coordsArr, shape.fill, shape.strokeWidth, "50%"))
      } else if (shape.type === "line") {
        let x1 = Math.floor(shape.get("x1"));
        let y1 = Math.floor(shape.get("y1"));
        let x2 = Math.floor(shape.get("x2"));
        let y2 = Math.floor(shape.get("y2"));
        this.zoneCoordinates[0].lines.push(new ZoneCoordinates([[x1, y1], [x2, y2]], shape.fill, shape.strokeWidth, "50%"))
      }
    });
   
    console.log("ZONE COORDINATES::AFTER SAVE:", this.zoneCoordinates);

    // ############# saving zones in database ################
  //   let payloadToSend!: {
  //   zoneCoordinates: {
  //   polygons: ZoneCoordinates[],
  //   rectangles: ZoneCoordinates[],       
  //   }[],
  //   createdBy: string, 
  //   source_id: number, 
  //   file_id: number
  // };
  //   payloadToSend.zoneCoordinates = this.zoneCoordinates;
  //   payloadToSend.createdBy = this.getToken.getUser_name();
  //   payloadToSend.source_id = 6;
  //   payloadToSend.file_id = 29;

  // saving zone to the database $############$
    console.log("zone coordnates before sending it to database::", JSON.stringify(this.zoneCoordinates));

  
    if (
      this.zoneCoordinates[0].rectangles.length > 0 ||
      this.zoneCoordinates[0].polygons.length > 0 ||
      this.zoneCoordinates[0].lines.length > 0
    ) {
      if (this.updateZoneCoordinates) {
        // @ update zone API implementation
        this.zoneData.updateZoneCoordinates('updateZone', this.zoneCoordinates).subscribe((respArray) => {
          this.zoneResp = respArray;
          console.log(this.zoneResp);
          if(this.zoneResp.message=="success" || this.zoneResp.message=="Success"){
            payload.Effect = "Zone Created Successfully";
            payload.Status = 1;
            this.audit.addAudit('userAuditLog',payload).subscribe(
              respArray=>{
                console.log("Audit log", respArray)
              }
            )
          }
          else
          {
            payload.Effect="Zone creation failed";
            payload.Status=0;
            this.audit.addAudit('userAuditLog',payload).subscribe(
              respArray=>{
                console.log(respArray)
              }
            )
          }
        });
      } else {
        // @ create new or (first)zone API implementation
  
        this.zoneData.saveZone('createZone', this.zoneCoordinates).subscribe((respArray) => {
          this.zoneResp = respArray;
          console.log(this.zoneResp);
          if(this.zoneResp.message=="success" || this.zoneResp.message=="Success"){
            payload.Effect = "Zone Created Successfully";
            payload.Status = 1;
            // this.router.navigate(['select-model-pipeline']);
            this.router.navigate(['model-class']);
            // this.audit.addAudit('userAuditLog',payload).subscribe(
            //   respArray=>{
            //     console.log("Audit log", respArray)
            //   }
            // )
            alert('Zone created Success' )
          }
          
          else
          {
            payload.Effect="Zone creation failed";
            payload.Status=0;
            this.audit.addAudit('userAuditLog',payload).subscribe(
              respArray=>{
                console.log(respArray)
              }
            )
          }
        });
      }

    }
    else{
      // this.router.navigate(['select-model-pipeline']);
      this.router.navigate(['deploy-project']);
    }
  
  }

  loadPreloadedShapes () {
    // console.clear();
    // console.log("ZONE COORDINATESCONFIG:::", this.zoneCoordinates);
    this.zoneCoordinates.forEach((shapes:any) => {
      let shapeName = Object.getOwnPropertyNames(shapes);
      for (let i = 0; i < shapeName.length; i++) {
        const shapeNameName = shapeName[i];
        if (shapeNameName === "rectangles") {
          // ############### DRAWING Saved Rectangles here ###############
          let newRectangles = shapes[shapeNameName];
          for (let i = 0; i < newRectangles.length; i++) {
            const newRect = newRectangles[i];
            let newRectCoords = newRect.coordinates;
            let newLeft = newRectCoords[0][0];
            let newTop = newRectCoords[0][1];
            let newWidth = newRectCoords[1][0] - newRectCoords[0][0];
            let newHeight = newRectCoords[2][1] - newRectCoords[1][1];

            this.ctx.add(new fabric.Rect({
              left: newLeft, 
              top: newTop, 
              width: newWidth, 
              height: newHeight, 
              fill: newRect.color,
              strokeWidth: newRect.width,  
              opacity: parseInt(newRect.transparency)/100
            }));
            this.ctx.renderAll();
            // console.log("new rectangle would have", newLeft, newTop, newWidth, newHeight, newRect.color, newRect.strokeWidth);
          }
        } else if (shapeNameName === "polygons") {
          // ############### DRAWING Saved Polygons here ###############
          // console.log("Drawinf Polygons::", shapes[shapeNameName]);
          let savedPolygons = shapes[shapeNameName];
          for (let i = 0; i < savedPolygons.length; i++) {
            const savedPoly = savedPolygons[i];
            let newPolyCoords:{x: number, y: number}[] = [];
            for (let i = 0; i < savedPoly.coordinates.length; i++) {
              newPolyCoords.push({x: savedPoly.coordinates[i][0], y: savedPoly.coordinates[i][1]})
            }
            // console.log("\n\nNew Poly GONS", newPolyCoords);
            this.ctx.add(new fabric.Polyline(newPolyCoords, {
              fill: savedPoly.color, 
              strokeWidth: savedPoly.width, 
              opacity: parseInt(savedPoly.transparency)/100
            }));
            this.ctx.renderAll();
          }
        } else if (shapeNameName === "lines") {
          let lines = shapes[shapeNameName];
          // console.clear();
          console.log("lines::", lines);
          for (let i = 0; i < lines.length; i++) {
            
            const linePoints = lines[i].coordinates;
            console.log("Line points::", linePoints);
            let x1 = linePoints[0][0];
            let y1 = linePoints[0][1];
            let x2 = linePoints[1][0];
            let y2 = linePoints[1][1];
            this.ctx.add(new fabric.Line([x1, y1, x2, y2], {
              stroke: "red", 
              strokeWidth: 7
            }));
            this.ctx.renderAll();
            }
        }
      }
    });
  }

  deleteActiveShape () {
    this.ctx.remove(this.ctx.getActiveObject())
    // this.ctx.getActiveObject();
  }

  // loadZoneImage (imageUrl: string) {
  //   this.selectedZoneImage = imageUrl;
  // }
  loadZoneImage ( fileUrl: string) {
     this.selectedZoneImage = fileUrl;
  }
 
  propSettings() {
    this.isSettings = !this.isSettings;
  }
}
