import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'search',
})
export class SearchPipe implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
  transform(items: any[], terms: any): any[] {
    //console.log(JSON.stringify(terms) + ' ' + JSON.stringify(items));
        if (!items) return [];
        if (!terms) return items;
        //console.log(terms);
        //console.log(items);
        let d = items.filter(it => {
            try {
                if (typeof terms === "object") {
                    let result = false;
                    for (let k in terms) {
                        //console.log(terms[k] + ' ' + it[k]);
                        if (!terms[k] || (terms[k] && it[k] && (terms.translator ? terms.translator.instant(it[k].toString()).toLowerCase().indexOf(terms[k].toString().toLowerCase()) : it[k].toString().toLowerCase().indexOf(terms[k].toString().toLowerCase())) > -1)) {
                            result = true;
                            break;
                        }
                    }
                    //console.log(result);
                    return result;
                } else {
                    return JSON.stringify(it).toLowerCase().includes(terms.toLowerCase());
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        });
        //console.log(d);
        return d;
    }
}
