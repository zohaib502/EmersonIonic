import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

/**
 * Generated class for the CustomDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
    //transform(value: string, ...args) {
    //  return value.toLowerCase();
    //}

    transform(value: any) {
        return moment(value).format("DD-MMM-YYYY");
    }

}
