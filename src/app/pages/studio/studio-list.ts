import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { Slider } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { Studio, StudioService } from '../service/studio.service';
import { Rating } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoComplete } from 'primeng/autocomplete';
import { Tooltip } from 'primeng/tooltip';
import { NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { Message } from 'primeng/message';
import { Avatar } from 'primeng/avatar';
import { Chip } from 'primeng/chip';
import { Divider } from 'primeng/divider';
import { TimeFormatPipe } from '../../layout/pipes/timeformat.pipe';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    selector: 'app-studio-list',
    standalone: true,
    imports: [
        ButtonDirective,
        DatePickerModule,
        IconField,
        InputText,
        TableModule,
        FormsModule,
        Rating,
        Button,
        Toast,
        Dialog,
        Slider,
        AutoComplete,
        Tooltip,
        ReactiveFormsModule,
        NgIf,
        Tag,
        Message,
        Avatar,
        Chip,
        UpperCasePipe,
        NgForOf,
        Divider,
        TimeFormatPipe
    ],
    template: `
        <div class="card">
            <p-toast />
            <div class="font-semibold text-xl mb-4">Studio List</div>
            <p-message severity="info">
                <ng-template #icon>
                    <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png"
                              shape="circle" />
                </ng-template>
                <span
                    class="ml-2">Use the filter icon on location coloumn to search for a location. (City/Araea/Radius)</span>
            </p-message>
            <p-table
                #dt1
                [value]="viewData"
                styleClass="mt-5"
                dataKey="id"
                [rows]="10"
                [loading]="loading"
                [scrollable]="true"
                scrollHeight="500px"
                [rowHover]="true"
                [showGridlines]="true"
                [paginator]="true"
                [rowsPerPageOptions]="[10, 25, 50]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                [showCurrentPageReport]="true"
            >
                <ng-template #header>
                    <tr>
                        <th style="min-width: 12rem">
                            <div class="flex justify-between items-center">Name</div>
                        </th>
                        <th style="min-width: 12rem">
                            <div class="flex justify-between items-center">Type</div>
                        </th>
                        <th style="min-width: 14rem">
                            <div class="flex justify-between items-center">
                                Location
                                <p-columnFilter field="representative" matchMode="in" display="menu"
                                                [showMatchModes]="false" [showOperator]="false" [showAddButton]="false"
                                                [showApplyButton]="false" [showClearButton]="false">
                                    <ng-template #header>
                                        <div class="px-3 pt-3 pb-0">
                                            <span class="font-bold"> Search by City/Area </span>
                                        </div>
                                    </ng-template>
                                    <ng-template #filter let-value1 let-filter="filterCallback">
                                        <p-autocomplete [style]="{ 'margin-left': '6px' }" [(ngModel)]="locationValue"
                                                        [suggestions]="items" (completeMethod)="onSearch($event)"
                                                        dropdown />

                                        <div class="px-3 pt-3 pb-0">
                                            <div class="flex flex-col">
                                                <span class="font-bold">Search by Radius</span>
                                                <small class="text-red-500 cursor-pointer" *ngIf="slider"
                                                       (click)="getUserLocation()">Try enabling your location access!
                                                    CLick here!</small>
                                            </div>
                                        </div>
                                        <p-slider [ngModel]="activityValues" [disabled]="slider" [range]="false"
                                                  (onChange)="distanceChange($event.value)" [max]="100" styleClass="m-3"
                                                  [style]="{ 'min-width': '12rem' }"></p-slider>
                                        <div class="flex items-center justify-between px-2">
                                            <span>{{ activityValues[0] === 100 ? 'All' : activityValues[0] + 'm' }}</span>
                                        </div>
                                    </ng-template>
                                    <ng-template #footer>
                                        <div>
                                            <p-button label="Apply" (onClick)="apply()" />
                                        </div>
                                    </ng-template>
                                </p-columnFilter>
                            </div>
                        </th>
                        <th style="min-width: 10rem">
                            <div class="flex justify-between items-center">Amenities List</div>
                        </th>
                        <th style="min-width: 10rem">
                            <div class="flex justify-between items-center">Price per hour</div>
                        </th>
                        <th style="min-width: 12rem">
                            <div class="flex justify-between items-center">Rating</div>
                        </th>
                        <th style="min-width: 2rem" pFrozenColumn [frozen]="true">
                            <div class="flex justify-between items-center">Action</div>
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-studio>
                    <tr>
                        <td>
                            {{ studio.Name }}
                        </td>
                        <td>
                            {{ studio.Type }}
                        </td>
                        <td>{{ studio.Location.Area }} , {{ studio.Location.Address }}</td>
                        <td>
                            <div class="flex flex-wrap gap-2">
                                <p-chip *ngFor="let amenity of studio.Amenities" class="!py-0 !pl-0 !pr-4">
                                <span
                                    class="bg-primary-emphasis text-primary-contrast rounded-full w-6 h-6 flex items-center justify-center">
                                    {{ amenity.charAt(0) | uppercase }}
                                </span>
                                    <span class="ml-2 font-medium">
                                    {{ amenity }}
                                </span>
                                </p-chip>
                            </div>
                        </td>
                        <td>
                            <span class="font-medium">{{ studio.Currency }}</span>
                            <p-tag severity="success" value="{{ studio.PricePerHour }}/-" />
                        </td>
                        <td>
                            <p-rating [(ngModel)]="studio.Rating" [readonly]="true" />
                        </td>
                        <td pFrozenColumn [frozen]='true'>
                            <p-button pTooltip="Book now" tooltipPosition="left" icon="pi pi-bookmark"
                                      (click)="bookStudio(studio)" severity="primary" rounded />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="8">No Studio found for this filter.</td>
                    </tr>
                </ng-template>
                <ng-template #loadingbody>
                    <tr>
                        <td colspan="8">Loading Studio data. Please wait.</td>
                    </tr>
                </ng-template>
                <ng-template #paginatorleft>
                    <button pButton label="Clear" pTooltip="Clear filter" tooltipPosition="left"
                            class="p-button-outlined mb-2" icon="pi pi-filter-slash" (click)="clear()"></button>
                </ng-template>
            </p-table>

            <p-dialog header="Booking Details" [resizable]="false" [modal]="true" [maximizable]="true" appendTo="body"
                      [(visible)]="dialogVisible" [style]="{ width: '30vw' }">
                <table class="w-full text-left">
                    <tbody>
                    <tr>
                        <td class="font-medium">Studio Name</td>
                        <td class="text-primary">{{ formData?.Name }}</td>
                    </tr>
                    <tr>
                        <td class="font-medium">Type</td>
                        <td class="text-primary">{{ formData?.Type }}</td>
                    </tr>
                    <tr>
                        <td class="font-medium">Location</td>
                        <td class="text-primary">{{ formData?.Location?.Address }}</td>
                    </tr>
                    <tr>
                        <td class="font-medium">Price per hour</td>
                        <td class="text-primary">{{ formData?.Currency }} {{ formData?.PricePerHour }}/-</td>
                    </tr>
                    <tr>
                        <td class="font-medium">Open Time</td>
                        <td class="text-primary">{{ formData?.Availability?.Open | timeFormat }}</td>
                    </tr>
                    <tr>
                        <td class="font-medium">Close Time</td>
                        <td class="text-primary">{{ formData?.Availability?.Close | timeFormat }}</td>
                    </tr>
                    </tbody>
                </table>
                <p-divider />
                <form [formGroup]="bookingForm" (ngSubmit)="submitForm()">
                    <div class="flex flex-col gap-4">
                        <!-- Name Input -->
                        <div class="flex flex-col gap-2">
                            <label for="name">Name*</label>
                            <input [required]="true" pInputText id="name" type="text" placeholder="Enter your full name"
                                   formControlName="name" />
                            <small class="text-red-500"
                                   *ngIf="bookingForm.controls['name'].invalid && bookingForm.controls['name'].touched">Name
                                is required</small>
                        </div>

                        <!-- Email Input -->
                        <div class="flex flex-col gap-2">
                            <label for="email">Email*</label>
                            <input [required]="true" pInputText id="email" type="email" placeholder="Enter your email"
                                   formControlName="email" />
                            <small class="text-red-500"
                                   *ngIf="bookingForm.controls['email'].invalid && bookingForm.controls['email'].touched">
                                Enter a valid email address </small>
                        </div>

                        <!-- Date Picker -->
                        <div class="flex flex-col gap-2">
                            <label for="date">Date*</label>
                            <p-datepicker [required]="true" placeholder="Select booking date" formControlName="date"
                                          [minDate]="minDate" [showIcon]="true"></p-datepicker>
                            <small class="text-red-500"
                                   *ngIf="bookingForm.controls['date'].invalid && bookingForm.controls['date'].touched">Date
                                is required</small>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="date">Start Time*</label>
                            <p-datepicker hourFormat="12" [required]="true" formControlName="startTime"
                                          placeholder="Start Time" [showIcon]="true" [timeOnly]="true"></p-datepicker>
                            <small class="text-red-500"
                                   *ngIf="bookingForm.controls['startTime'].invalid && bookingForm.controls['startTime'].touched">Start
                                time is required</small>
                            <small class="text-red-500"
                                   *ngIf="bookingForm.hasError('invalidTimeRange') && bookingForm.touched"> Start and
                                end time not valid. </small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="date">End Time*</label>
                            <p-datepicker [required]="true" hourFormat="12" formControlName="endTime"
                                          placeholder="End Time" [showIcon]="true" [timeOnly]="true"></p-datepicker>
                            <small class="text-red-500"
                                   *ngIf="bookingForm.controls['endTime'].invalid && bookingForm.controls['endTime'].touched">End
                                time is required</small>
                        </div>
                    </div>
                </form>
                <ng-template #footer>
                    <p-button label="Book Now" icon="pi pi-check" (onClick)="submitForm()" [disabled]="bookingForm.invalid" />
                </ng-template>
            </p-dialog>
        </div>`,
    providers: [StudioService, MessageService],
    styles: [
        `
            ::ng-deep.p-datepicker {
                width: 100%;
            }

            ::ng-deep.p-dialog-content {
                overflow-y: visible !important;
            }
        `
    ]
})
export class StudioList implements OnInit {
    initData: Studio[] = [];
    viewData: Studio[] = [];

