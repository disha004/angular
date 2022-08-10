import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Customer } from '../customer';
import { NgserviceService } from '../ngservice.service';
import { TranslateService } from '@ngx-translate/core';
import { Total } from '../total';
import { first, Subject, switchMap, takeUntil, debounceTime, ObservableInput, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { sharedService } from '../shared.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: 'customer-list.component.html',
  styleUrls: ['customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
  firstName: any;
  addCustomer: boolean = false;
  showUpdateButton: boolean = false;
  customerList: Customer[] = [];
  lastName: any;
  telephone: any;
  email: any;
  comment: any;
  nextClicked = false;
  labelText: any;
  lang: any;
  totals: Total[] | undefined;
  cid: number = 0;

  customer = new Customer();
  submitted = false;
  customerForm: UntypedFormGroup;
  private unsubscribe = new Subject<void>()



  constructor(
    private _service: NgserviceService,
    public translate: TranslateService,
    private _router: Router,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private ss: sharedService
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      telephone: ['', Validators.required, Validators.minLength[10]],
      email: ['', [Validators.required, Validators.email]],
      comment: ['', [Validators.required, Validators.maxLength(50)]],
      custid: ['']
    });

    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
     
    const browserLang = translate?.getBrowserLang();
    translate.use(browserLang?.match(/en|fr/) ? browserLang : 'en');
   
  }

  ngOnInit(): void {
    localStorage.setItem('view', '3');
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      telephone: ['', Validators.required, Validators.maxLength[10]],
      email: ['', [Validators.required, Validators.email]],
      comment: ['', [Validators.required, Validators.maxLength(50)]],
      custid: ['']
    });
    this.ss.change()

    this.customerForm.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.unsubscribe)
    ).subscribe(() => {
      if (this.customerForm.valid && this.customerForm.dirty) {
        this.onSubmit(this.customerForm);
        this.customerForm.reset()
      }
    });

    this.lang = localStorage.getItem('lang') || 'en';
    this.translate.use(this.lang);
    if (localStorage.getItem('view') == '1') {
      var Dataer = JSON.parse(localStorage.getItem('myValue') || '[]');
      var check = localStorage.getItem('check');
      this.cid = Number(check);
      console.log('Values : ', Dataer);
      console.log('Check : ', check);
      var len = Object.keys(Dataer).length;
      var jak = 0;
      for (var io = 0; io < len; io++) {
        if (Dataer[io]['customerId'] == check) {
          jak = io;
        }
      }
      var custid = Dataer[jak]['customerId'];
      this.customer.id = custid;
      this.customer.firstName = Dataer[jak]['firstName'];
      this.customer.lastName = Dataer[jak]['lastName'];
      this.customer.telephone = Dataer[jak]['telephone'];
      this.customer.email = Dataer[jak]['email'];
      this.customer.comment = Dataer[jak]['comment'];
      console.log(this.customer.firstName + this.customer.lastName);
    }
  }
  retricComment() {
    if(this.customerForm.get('comment')!.value.length > 50)
    { 
      this.customerForm.controls['comment'].setErrors({maxLength:true})  // <--- Set invalidNumber to true 

      console.log(
        "Welcome" + this.customerForm.get('comment')!.value.length
      )
      
    }
  
  }

  public onSubmit(customerForm: UntypedFormGroup): ObservableInput<any> {
    if (this.nextClicked) {
    } else {
      console.log(customerForm);
      this._service.addcustomerlist(customerForm.value).subscribe(
        (data) => {
          this.addCustomer = false;
          this._router.navigate(['/address-list', data['custid']]);
          this.labelText = 'Customer Added !';
          return data;
        },
        (error) => {
          console.log('exception occured', error.error);
          return null;
        }
      );
    }
    return Observable.name;
  }

  deleteCustomer(id: number): void {

    this._service.deleteProfilelist(id).subscribe();
    this._router.navigateByUrl('/customer-list');

  }

  editCustomer(cat: Customer): void {
    this.showUpdateButton = true;
    this.addCustomer = true;
    console.log(JSON.stringify(cat));
    if (cat.custid != undefined) {
      localStorage.setItem('cid', JSON.stringify(cat.custid));
    }
    this.customerForm.patchValue({
      firstName: cat.firstName,
      lastName: cat.lastName,
      email: cat.email,
      telephone: cat.telephone,
      comment: cat.comment,
      custid: cat.custid
    });
  }
  public onNextClick(): void {
    console.log(this.customerForm.get('custid')!.value);
    if (this.customerForm.get('custid') != undefined) {
      this._router.navigate(['/address-list', this.customerForm.get('custid')!.value]);
    }
  }

  toggleAddCustomer() {
    this.addCustomer = !this.addCustomer;
  }
  deleteProfile(it: number) {
    this._service.deleteProfilelist(it).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
    try {
      this.getProfileCard();
      window.location.reload();
    }
    catch (Exception) {
      console.log("No data now");
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
  getProfileCard() {
    
  }
  viewProfile(id: number){

  }
}
