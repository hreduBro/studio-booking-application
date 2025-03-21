import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Studio Booking  by
        <a href="https://hredoysen.netlify.app/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Hredoy Sen</a>
    </div>`
})
export class AppFooter {}
