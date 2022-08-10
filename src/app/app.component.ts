import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { TranslateService } from '@ngx-translate/core';
import { NgserviceService } from './ngservice.service';
import { HttpClient } from '@angular/common/http';
import { Total } from './total';
import { Router } from '@angular/router';
import { sharedService } from './shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  lang;
  title = 'angular';
  cid: any;
  totals!: Total[];
  view: boolean = true;
  subscription: Subscription = new Subscription;

  constructor(public ss: sharedService, public translate: TranslateService, private _router: Router, private _service: NgserviceService, private httpClient: HttpClient) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
    localStorage.setItem('view', '1');
    this.subscription = this.ss.getEmittedValue()
      .subscribe(item => this.view = item);
  }
  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
  viewProfile(inf: number) {
    localStorage.setItem('view', '1');
    localStorage.setItem('myValue', JSON.stringify(this.totals));
    localStorage.setItem('check', inf + "");
    this._router.navigate(['customer-list']);
  }
  deleteProfile(it: number) {
    this._service.deleteProfilelist(it).subscribe(
      data => console.log(data),
      error => console.error(error)
    );
    try {
      window.location.reload();
    }
    catch (Exception) {
      console.error("No data now");
    }
  }
  Refresh() {
    this._router.navigate(['home']);
    window.location.reload();
  }
  basicPage() {
    this.setNull();
    this._router.navigate(['customer-list']);
  }
  addressPage() {
    this.setNull();
    this._router.navigate(['address-list']);
  }
  reviewPage() {
    this.setNull();
    this._router.navigate(['review-date']);
  }
  setNull() {
    localStorage.setItem('view', '0');
    localStorage.setItem('check', '');
    localStorage.setItem('cid', '');
  }

}
