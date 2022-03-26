import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {
  Berry,
  BerryPriority,
  BerryState,
  BerryV1Service,
  BerryWithId,
  DeleteBerryRequestParams,
  GetBerryRequestParams,
  UpdateBerryRequestParams
} from "@memberberry-npm/memberberry-api-angular";
import {Observable, switchMap} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {prioritiesList} from "../priorities-list";
import {stateList} from "../state-list";

@Component({
  selector: 'app-update-berry',
  templateUrl: './update-berry.component.html',
  styleUrls: ['./update-berry.component.css']
})
export class UpdateBerryComponent implements OnInit {
  availableTags: Set<string> = new Set()
  berryWithId$!: Observable<BerryWithId>
  berryId: string | null = null
  submitError: string | undefined = undefined
  deleteInitiated: boolean = false

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly berryV1Service: BerryV1Service) {
  }

  get priorities(): Array<BerryPriority> {
    return prioritiesList
  }

  get states(): Array<BerryState> {
    return stateList
  }

  ngOnInit(): void {
    this.berryWithId$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.berryId = params.get('id')
        const requestParameter: GetBerryRequestParams = {
          berryId: this.berryId!
        }
        return this.berryV1Service.getBerry(requestParameter, "body")
      }))
    this.berryV1Service.getAllTags("body").subscribe({
      next: (response: Array<string>) => response.forEach(tag => this.availableTags.add(tag)),
      error: (response: HttpErrorResponse) => this.handleError(response)
    })
  }

  public onSubmit(berryForm: NgForm) {
    const berry: Berry = {
      description: berryForm.value.description,
      priority: berryForm.value.priority,
      state: berryForm.value.state,
      tags: berryForm.value.tags,
      title: berryForm.value.title
    }
    const requestParameters: UpdateBerryRequestParams = {
      berryId: this.berryId!,
      berry: berry
    }
    this.berryV1Service.updateBerry(requestParameters, "response").subscribe(
      {
        next: (response: HttpResponse<any>) => this.handleResponse(response),
        error: (response: HttpErrorResponse) => this.handleError(response)
      }
    )
  }

  deleteBerry() {
    if (!this.deleteInitiated) {
      setTimeout(() => this.deleteInitiated = false, 5000)
      this.deleteInitiated = true
      return
    }

    const requestParams: DeleteBerryRequestParams = {
      berryId: this.berryId!
    }
    this.berryV1Service.deleteBerry(requestParams).subscribe(() => {
      this.router.navigate(["berries"])
    })
  }

  addNewTag(value: string) {
    this.availableTags.add(value)
  }

  private handleResponse(response: HttpResponse<any>) {
    if (response.status === 204) {
      this.submitError = undefined
      this.router.navigate(["berries"])
    } else {
      this.submitError = "Error updating Berry (Http Status: " + response.status + ")"
    }
  }

  private handleError(response: HttpErrorResponse) {
    this.submitError = response.message
  }
}
