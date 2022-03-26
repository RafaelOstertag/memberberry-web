import {Component, OnInit} from '@angular/core';
import {
  Berry,
  BerryPriority,
  BerryState,
  BerryV1Service,
  CreateBerryRequestParams
} from "@memberberry-npm/memberberry-api-angular";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {prioritiesList} from "../priorities-list";

@Component({
  selector: 'app-new-berry',
  templateUrl: './new-berry.component.html',
  styleUrls: ['./new-berry.component.css']
})
export class NewBerryComponent implements OnInit {
  availableTags: Set<string> = new Set()
  public berry: Berry = {
    title: "",
    description: undefined,
    priority: BerryPriority.Medium,
    state: BerryState.Open,
    tags: undefined
  }

  public submitError: string | undefined = undefined

  constructor(private readonly berryV1Service: BerryV1Service, private readonly router: Router) {
  }

  get priorities(): Array<BerryPriority> {
    return prioritiesList
  }

  ngOnInit(): void {
    this.berryV1Service.getAllTags("body").subscribe({
      next: (response: Array<string>) => response.forEach(tag => this.availableTags.add(tag)),
      error: (response: HttpErrorResponse) => this.handleError(response)
    })
  }

  public onSubmit() {
    const requestParameters: CreateBerryRequestParams = {
      berry: this.berry
    }
    this.berryV1Service.createBerry(requestParameters, "response").subscribe(
      {
        next: (response: HttpResponse<any>) => this.handleResponse(response),
        error: (response: HttpErrorResponse) => this.handleError(response)
      }
    )
  }

  addNewTag(value: string) {
    this.availableTags.add(value)
  }

  private handleResponse(response: HttpResponse<any>) {
    if (response.status === 201) {
      this.submitError = undefined
      this.router.navigate(["berries"])
    } else {
      this.submitError = "Error creating Berry (Http Status: " + response.status + ")"
    }
  }

  private handleError(response: HttpErrorResponse) {
    this.submitError = response.message
  }
}
