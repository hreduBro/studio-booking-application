import { Component, OnInit } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { Button, ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { Rating } from 'primeng/rating';
import { Slider } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-booking-list',
    standalone: true,
    imports: [AutoComplete, Button, ButtonDirective, IconField, Rating, Slider, TableModule, Tooltip, DatePipe],
    template: ` <div class="card">
        <div class="font-semibold text-xl mb-4">Booking List</div>
        <p-table
            #dt1
            [value]="viewData"
            dataKey="id"
            [rows]="10"
            [loading]="loading"
            [rowHover]="true"
            [showGridlines]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            [showCurrentPageReport]="true"
            [paginator]="true"
            [rowsPerPageOptions]="[10, 25, 50]"
            responsiveLayout="scroll"
        >
            <ng-template #header>
                <tr>
                    <th style="min-width: 12rem">
                        <div class="flex justify-between items-center">User Name
                            <p-columnFilter showAddButton="false" type="text" field="name" display="menu" />
                        </div>
                    </th>
                    <th style="min-width: 14rem">
                        <div class="flex justify-between items-center">Email
                            <p-columnFilter showAddButton="false" type="text" field="email" display="menu" />
                        </div>

                    </th>
                    <th style="min-width: 12rem">
                        <div class="flex justify-between items-center">Studio Name
                            <p-columnFilter showAddButton="false" type="text" field="name" display="menu" />
                        </div>
                    </th>
                    <th style="min-width: 10rem">
                        <div class="flex justify-between items-center">
                            Studio Type<p-columnFilter showAddButton="false" type="text" field="type" display="menu" />
                            </div>
                    </th>
                    <th style="min-width: 10rem">
                        <div class="flex justify-between items-center">
                            Location<p-columnFilter showAddButton="false" type="text" field="location" display="menu" />
                            </div>
                    </th>
                    <th style="min-width: 10rem">
                        <div class="flex justify-between items-center">Booking Date</div>
                    </th>
                    <th style="min-width: 10rem">
                        <div class="flex justify-between items-center">Booking Time</div>
                    </th>
                </tr>
            </ng-template>
            <ng-template #body let-studio>
                <tr>
                    <td>
                        {{ studio.name }}
                    </td>
                    <td>{{ studio.email }}</td>
                    <td>
                        {{ studio.studioName }}
                    </td>
                    <td>
                        {{ studio.type }}
                    </td>
                    <td>
                        {{ studio.location }}
                    </td>
                    <td>{{ studio.date | date: 'd MMMM y' }}</td>
                    <td>{{ studio.startTime | date: 'hh:mm a' }} - {{ studio.endTime | date: 'hh:mm a' }}</td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="8">No booking found.</td>
                </tr>
            </ng-template>
            <ng-template #loadingbody>
                <tr>
                    <td colspan="8">Loading booking data. Please wait.</td>
                </tr>
            </ng-template>
            <ng-template #paginatorleft>
                <button pButton label="Delete List" pTooltip="Reset Booking List" severity="danger" tooltipPosition="left" class="p-button-outlined mb-2" icon="pi pi-trash" (click)="clear()"></button>
            </ng-template>
        </p-table>
    </div>`
})
export class BookingList implements OnInit {
    viewData!: any[];
    loading = true;

    ngOnInit() {
        this.viewData = JSON.parse(localStorage.getItem('bookings') || '[]');
        this.loading = false;
    }

    clear(){
        localStorage.setItem('bookings', JSON.stringify([]));
        this.viewData = [];
    }
}