    locationValue: any;
    radiusValue: any = 100;

    loading: boolean = true;
    userLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 };
    statuses: any[] = [];
    formData: any;
    dialogVisible: boolean = false;
    slider: boolean = true;
    activityValues: number[] = [100];
    items: any[] = [];

    value: any;

    bookingForm!: FormGroup;
    minDate = new Date();

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private studioService: StudioService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {}

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    this.slider = false;
                },
                (error: any) =>
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't get your location",
                        detail: error.message
                    })
            );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: "Couldn't get your location",
                detail: 'Geolocation is not supported by this browser.'
            });
        }
    }

    ngOnInit() {
        this.bookingForm = this.fb.group(
            {
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                date: ['', Validators.required],
                startTime: ['', Validators.required],
                endTime: ['', Validators.required]
            },
            { validator: this.startEndTimeValidator() }
        );

        this.studioService.getAllData().subscribe((item) => {
            this.initData = this.viewData = item.Studios;
            this.items = this.initData.map((studio) => studio.Location.Address);
            this.loading = false;
        });
        this.getUserLocation();
    }

    onSearch(event: AutoCompleteCompleteEvent) {
        this.locationValue = event.query;
        this.items = this.initData
            .filter(
                (studio) => studio.Location.City.toLowerCase().includes(event.query.toLowerCase()) || studio.Location.Area.toLowerCase().includes(event.query.toLowerCase()) || studio.Location.Address.toLowerCase().includes(event.query.toLowerCase())
            )
            .map((studio) => studio.Location.Address);
    }

    getByLocation(event: any) {
        this.viewData = this.initData.filter(
            (studio) => studio.Location.City.toLowerCase().includes(event.toLowerCase()) || studio.Location.Area.toLowerCase().includes(event.toLowerCase()) || studio.Location.Address.toLowerCase().includes(event.toLowerCase())
        );
        return this.viewData;
    }

    clear() {
        this.viewData = this.initData;
        this.locationValue = '';
        this.activityValues[0] = this.radiusValue = 100;
    }

    bookStudio(studio: any) {
        this.dialogVisible = true;
        this.bookingForm.reset();
        this.formData = studio;
    }

    apply() {
        if (this.locationValue && this.radiusValue < 100) {
            this.filterDistance(this.radiusValue, this.getByLocation(this.locationValue));
        } else if (this.locationValue && this.radiusValue === 100) {
            this.getByLocation(this.locationValue);
        } else if (!this.locationValue && this.radiusValue < 100) {
            this.filterDistance(this.radiusValue, this.initData);
        } else {
            this.viewData = this.initData;
        }
    }

    distanceChange(radius: any) {
        if (this.userLocation.longitude) {
            this.activityValues[0] = this.radiusValue = radius;
        }
    }

    filterDistance(radius: any, data: any) {
        this.viewData = data.filter((studio: any) => {
            const distance = this.calculateDistance(this.userLocation.latitude, this.userLocation.longitude, studio.Location.Coordinates.Latitude, studio.Location.Coordinates.Longitude);
            return distance <= radius;
        });
    }

    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    submitForm() {
        if (this.bookingForm.valid) {
            let res = {
                ...this.bookingForm.value,
                type: this.formData.Type,
                location: this.formData.Location.Address,
                close: this.formData.Availability.Close,
                open: this.formData.Availability.Open,
                id: this.formData.Id,
                name: this.formData.Name
            };

            let bookings: any[] = JSON.parse(localStorage.getItem('bookings') || '[]');

            if (!this.checkAvailability(res, bookings)) {
                bookings.push(res);
                localStorage.setItem('bookings', JSON.stringify(bookings));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Booking Confirmed!',
                    detail: `Your ${this.formData.Type} is booked for ${this.formatDate(this.bookingForm.value.date)} from
             ${this.convertTo12HourFormat(this.bookingForm.value.startTime)} to
             ${this.convertTo12HourFormat(this.bookingForm.value.endTime)}.`
                });

                this.dialogVisible = false;
            }
        } else {
            this.bookingForm.markAllAsTouched();
        }
    }

    convertTo12HourFormat(time: any): string {
        if (!time) return '';
        if (time instanceof Date) {
            let hours = time.getHours();
            let minutes = time.getMinutes();
            let period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
        }
        if (typeof time === 'string') {
            let [hours, minutes] = time.split(':').map(Number);
            let period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
        }

        return '';
    }

    formatDate(date: any): string {
        if (!date) return '';

        let dateObj = date instanceof Date ? date : new Date(date);
        let day = dateObj.getDate();
        let month = dateObj.toLocaleString('en-US', { month: 'long' });
        let year = dateObj.getFullYear();
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) suffix = 'st';
        else if (day % 10 === 2 && day !== 12) suffix = 'nd';
        else if (day % 10 === 3 && day !== 13) suffix = 'rd';

        return `${day}${suffix} ${month} ${year}`;
    }

    checkAvailability(submittedBooking: any, savedBookings: any[]): boolean {
        const { id, date, startTime, endTime, open, close } = submittedBooking;
        const bookingDate = new Date(date).toISOString().split('T')[0];
        const openTime = new Date(date);
        openTime.setHours(+open.split(':')[0], +open.split(':')[1], 0, 0);

        const closeTime = new Date(date);
        closeTime.setHours(+close.split(':')[0], +close.split(':')[1], 0, 0);
        const submittedStart = startTime;
        const submittedEnd = endTime;
        // **Step 1: Check if booking is outside availability time**
        if (submittedStart < openTime || submittedEnd > closeTime) {
            this.messageService.add({
                severity: 'error',
                summary: 'Booking Failed!',
                detail: 'Booking is outside available hours!'
            });

            return true; // Conflict
        }

        // **Step 2: Filter bookings for the same ID & date**
        const sameDayBookings = savedBookings.filter((b) => b.id === id && new Date(b.date).toISOString().split('T')[0] === bookingDate);

        // **Step 3: Check for overlapping time slots**
        for (const booking of sameDayBookings) {
            const existingStart = new Date(booking.startTime);
            const existingEnd = new Date(booking.endTime);
            if ((submittedStart >= existingStart && submittedStart < existingEnd) || (submittedEnd > existingStart && submittedEnd <= existingEnd) || (submittedStart <= existingStart && submittedEnd >= existingEnd)) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Booking Failed!',
                    detail: 'Time slot overlaps with an existing booking!'
                });

                return true; // Conflict found
            }
        }

        return false; // No conflicts
    }

    startEndTimeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const startTime = control.get('startTime')?.value;
            const endTime = control.get('endTime')?.value;

            if (!startTime || !endTime) {
                return null;
            }

            const start = new Date(startTime).getTime();
            const end = new Date(endTime).getTime();

            return start < end ? null : { invalidTimeRange: true };
        };
    }
}
