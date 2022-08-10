import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, Observable, ObservableInput, Subject, Subscription, takeUntil } from 'rxjs';
import { Address, Address2 } from '../address';
import { Customer } from '../customer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Friend } from '../friend';
import { NgserviceService } from '../ngservice.service';
import { Review } from '../review';
import { sharedService } from '../shared.service';
import { Total } from '../total';
import * as moment from 'moment';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})


export class CustomerDetailsComponent implements OnInit, OnDestroy {
  address: any;
  baseURL: string = "http://localhost:8080/address/";
  effdate: any;
  endate: any;
  addAddress: boolean = false;
  addressAdded: boolean = false;
  addressDeleted: boolean = false;
  nextClicked = false;d
  prevClicked = false;
  labelText: any;
  cid: number = 0;
  lang: any;
  friends: Friend[] | undefined;
  addressForm: UntypedFormGroup;
  reviewForm: UntypedFormGroup;
  customers!: Customer[];
  addresses = new Address();
  newAdress = new Address2();
  effdatecontrol = new UntypedFormControl();
  minDates: any;
  private unsubscribe = new Subject<void>();
  showCustomerDropDown: boolean = false;

  firstName: any;
  addCustomer: boolean = false;
  showUpdateButton: boolean = false;
  customerList: Customer[] = [];
  lastName: any;
  telephone: any;
  email: any;
  comment: any;
  totals!: Total[] | undefined;
  customer = new Customer();
  submitted = false;
  customerForm: UntypedFormGroup;
  step = 0;
  revdate: any;
  review = new Review();
  newReview = new Review();
  title = 'angular';
  view: boolean = true;
  subscription: Subscription = new Subscription;

