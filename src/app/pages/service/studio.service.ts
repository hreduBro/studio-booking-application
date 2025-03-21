import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Coordinates {
    Latitude: number;
    Longitude: number;
}

export interface Location {
    City: string;
    Area: string;
    Address: string;
    Coordinates: Coordinates;
}

export interface Contact {
    Phone: string;
    Email: string;
}

export interface Availability {
    Open: string;
    Close: string;
}

export interface Studio {
    Id: number;
    Name: string;
    Type: string;
    Location: Location;
    Contact: Contact;
    Amenities: string[];
    Description: string;
    PricePerHour: number;
    Currency: string;
    Availability: Availability;
    Rating: number;
    Images: string[];
}

export interface StudioResponse {
    Studios: Studio[];
}

@Injectable()
export class StudioService {

    private apiUrl = 'https://gist.githubusercontent.com/rash3dul-islam/88e1565bea2dd1ff9180ff733617a565/raw/684afa147a8e726d7a5e4fdeb390f2d48b35051d/studio-mock-api,json';

    constructor(private http: HttpClient) {}

    getAllData(): Observable<StudioResponse> {
        return this.http.get<StudioResponse>(this.apiUrl);
    }
}
