import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'localDate',
})
export class LocalDateFormatPipe implements PipeTransform {
    transform(date: string, format: string = 'yyyy-MM-dd HH:mm'): any {
        var dt = new Date(date);

        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());


        return formatDate(dt, format, 'en-GB');
    }
}
