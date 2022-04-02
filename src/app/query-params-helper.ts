import {BerryPriority, BerryState, GetBerriesRequestParams} from "@memberberry-npm/memberberry-api-angular";
import {ParamMap} from "@angular/router";

const defaultPageSize: number = 10
const initialPageIndex: number = 0

export function defaultGetBerriesRequestParams(): GetBerriesRequestParams {
  return {
    pageSize: defaultPageSize,
    pageIndex: initialPageIndex,
    berryState: BerryState.Open,
    berryPriority: undefined,
    berryTag: undefined
  }
}


export function extractGetBerriesRequestParamsFromParamsMap(paramMap: ParamMap): GetBerriesRequestParams {
  return {
    berryOrder: stringToBerryOrder(paramMap.get("berryOrder")),
    berryOrderBy: stringToBerryOrderBy(paramMap.get("berryOrderBy")),
    berryPriority: stringToBerryPriority(paramMap.get("berryPriority")),
    berryState: stringToBerryState(paramMap.get("berryState")) || BerryState.Open,
    berryTag: stringToBerryTag(paramMap.get("berryTag")),
    pageIndex: paramMap.get('pageIndex') != null ? parseInt(paramMap.get("pageIndex")!) : initialPageIndex,
    pageSize: paramMap.get('pageSize') != null ? parseInt(paramMap.get("pageSize")!) : defaultPageSize,

  }
}

export function stringToBerryOrder(order: string | null | undefined): 'ascending' | 'descending' | undefined {
  switch (order) {
    case undefined:
    case null:
    case "":
      return undefined;
    case "descending":
    case "ascending":
      return order
    default:
      return undefined
  }
}

export function stringToBerryOrderBy(orderBy: string | null | undefined): 'created' | 'title' | 'priority' | 'state' | undefined {
  switch (orderBy) {
    case undefined:
    case null:
    case "":
      return undefined;
    case 'created':
    case 'title':
    case 'priority':
    case 'state':
      return orderBy
    default:
      return undefined
  }
}

export function stringToBerryState(state: string | null | undefined): BerryState | undefined {
  switch (state) {
    case undefined:
    case null:
    case "":
      return undefined
    case "open":
      return BerryState.Open
    case "closed":
      return BerryState.Closed
    default:
      return undefined
  }
}

export function stringToBerryPriority(priority: string | null | undefined): BerryPriority | undefined {
  switch (priority) {
    case undefined:
    case null:
    case "":
      return undefined
    case "high":
      return BerryPriority.High
    case "medium":
      return BerryPriority.Medium
    case "low":
      return BerryPriority.Low
    default:
      return undefined
  }
}

export function stringToBerryTag(tag: string | null | undefined) {
  switch (tag) {
    case undefined:
    case null:
    case "":
    case "undefined":
      return undefined
    default:
      return tag
  }
}
