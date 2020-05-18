import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'; 

/**
 * Generated class for the FilterUniquePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filterUnique',
  pure:false
})
export class FilterUniquePipe implements PipeTransform {
  transform(value: any): any{
    if(value!== undefined && value!== null){
        return _.uniqBy(value, 'LookupValue');
    }
    return value;
  }
}
