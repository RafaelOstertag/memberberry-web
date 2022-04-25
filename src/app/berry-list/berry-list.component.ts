import {Component, OnInit} from '@angular/core';
import {BerryV1Service, BerryWithId, GetBerriesRequestParams} from "@rafaelostertag/memberberry-api-angular";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {ApiHeaders} from "../api-headers";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {
  defaultGetBerriesRequestParams,
  extractGetBerriesRequestParamsFromParamsMap,
  stringToBerryOrderBy,
  stringToBerryPriority,
  stringToBerryState,
  stringToBerryTag
} from "../query-params-helper";

@Component({
  selector: 'app-berry-list',
  templateUrl: './berry-list.component.html',
  styleUrls: ['./berry-list.component.css']
})
export class BerryListComponent implements OnInit {
  berries: Array<BerryWithId> = []
  existingTags: Array<string> = []
  getBerriesRequestParams: GetBerriesRequestParams

  firstPage: boolean = true
  lastPage: boolean = false
  totalPages: number = 0
  totalEntries: number = 0
  // We keep this separate, since it's easier to translate to page index which is zero based. Having one
  // property for the nbp-pagination and the request would not work easily
  selectedPage: number = 0

  constructor(private readonly berryV1Service: BerryV1Service, private readonly route: ActivatedRoute) {
    this.getBerriesRequestParams = defaultGetBerriesRequestParams()
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.getBerriesRequestParams = extractGetBerriesRequestParamsFromParamsMap(params)
        this.selectedPage = this.getBerriesRequestParams.pageIndex ? this.getBerriesRequestParams.pageIndex + 1 : 1
        this.fetchBerries()
        this.fetchTags()
      })
  }

  changePage(pageNumber: number) {
    this.selectedPage = pageNumber
    this.fetchBerries()
  }

  onBerryChanged() {
    this.fetchBerries()
  }

  changeDisplayedState(state: string) {
    this.getBerriesRequestParams.berryState = stringToBerryState(state)
    this.selectedPage = 1
    this.fetchBerries()
  }

  changeDisplayedPriority(priority: string) {
    this.getBerriesRequestParams.berryPriority = stringToBerryPriority(priority)
    this.selectedPage = 1
    this.fetchBerries()
  }

  changeDisplayedTag(tag: string) {
    this.getBerriesRequestParams.berryTag = stringToBerryTag(tag)
    this.selectedPage = 1
    this.fetchBerries()
  }

  changeOrderBy(fieldName: string) {
    this.getBerriesRequestParams.berryOrderBy = stringToBerryOrderBy(fieldName)
    this.fetchBerries()
  }

  changeAscending(checked: boolean) {
    if (checked) {
      this.getBerriesRequestParams.berryOrder = 'ascending'
    } else {
      this.getBerriesRequestParams.berryOrder = 'descending'
    }

    this.fetchBerries()
  }

  private fetchBerries() {
    this.getBerriesRequestParams.pageIndex = this.selectedPage > 1 ? this.selectedPage - 1 : 0
    this.berryV1Service.getBerries(this.getBerriesRequestParams, "response")
      .subscribe({
        next: (response: HttpResponse<Array<BerryWithId>>) => this.handleBerryResponse(response),
        error: (response: HttpErrorResponse) => this.handleError(response)
      })
  }

  private handleBerryResponse(response: HttpResponse<Array<BerryWithId>>): void {
    if (response.body) {
      this.berries = response.body
    }
    this.totalPages = parseInt(response.headers.get(ApiHeaders.TOTAL_PAGES) ?? "0")
    this.getBerriesRequestParams.pageIndex = parseInt(response.headers.get(ApiHeaders.PAGE_INDEX) ?? "0")
    this.getBerriesRequestParams.pageSize = parseInt(response.headers.get(ApiHeaders.PAGE_SIZE) ?? "25")
    this.lastPage = (response.headers.get(ApiHeaders.LAST_PAGE) ?? "false") === "true"
    this.firstPage = (response.headers.get(ApiHeaders.FIRST_PAGE) ?? "false") === "true"
    this.totalEntries = parseInt((response.headers.get(ApiHeaders.TOTAL_ENTRIES) ?? "0"))
  }

  private handleError(response: HttpErrorResponse): void {
    if (response.status === 404 && this.selectedPage > 1) {
      this.selectedPage--
      this.fetchBerries()
    }
  }

  private fetchTags() {
    this.berryV1Service.getAllTags("body")
      .subscribe({
        next: (body: Array<string>) => this.handleTagResponse(body),
        error: (response: HttpErrorResponse) => this.handleError(response)
      })
  }

  private handleTagResponse(body: Array<string>) {
    this.existingTags = body
  }
}