  constructor(
    private _service: NgserviceService,
    public translate: TranslateService,
    private _router: Router,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private activateRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private ss: sharedService) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      telephone: ['', Validators.required, Validators.minLength[10]],
      email: ['', [Validators.required, Validators.email]],
      comment: ['', [Validators.required, Validators.maxLength(50)]],
      custid: ['']
    });
    this.reviewForm = this.fb.group({
      revdate: ['', Validators.required]
    });

    this.addressForm = this.fb.group({
      address: ['', Validators.required, Validators.maxLength[50]],
      effdate: ['', Validators.required],
      endate: ['', Validators.required],
    });

    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang = translate?.getBrowserLang();
    translate.use(browserLang?.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
    localStorage.setItem('view', '1');
    this.getProfileCard();
    this.subscription = this.ss.getEmittedValue()
      .subscribe(item => this.view = item);
    this.lang = localStorage.getItem('lang') || 'en';
    this.translate.use(this.lang);
    this.showCustomerDropDown = false;
    localStorage.setItem('view', '3');
    this.reviewForm = this.fb.group({
      revdate: ['', Validators.required]
    })
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      telephone: ['', Validators.required, Validators.maxLength[10]],
      email: ['', [Validators.required, Validators.email]],
      comment: ['', [Validators.required, Validators.maxLength(50)]],
      custid: ['']
    });
    this.addressForm = this.fb.group({
      address: ['', Validators.required, Validators.maxLength[50]],
      effdate: ['', Validators.required],
      endate: ['', Validators.required],
    });
    var current = new Date();
    current.setDate(current.getDate());
    this.minDates = new Date(current.getFullYear(), current.getMonth(), current.getDate());

    this.ss.change()

    if (this.activateRoute.snapshot.paramMap.get('id')) {
      this.cid = Number(this.activateRoute.snapshot.paramMap.get('id'));
      this.getAddressesByCustomerId(this.cid);
    } else {
      this.showCustomerDropDown = true;
    }

    this.addressForm.valueChanges.pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribe)
    ).subscribe(() => {
      if (this.addressForm.valid && this.addressForm.dirty) {
        this.onAddressSubmit(this.addressForm);
        this.addressForm.reset()
      }
    });

    this.customerForm.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.unsubscribe)
    ).subscribe(() => {
      if (this.customerForm.valid && this.customerForm.dirty) {
        this.onSubmit(this.customerForm);
      }
    });

    this.reviewForm.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.unsubscribe)
    ).subscribe(() => {
      if (this.reviewForm.valid && this.reviewForm.dirty) {
        this.onReviewSubmit(this.reviewForm);
        this.reviewForm.reset()
      }
    });

    this.lang = localStorage.getItem('lang') || 'en';
    this.translate.use(this.lang);
    if (localStorage.getItem('view') == '1') {
      var Dataer = JSON.parse(localStorage.getItem('myValue') || '[]');
      var check = localStorage.getItem('check');
      this.cid = Number(check);
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
    }
  }
  toggleAddAddress() {
    this.addAddress = !this.addAddress;
  }
  getAddresses(sid) {
    this.httpClient
      .get<any>(this.baseURL + 'getaddressbyid/' + sid)
      .subscribe((response) => {
        this.friends = response.addressList;
      });
  }

  switchLang(lang: string) {
    this.lang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  public onReviewSubmit(revForm: FormGroup): void {
    this.review.revdate = revForm.get('revdate')!.value;
    this.review.cid = this.cid;
    this._service.addreviewlist(this.review).subscribe(
      (data) => {
        this.reviewForm.patchValue({
          revdate: data.revdate
        });
        this.customerForm.reset();
        this.addressForm.reset();
        this.getProfileCard();
        this.friends = [];
        this.step = 0;
      },
      (error) => {
        console.error('exception occured', JSON.stringify(error));
      }
    );
    this._router.navigateByUrl('');
  }
  getAddressesByCustomerId(sid) {
    this.httpClient
      .get<any>(this.baseURL + 'getaddressbycid/' + sid)
      .subscribe((response) => {
        this.friends = response.addressList;
      });
  }

  selectedCustomer(cust: any) {
    this.cid = cust;
    this.getAddressesByCustomerId(this.cid);
  }
  deleteAddress(id: number) {
    this._service.deleteAddresslist(id).subscribe(() => {
      this.getAddressesByCustomerId(this.cid);
      this.addressDeleted = false;
      this.newAdress = new Address2();
      ;
      window.location.reload();
    });
  }

  public onAddressSubmit(addressForm: FormGroup): ObservableInput<any> {

    this.addresses.address = this.addressForm.get('address')!.value;
    this.addresses.effdate = this.addressForm.get('effdate')!.value;
    this.addresses.endate = this.addressForm.get('endate')!.value;
    this.addresses.cid = this.cid;
    this._service.addaddresslist(this.addresses).subscribe(
      (data) => {

        this.getAddressesByCustomerId(this.cid);
        this.addAddress = false;
      },
      (error) => {
        this._snackBar.open(error.error.message, "Error Occurred!!")
        console.error('exception occured', JSON.stringify(error));
      }
    );
    return Observable.name;
  }

  openSnackBar(message: string, action: string) {
    this.friends = [];
    this._snackBar.open(message, action);
  }
  retricComment() {
    if (this.customerForm.get('comment')!.value.length > 50) {
      this.customerForm.controls['comment'].setErrors({ maxLength: true })  // <--- Set invalidNumber to true 
    }

  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    if (this.step == 0) {
      this.getAddresses(this.cid);
    }
    if (this.step === 1) {
      this._service.getReviewByCustomer(this.cid).subscribe(
        (data) => {
          let date: Date = new Date(data.revdate);
          date.setDate(date.getDate() + 1);
          this.reviewForm.patchValue({
            revdate: date

          })
        },
        (error) => {
          this._snackBar.open(error.error.message, "Error Occurred!!")
          console.error('exception occured', JSON.stringify(error));
        }
      );
    }
    if (this.step == 2) {
      this.customerForm.reset();
      this.addressForm.reset();
      this.reviewForm.reset();
      this.friends = [];
    }
    this.step++;
  }

  prevStep() {
    if (this.step == 0) {
      this.addressForm.reset();
      this.customerForm.reset();
      this.friends = [];
    }
    this.step--;

  }

  public onSubmit(customerForm: UntypedFormGroup): ObservableInput<any> {

    if (customerForm.value.custid == "" || customerForm.value.custid == null) {
      this._service.addcustomerlist(customerForm.value).subscribe(
        (data) => {
          this.cid = data.custid;
          this.nextStep();
          return data;
        },
        (error) => {
          console.error('exception occured', error.error);
          return null;
        });
    } else {
      this._service.updatecustomerlist(customerForm.value.custid, customerForm.value).subscribe(
        (data) => {
          this.cid = data.custid;
          this.getProfileCard();
          this.nextStep();
          return data;
        },
        (error) => {
          console.error('exception occured', error.error);
          return null;
        }
      );
    }
    return Observable.name;
  }

  deleteCustomer(id: number): void {
    this._service.deleteProfilelist(id).subscribe();
    this.openSnackBar("Customer deleted successfully!!", "Delete");
    this.getProfileCard();
    this.friends = [];
    this.customerForm.reset();
  }

  editCustomer(cat: Customer): void {
    this.showUpdateButton = true;
    this.addCustomer = true;
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
    if (this.customerForm.get('custid') != undefined) {
      this._router.navigate(['/address-list', this.customerForm.get('custid')!.value]);
    }
  }

  toggleAddCustomer() {
    this.addCustomer = !this.addCustomer;
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.subscription.unsubscribe();

  }
  retricAddress() {
    if (this.addressForm.get('address')!.value.length > 50) {
      this.addressForm.controls['address'].setErrors({ maxLength: true })  // <--- Set invalidNumber to true  
    }

  }

  public onNextAddressClick(): void {
    this._router.navigate(['/review-date', this.cid]);
    if (localStorage.getItem('view') == '1') {
      this._service.updateaddresslist(this.cid, this.newAdress).subscribe(
        (data) => {
          this.newAdress = new Address2();
        },
        (error) => {
          console.error('exception occured', error.error);
        })
      this._router.navigate(['review-date']);
    }
  }
  public onPrevClick(): void {
    this.prevClicked = true;
  }

  viewProfile(inf: number) {
    this._service.getCustomer(inf).subscribe(
      data => {
        this.customerForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          telephone: data.telephone,
          comment: data.comment,
          custid: data.custid
        });
        this.cid = data.custid;
        
      },
      error => console.error(error)
    )
  }
  deleteProfile(it: number) {
    this._service.deleteProfilelist(it).subscribe(
      data => {
        this.openSnackBar("Customer deleted successfully!!", "Delete");
        this.getProfileCard();
        this.friends = [];
        this.customerForm.reset();
      },
      error => console.log(error)
    );


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
    this.httpClient.get<any>("http://localhost:8080/getAllCustomerList/").subscribe(
      response => {
        this.totals = response.customerData;
      }
    );
  }
}