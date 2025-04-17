import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class AuthService{
    private apiUrl = 'http://localhost:5000/api/auth';

    login(){}
}