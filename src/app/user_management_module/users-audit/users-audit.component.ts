import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuditTrailConfig, UserModelConfig, } from 'src/app/data-models/user.model';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Subscription } from 'rxjs';
import { GetTokenService } from 'src/app/services/get-token.service';
import { PageEvent } from "@angular/material/paginator/index"
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-users-audit',
  templateUrl: './users-audit.component.html',
  styleUrls: ['./users-audit.component.css'],
})
export class UsersAuditComponent implements OnInit, OnDestroy {
  userDetails!: UserModelConfig;
  auditTrail!: AuditTrailConfig;
  isFilter: boolean = false;
  startdate: number = 0;
  enddate!: number;
  filterName: string = 'Filter';
  isFilterUi: boolean = false;
  loadDownloadsContainer = false;

  noOfItemPerPage = 10;
  totalItems = 0;
  skipBy = 0;
  searchMode = false;
  searchKeywords!: string;
  pdfDonwloadUrl: {
    url: string
    response: string
  }[] = [];

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  private _apiSubscription!: Subscription;
  private _apiSubscription1!: Subscription;

  constructor(
    private auditService: AuditTrailService,
    private userData: UserDataService,
    private ref: ChangeDetectorRef,
    private graphService: GraphService,
    private getToken: GetTokenService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchAuditList();
    this.getUsers();
  }

  public fetchAuditList() {
    this.graphService.showLoader = true;
    this._apiSubscription = this.auditService.getAuditData('getUserAudits',
      this.noOfItemPerPage.toString(),
      this.skipBy.toString()).subscribe((respArray) => {
        this.auditTrail = respArray;
        this.totalItems = this.auditTrail.totalCount.count;
        this.graphService.showLoader = false;
        console.log("USer Audit Details:: ", this.auditTrail);
      });
  }

  filterForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    username: new FormControl(''),
    event: new FormControl('')
  });

  onSubmit() {
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Audit filter',
      Effect: 'Audit filtered',
      Status: 1,
    }

    this.getDate();
    this.filterForm.patchValue({
      fromdate: this.startdate,
      todate: this.enddate,
    });

    let data: [] = this.filterForm.value;
    this.auditService
      .getFilterData('filterAudits', this.noOfItemPerPage.toString(), this.skipBy.toString(), data)
      .subscribe((respArray) => {
        this.auditTrail = respArray;
        this.totalItems = this.auditTrail.totalCount.count;
        if (respArray.message == "success") {
          this.auditService.addAudit('userAuditLog', payload).subscribe(respArray => {
              console.log(respArray);
            });
        } else {
          payload.Effect = "Audit filter failed";
          payload.Status = 0;
          this.auditService.addAudit('userAuditLog', payload)
            .subscribe(respArray => {
              console.log(respArray)
            });
        }
        console.log('f', respArray);
      });
  }

  changeUserName(e: any) {
    if (e.isUserInput) {
      this.filterForm.patchValue({
        username: e.source.value,
      });
      this.onSubmit();
    }
  }

  getDate() {
    console.log(this.filterForm.get('fromdate')?.value)
    this.startdate = this.filterForm.get('fromdate')?.value ? this.convertDateToEpochTimeStamp(this.filterForm.get('fromdate')?.value) : 0;

    this.enddate = this.filterForm.get('startdate')?.value
      ? this.convertDateToEpochTimeStamp(this.filterForm.get('startdate')?.value)
      : this.convertDateToEpochTimeStamp(this.currentDate);

  }

  getSearchData(data: string) {
    this.searchKeywords = data;
    this.searchMode = true;
    this.auditService
      .auditSearch('searchAudits', this.noOfItemPerPage.toString(), this.skipBy.toString(), data)
      .subscribe((respArray) => {
        this.auditTrail = respArray;
        console.log('m', this.auditTrail);
      });
  }

  convertDateToEpochTimeStamp(dateString: Date) {
    console.log(dateString);
    return Math.round(dateString.getTime() / 1000);
  }

  getFilter() {
    console.log(this.isFilter)
    this.isFilter = true;
    this.isFilterUi = true;
    if (this.isFilter) {
      this.filterName = 'Apply Filter';
      this.onSubmit();
    }
  }

  getFilterParams(date?: number) {
    this.isFilter = !this.isFilter;
  }

  get currentDate() {
    return new Date();
  }

  public getUsers() {
    console.log('users');
    this._apiSubscription1 = this.userData.userListData('allUserList').subscribe((respArray) => {
      this.userDetails = respArray;
      console.log(this.userDetails);
    });
  }

  pageEvent(event: PageEvent) {
    if (this.isFilter) {
      console.log("Filter Mode:: ");
      this.filteredPages(event.pageSize.toString(), (event.pageIndex * this.noOfItemPerPage).toString());
    } else if (this.searchMode) {
      console.log("Paging in Search Mode");
      this.paginatedSearch(event.pageSize, event.pageIndex);
    } else {
      console.log("No filter Mode:: ");
      this.auditService.getAuditData('getUserAudits',
        event.pageSize.toString(),
        (event.pageIndex * this.noOfItemPerPage).toString()).subscribe((respArray) => {
          this.auditTrail = respArray;
          // this.graphService.showLoader = false;
          console.log("USer Audit Details:: ", this.auditTrail);
        });
    }
    console.log("Page Event:: ", event, event.length);
    // this.fetchAuditList('getUserAudits', event.pageSize, event.pageIndex)
  }

  paginatedSearch(noOfItemPerPage: number, skipBy: number) {
    this.auditService
      .auditSearch('searchAudits', noOfItemPerPage.toString(), (skipBy * noOfItemPerPage).toString(), this.searchKeywords)
      .subscribe((respArray) => {
        this.auditTrail = respArray;
        console.log('m', this.auditTrail);
      });
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
    this._apiSubscription1.unsubscribe();
  }

  filteredPages(noOfItems: string, skipBy: string) {
    let data = this.filterForm.value;
    this.auditService
      .getFilterData('filterAudits', noOfItems, skipBy, data)
      .subscribe((respArray) => {
        this.auditTrail = respArray;
        console.log('filtered Search:: ', respArray);
      });
  }

  removeFiltersAndSearch() {
    this.isFilter = false;
    this.searchKeywords = '';
    this.searchMode = false;
    this.isFilterUi = false;
    this.ngOnInit();
  }

  onExport() {
    this.searchKeywords;
    delete this.filterForm.value.event;
    let keyword = this.searchKeywords;
    let fromdate = this.filterForm.value.fromdate;
    let todate = this.filterForm.value.todate;
    let userid = this.filterForm.value.username;

    if (this.searchKeywords === undefined) {
      keyword = "";
    }

    if (this.filterForm.value.fromdate === undefined || this.filterForm.value.fromdate === "") {
      fromdate = 0;
    }

    if (this.filterForm.value.todate === undefined || this.filterForm.value.todate === "") {
      todate = 0;
    }

    if (this.filterForm.value.fromdate === undefined || this.filterForm.value.fromdate === "") {
      userid = "";
    }

    console.log("onExport:: ", keyword, fromdate, todate, userid);

    this.auditService.exportPDF(keyword, fromdate, todate, userid).subscribe((res) => {
      console.log("in Export pdf api:: ", res);
    })

  }

  async openDownloadContainer(downloadsWrapper: HTMLElement,) {
    if (this.loadDownloadsContainer) {
      this.loadDownloadsContainer = false;
    } else {
      this.loadDownloadsContainer = true;
    }
  }

}

// Download COntainer  # ## # # # # # # # # # # # # # ##  # # #
import servicedata from 'src/assets/service.json';

@Component({
  selector: 'downloads-container',
  templateUrl: "./donwloadPanel.component.html",
  styleUrls: ["./users-audit.component.css"]
})
export class DownloadsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('filesWrapperInner') filesWrapper!: ElementRef;
  @Output('closeDownloadsContainer') destroyEvent = new EventEmitter<Boolean>();
  API_PATH: string = servicedata.api_url;

  start = 777;
  OPENED = false;
  CLOSED = true;
  htmlWrapper!: HTMLElement;
  exportsList: any[] = [];

  constructor(private http: HttpClient, private auditService: AuditTrailService) {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.auditService.getExportsList().subscribe((res: any) => {
      this.exportsList = res.data;
      console.log("exports List:: ", res)
    });
    // console.log("Donwloads container loaded", this.filesWrapper);
    this.htmlWrapper = (<HTMLElement>this.filesWrapper.nativeElement);
  }

  open() {
    this.htmlWrapper.classList.remove("d-none");
    this.htmlWrapper.classList.add("d-block");
    this.CLOSED = false;
    this.OPENED = true;
  }

  close() {
    this.htmlWrapper.classList.remove("d-block");
    this.htmlWrapper.classList.add("d-none");
    this.CLOSED = true;
    this.OPENED = false;
  }

  ngOnDestroy(): void {
    console.log("donwloads container destroyed");
    console.log(this.exportsList);
  }

  sendCloseEvent() {
    this.destroyEvent.emit(true);
  }

}