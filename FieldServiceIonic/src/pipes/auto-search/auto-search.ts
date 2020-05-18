import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the AutoSearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'autoSearch',
  pure:false
})
export class AutoSearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], terms: any): any[] {
        if (!items) return [];
        if (!terms){
          items.forEach((item) => item.checked = false);
          return items;
        } 
        

        let data = items.filter((option) => {
          if(option.LookupValue.toString().toLowerCase().indexOf(terms.toLowerCase()) > -1){
           return option;
         }
       })

       return data;
  }
}
