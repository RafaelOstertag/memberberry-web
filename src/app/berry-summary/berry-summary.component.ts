import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  Berry,
  BerryV1Service,
  BerryWithId,
  GetBerriesRequestParams,
  UpdateBerryRequestParams
} from "@memberberry-npm/memberberry-api-angular";

@Component({
  selector: 'app-berry-summary',
  templateUrl: './berry-summary.component.html',
  styleUrls: ['./berry-summary.component.css']
})
export class BerrySummaryComponent implements OnInit {
  @Input() berryWithId!: BerryWithId
  @Input() getBerryRequestParams: GetBerriesRequestParams | undefined = undefined

  @Output() changed = new EventEmitter<any>()

  constructor(private readonly berryV1Service: BerryV1Service) {
  }

  get isBerryClosed(): boolean {
    return this.berryWithId.state === "closed"
  }

  ngOnInit(): void {

  }

  flipState() {
    if (this.isBerryClosed) {
      this.berryWithId.state = "open"
    } else {
      this.berryWithId.state = "closed"
    }

    const berry: Berry = {
      description: this.berryWithId.description,
      priority: this.berryWithId.priority,
      state: this.berryWithId.state,
      tags: this.berryWithId.tags,
      title: this.berryWithId.title
    }

    const requestParams: UpdateBerryRequestParams = {
      berry: berry,
      berryId: this.berryWithId.id
    }

    this.berryV1Service.updateBerry(requestParams, "body").subscribe(() => {
      this.changed.emit()
    })

  }
}
