import {Component, OnInit} from '@angular/core';
import {
  BerryState,
  BerryV1Service,
  BerryWithId,
  GetBerriesRequestParams
} from "@memberberry-npm/memberberry-api-angular";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {ApiHeaders} from "../api-headers";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-berry-list',
  templateUrl: './berry-list.component.html',
  styleUrls: ['./berry-list.component.css']
})
export class BerryListComponent implements OnInit {
  berries: Array<BerryWithId> = []
  displayedState: BerryState | undefined = BerryState.Open
  firstPage: boolean = true
  lastPage: boolean = false
  // This starts at 1, but the API is zero based
  pageNumber: number = 1
  pageSize: number = 25
  totalPages: number = 0
  totalEntries: number = 0

  constructor(private readonly berryV1Service: BerryV1Service, private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.fetchBerries();
  }

  changePage(pageNumber: number) {
    this.pageNumber = pageNumber
    this.fetchBerries()
  }

  onBerryChanged() {
    this.fetchBerries()
  }

  changeDisplayedState(state: string) {
    if (state === undefined || state === "") {
      this.displayedState = undefined
    } else if (state === "open") {
      this.displayedState = BerryState.Open
    } else {
      this.displayedState = BerryState.Closed
    }
    this.fetchBerries()
  }

  private fetchBerries() {
    const requestParameters = this.compileRequestParameters();

    this.berryV1Service.getBerries(requestParameters, "response")
      .subscribe({
        next: (response: HttpResponse<Array<BerryWithId>>) => this.handleResponse(response),
        error: (response: HttpErrorResponse) => this.handleError(response)
      })
  }

  private handleResponse(response: HttpResponse<Array<BerryWithId>>): void {
    if (response.body) {
      this.berries = response.body
    }
    this.totalPages = parseInt(response.headers.get(ApiHeaders.TOTAL_PAGES) ?? "0")
    this.pageNumber = parseInt(response.headers.get(ApiHeaders.PAGE_INDEX) ?? "0") + 1
    this.pageSize = parseInt(response.headers.get(ApiHeaders.PAGE_SIZE) ?? "25")
    this.lastPage = (response.headers.get(ApiHeaders.LAST_PAGE) ?? "false") === "true"
    this.firstPage = (response.headers.get(ApiHeaders.FIRST_PAGE) ?? "false") === "true"
    this.totalEntries = parseInt((response.headers.get(ApiHeaders.TOTAL_ENTRIES) ?? "0"))
  }

  private handleError(response: HttpErrorResponse): void {

  }

  private compileRequestParameters() {
    const requestParameters: GetBerriesRequestParams = {
      pageSize: this.pageSize,
      pageIndex: this.pageNumber > 1 ? this.pageNumber - 1 : 0,
      berryState: this.displayedState
    }

    return requestParameters;
  }
}
