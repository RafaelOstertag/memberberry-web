import {Component, OnInit} from '@angular/core';
import {
  BerryPriority,
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
  existingTags: Array<string> = []
  displayedState: BerryState | undefined = BerryState.Open
  displayedPriority: BerryPriority | undefined = undefined;
  displayedTag: string | undefined = undefined;

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
    this.fetchBerries()
    this.fetchTags()
  }

  changePage(pageNumber: number) {
    this.pageNumber = pageNumber
    this.fetchBerries()
  }

  onBerryChanged() {
    this.fetchBerries()
  }

  changeDisplayedState(state: string) {
    if (state === undefined || state === "" || state === null) {
      this.displayedState = undefined
    } else if (state === "open") {
      this.displayedState = BerryState.Open
    } else {
      this.displayedState = BerryState.Closed
    }
    this.fetchBerries()
  }

  changeDisplayedPriority(priority: string) {
    if (priority === undefined || priority === "" || priority === null) {
      this.displayedPriority = undefined
    } else {
      switch (priority) {
        case "high":
          this.displayedPriority = BerryPriority.High
          break
        case "medium":
          this.displayedPriority = BerryPriority.Medium
          break
        case "low":
          this.displayedPriority = BerryPriority.Low
          break
      }
    }
    this.fetchBerries()
  }

  changeDisplayedTag(tag: string) {
    if (tag === undefined || tag === "" || tag === null) {
      this.displayedTag = undefined
    } else {
      this.displayedTag = tag
    }
    this.fetchBerries()
  }

  private fetchBerries() {
    const requestParameters = this.compileRequestParameters();

    this.berryV1Service.getBerries(requestParameters, "response")
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
      berryState: this.displayedState,
      berryPriority: this.displayedPriority,
      berryTag: this.displayedTag
    }

    return requestParameters;
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
