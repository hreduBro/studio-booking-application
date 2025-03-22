import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
    transform(time: string): string {
        if (!time) return '';

        // Split hour and minutes
        let [hour, minute] = time.split(':').map(Number);

        // Determine AM or PM
        let period = hour >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hour = hour % 12 || 12;

        return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
    }
}
