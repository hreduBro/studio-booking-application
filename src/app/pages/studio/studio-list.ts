import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { Representative } from '../service/customer.service';
import { FormsModule } from '@angular/forms';
import { Studio, StudioService } from '../service/studio.service';
import { Rating } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoComplete } from 'primeng/autocomplete';


interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}


@Component({
    selector: 'app-studio-list',
    standalone: true,
    imports: [ButtonDirective, DatePickerModule, IconField, InputText, TableModule, FormsModule, Rating, Button, Toast, Dialog, Select, Slider, AutoComplete],
    template: ` <div class="card">
        <p-toast />
        <div class="font-semibold text-xl mb-4">Studio List</div>
        <p-table
            #dt1
            [value]="customers1"
            dataKey="id"
            [rows]="10"
            [loading]="loading"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            [rowHover]="true"
            [showGridlines]="true"
            [paginator]="true"
            [rowsPerPageOptions]="[10, 25, 50]"
            [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
            responsiveLayout="scroll"
        >
            <ng-template #caption>
                <div class="flex justify-between items-center flex-column sm:flex-row">
                    <p-iconfield iconPosition="left" class="ml-auto">
                        <button pButton label="Clear" class="p-button-outlined mb-2" icon="pi pi-filter-slash" (click)="clear(dt1)"></button>
                    </p-iconfield>
                </div>
            </ng-template>
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
                            <p-columnFilter field="representative" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                                <ng-template #header>
                                    <p-select [options]="cities" [(ngModel)]="selectedCity" (onChange)="filters($event.value)" optionLabel="name" optionValue="value" placeholder="Select a City" class="w-full md:w-56" />
                                </ng-template>
                                <ng-template #filter let-value let-filter="filterCallback">
                                    <p-autocomplete [ngModel]="value" [suggestions]="items" (completeMethod)="search($event)" />

                                    <div class="px-3 pt-3 pb-0">
                                        <span class="font-bold">Search by Radius</span>
                                    </div>
                                    <p-slider [ngModel]="activityValues" [range]="false" (onSlideEnd)="filter($event.values)" styleClass="m-3" [style]="{ 'min-width': '12rem' }"></p-slider>
                                    <div class="flex items-center justify-between px-2">
                                        <span>{{ activityValues[0] }}</span>
                                        <span>{{ activityValues[1] }}</span>
                                    </div>
                                </ng-template>

                                <p-select [options]="cities" [(ngModel)]="selectedCity" (onChange)="filters($event.value)" optionLabel="name" optionValue="value" placeholder="Select a City" class="w-full md:w-56" />
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
                    <th style="min-width: 2rem">
                        <div class="flex justify-between items-center">Action</div>
                    </th>
                </tr>
            </ng-template>
            <ng-template #body let-customer>
                <tr>
                    <td>
                        {{ customer.Name }}
                    </td>
                    <td>
                        {{ customer.Type }}
                    </td>
                    <td>{{ customer.Location.City }}, {{ customer.Location.Area }} , {{ customer.Location.Address }}</td>
                    <td>
                        {{ customer.Amenities }}
                    </td>
                    <td>{{ customer.Currency }} {{ customer.PricePerHour }}/-</td>
                    <td>
                        <p-rating [(ngModel)]="customer.Rating" [readonly]="true" />
                    </td>
                    <td>
                        <p-button icon="pi pi-search" (click)="selectProduct(customer)" severity="secondary" rounded />
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="8">No customers found.</td>
                </tr>
            </ng-template>
            <ng-template #loadingbody>
                <tr>
                    <td colspan="8">Loading customers data. Please wait.</td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog header="Booking" [resizable]="false" [modal]="true" [maximizable]="true" appendTo="body" [(visible)]="dialogVisible" [style]="{ width: '25vw' }">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="name1">Name</label>
                    <input placeholder="Enter your full name" pInputText id="name1" type="text" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="email1">Email</label>
                    <input placeholder="Enter your email" pInputText id="email1" type="text" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="age1">Date</label>
                    <p-datepicker placeholder="Enter booking date" [(ngModel)]="date2" [iconDisplay]="'input'" [showIcon]="true" inputId="icondisplay" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="age1">Time slot</label>
                    <div class="flex gap-2 justify-between items-center">
                        <p-datepicker [(ngModel)]="date3" [iconDisplay]="'input'" placeholder="Start time" [showIcon]="true" [timeOnly]="true" inputId="templatedisplay">
                            <ng-template #inputicon let-clickCallBack="clickCallBack">
                                <i class="pi pi-clock" (click)="clickCallBack($event)"></i>
                            </ng-template>
                        </p-datepicker>
                        -
                        <p-datepicker [(ngModel)]="date3" [iconDisplay]="'input'" [showIcon]="true" placeholder="End Time" [timeOnly]="true" inputId="templatedisplay">
                            <ng-template #inputicon let-clickCallBack="clickCallBack">
                                <i class="pi pi-clock" (click)="clickCallBack($event)"></i>
                            </ng-template>
                        </p-datepicker>
                    </div>
                </div>
            </div>

            <ng-template #footer>
                <p-button label="Ok" icon="pi pi-check" (onClick)="dialogVisible = false" />
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
    customers1: Studio[] = [];
    loading: boolean = true;
    representatives: Representative[] = [];
    statuses: any[] = [];
    date2: any;
    date3: any;
    dialogVisible: boolean = false;
    cities = [
        { name: 'Search By Area', value: 'a' },
        { name: 'Search By City', value: 'c' }
    ];
    selectedCity: any = 'a';
    activityValues: number[] = [50];
    items: any[] = [];

    value: any;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private studioService: StudioService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.studioService.getAllData().subscribe((item) => {
            this.customers1 = item.Studios;
            this.loading = false;
        });
    }

    search(event: AutoCompleteCompleteEvent) {
        this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }

    selectProduct(customer: any) {
        this.dialogVisible = true;
        // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: customer.Name });
    }

    filters(value: any) {}
}
