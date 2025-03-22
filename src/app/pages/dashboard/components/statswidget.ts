import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudioService } from '../../service/studio.service';
import { Skeleton } from 'primeng/skeleton';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, Skeleton],
    providers: [StudioService],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Studios</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <p-skeleton *ngIf="loader" width="5rem" styleClass="mb-2" />
                            {{ studios }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">since last visit</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Booking</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <p-skeleton *ngIf="loader" width="5rem" styleClass="mb-2" />
                            {{ bookings }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">Completed</span>
            </div>
        </div>
    `
})
export class StatsWidget {
    studios: number | undefined;
    bookings: number | undefined;
    loader: boolean = true

    constructor(private studioService: StudioService) {
        this.studioService.getAllData().subscribe((item) => {
            this.studios = item.Studios.length;
            this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]').length;
            this.loader = false;
        });
    }
}
