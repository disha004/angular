import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core/lib/translate.loader';
import { Observable } from 'rxjs/internal/Observable';

export class CustomTranslationLoader implements TranslateLoader {
    
    constructor(private http: HttpClient) {}
   

    getTranslation(lang: string): Observable<any> 
    {
        return this.http.get("http://localhost:8080/api/translation/" + lang);
    }
}