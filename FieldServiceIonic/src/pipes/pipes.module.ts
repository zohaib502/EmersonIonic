import { NgModule } from '@angular/core';
import { CustomDatePipe } from './custom-date/custom-date';
import { SearchPipe } from './search/search';
import { SortPipe } from './sort/sort';
import { TimezonePipe } from './timezone/timezone';
import { ListFilterPipe } from './list-filter/list-filter';
import { ShowActiveTimeZonePipe } from './showActiveTimeZonePipe/showActiveTimeZonePipe';
import { FilterUniquePipe } from './filter-unique/filter-unique';
import { AutoSearchPipe } from './auto-search/auto-search';
import { SortcountryPipe } from './sortcountry/sortcountry';
import { CustomTimePipe } from './custom-time/custom-time';

@NgModule({
    declarations: [
        CustomDatePipe,
        CustomTimePipe,
        SearchPipe,
        SortPipe,
        TimezonePipe,
    ListFilterPipe,
    ShowActiveTimeZonePipe,
    FilterUniquePipe,
    AutoSearchPipe,
    SortcountryPipe,

    ],
    imports: [],
    exports: [
        CustomDatePipe,
        SearchPipe,
        SortPipe,
        CustomTimePipe,
        TimezonePipe,
    ListFilterPipe,
    ShowActiveTimeZonePipe,
    FilterUniquePipe,
    AutoSearchPipe,
    SortcountryPipe,
   
    ]
})
export class PipesModule { }
