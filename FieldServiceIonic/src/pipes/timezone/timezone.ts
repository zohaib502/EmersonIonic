import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

/**
 * Generated class for the TimezonePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timezone',
})
export class TimezonePipe implements PipeTransform {
  transform(value: Array<string>, args?: any) {
    let format = args.hasTime ? "DD-MMM-YYYY HH:mm" : "DD-MMM-YYYY";
    if (value.length > 1 && args.preferredTZ) {
      if (args.preferredTZ == args.userPreferredTZ) {
        //10/11/2018 kamal : change Start Time according to timezone
        return moment(value).tz(args.userPreferredTZ).format(format);
      } else {
        //let convertedDateTime = moment.tz(value, "YYYY-MM-DD HH:mm", args.userPreferredTZ).format();
        //10/11/2018 kamal : no need to convert time as it as already in UTC format. Directly Convert as selected in user preference
        return moment(value).tz(args.preferredTZ).format(format);
      }
    }
    else {
      return moment(value).format(format);
    }
  }
}
