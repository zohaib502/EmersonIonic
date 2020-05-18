import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortcountryPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sortbyname', //name: 'sortcountry',
})
export class SortcountryPipe implements PipeTransform {
  other:any;
  transform(array: Array<string>, args: string): Array<string> {
    if(!array){
      return;
    }else{
      //setTimeout(() => {
      array.sort((a: any, b: any) => {
        if (a.LookupValue == 'Other') {
          this.other = a;
          return 0;
        } else {
          if (a.LookupValue < b.LookupValue) {
            return -1;
          } else if (a.LookupValue > b.LookupValue) {
            return 1;
          } else {
            return 0;
          }
        }
      });
      //}, 1000);
      if(this.other){
        array.push(this.other)
      }
      return array;  
      } 
  }
}
