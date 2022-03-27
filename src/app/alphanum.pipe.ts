import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'alphanum'
})
export class AlphanumPipe implements PipeTransform {

  transform(value: string): string {
    if (value === undefined || value === null) {
      return value
    }

    return value.replace(/[^A-Za-z0-9]{1}/g, '_')
  }

}
