import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ListFilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'listFilter',
})
export class ListFilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], terms: any): any[] {
    if (!items) return [];
    if (!terms) return items;
    let d = items.filter(item => {
      try {
        return item.COUNTRY == terms;
      } catch (error) {
        console.log(error);
        return false;
      }
    });
    return d;
  }
}
