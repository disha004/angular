import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Review } from '../review';
import { NgserviceService } from '../ngservice.service';
import { TranslateService } from '@ngx-translate/core';  
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { sharedService } from '../shared.service';
import { Customer } from '../customer';

@Component({
  selector: 'app-review-date',
  templateUrl: './review-date.component.html',
  styleUrls: ['./review-date.component.css']
})
export class ReviewDateComponent implements OnInit {

  revdate:any;
  labelText: any;
  cid: number = 0;
  lang:any;
  customerList!: Customer[];
  showCustomerDropDown: boolean = false;

  review = new Review();
  newReview = new Review();

  constructor(
    private _service: NgserviceService,
    private _router: Router,
    public translate: TranslateService,
    public activateRoute: ActivatedRoute,
    public ss: sharedService) { }

  ngOnInit(): void {
    this.ss.change()
    if (this.activateRoute.snapshot.paramMap.get('custId')) {
      this.cid = Number(this.activateRoute.snapshot.paramMap.get('custId'));
    }
    else {
      this.showCustomerDropDown = true;
    }
    localStorage.setItem('view', '2');
    this.lang=localStorage.getItem('lang') || 'en';
    this.translate.use(this.lang);
    if (localStorage.getItem('view') == '1') {
      var Dataer = JSON.parse(localStorage.getItem('myValue') || '[]');
      var check = localStorage.getItem('check');      
      var len = Object.keys(Dataer).length;
      var jak = 0;
      for (var io = 0; io < len; io++) {
        if (Dataer[io]['customerId'] == check) {
          jak = io;
        }
      }

      var custid = Dataer[jak]['custid'];

      var daterev = new Date(Dataer[jak]['revdate']);

      const daterevs: NgbDateStruct = { year: daterev.getFullYear(), month: daterev.getMonth() + 1, day: daterev.getDate() + 1 };
      
      this.revdate = daterevs;
    }
  }

  selectedCustomer(cust: any){
    this.cid = cust;
    this._router.navigate(['review-date', this.cid]);
  }
  

}
