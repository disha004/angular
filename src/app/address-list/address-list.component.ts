import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Customer } from '../customer';
import { Address, Address2 } from '../address';
import { Friend } from '../friend';
import { NgserviceService } from '../ngservice.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, switchMap, takeUntil, debounceTime, ObservableInput, Observable } from 'rxjs';
import { sharedService } from '../shared.service';


@Component({
  selector: 'app-adress-list',
  templateUrl: 'address-list.component.html',
  styleUrls: ['address-list.component.css'],
})
export class AddressListComponent implements OnInit, OnDestroy {
  address: any;
  baseURL: string = "http://localhost:8080/address/";
  effdate: any;
  endate: any;
  addAddress: boolean = false;
  addressAdded: boolean = false;
  addressDeleted: boolean = false;
  nextClicked = false;
  prevClicked = false;
  labelText: any;
  cid: number = 0;
  lang: any;
  friends: Friend[] | undefined;
  addressForm: UntypedFormGroup;
  customers!: Customer[];
  addresses = new Address();
  newAdress = new Address2();
  effdatecontrol = new UntypedFormControl();
  minDates: any;
  customerList!: Customer[];
  private unsubscribe = new Subject<void>();
  showCustomerDropDown: boolean = false;

  constructor(
    private _service: NgserviceService,
    public translate: TranslateService,
    private fb: UntypedFormBuilder,
    private httpClient: HttpClient,
    private _router: Router,
    private activateRoute: ActivatedRoute,
    private ss: sharedService
  ) {
    this.addressForm = this.fb.group({
      address: ['', Validators.required, Validators.maxLength[50]],
      effdate: ['', Validators.required],
      endate: ['', Validators.required],
    });

  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  ngOnInit(): void {
    this.showCustomerDropDown = false;
    this.ss.change()
    this.addressForm = this.fb.group({
      address: ['', Validators.required, Validators.maxLength[50]],
      effdate: ['', Validators.required],
      endate: ['', Validators.required],
    });
    
    var current = new Date();
    current.setDate(current.getDate());
    this.minDates = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),

    };
    if (this.activateRoute.snapshot.paramMap.get('id')) {
      this.cid = Number(this.activateRoute.snapshot.paramMap.get('id'));
      this.getAddressesByCustomerId(this.cid);
    }else {
      this.showCustomerDropDown = true;
    }

    this.lang = localStorage.getItem('lang') || 'en';
    this.translate.use(this.lang);
    this.addressForm.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.unsubscribe)
    ).subscribe(() => {
      if (this.addressForm.valid && this.addressForm.dirty) {
        this.onSubmit(this.addressForm);
        this.addressForm.reset()
      }
    });
  }
  toggleAddAddress(){
    this.addAddress = !this.addAddress;
  }
  getAddresses(sid) {
    this.httpClient
      .get<any>(this.baseURL + 'getaddressbyid/' + sid)
      .subscribe((response) => {
        console.log(response);
        this.friends = response;
      });
  }

  getAddressesByCustomerId(sid) {
    this.httpClient
      .get<any>(this.baseURL + 'getaddressbycid/' + sid)
      .subscribe((response) => {
        console.log(response);
        this.friends = response;
      });
  }

  selectedCustomer(cust: any){
    this.cid = cust;
    this.getAddressesByCustomerId(this.cid);
    this._router.navigate(['address-list', this.cid]);
  }
  deleteAddress(id: number) {
    console.log("  ::ID:: " + id);
    this._service.deleteAddresslist(id).subscribe(() => {
      this.getAddressesByCustomerId(this.cid);
      this.addressDeleted = false;
      this.newAdress = new Address2();
      ;
      window.location.reload();
    });
  }
  public onSubmit(addressForm: UntypedFormGroup): ObservableInput<any> {
    this.addresses.address = this.addressForm.get('address')!.value;
    this.addresses.effdate = new Date(
      this.addressForm.get('effdate')!.value.year,
      this.addressForm.get('effdate')!.value.month - 1,
      this.addressForm.get('effdate')!.value.day
    );
    this.addresses.endate = new Date(
      this.addressForm.get('endate')!.value.year,
      this.addressForm.get('endate')!.value.month - 1,
      this.addressForm.get('endate')!.value.day
    );
    this.addresses.cid = this.cid;
    this._service.addaddresslist(this.addresses).subscribe(
      (data) => {
        this.addressForm.reset();
        this.getAddressesByCustomerId(this.cid);
        this.addAddress = false;
      },
      (error) => {
        console.log('exception occured', JSON.stringify(error));
      }
    );
    return Observable.name;
  }

  retricAddress() {
    if(this.addressForm.get('address')!.value.length > 50)
    { 
      this.addressForm.controls['address'].setErrors({maxLength:true})  // <--- Set invalidNumber to true 

      console.log(
        "Welcome" + this.addressForm.get('address')!.value.length
      )
      
    }
  
  }

  public onNextClick(): void {
    this._router.navigate(['/review-date', this.cid]);
    if (localStorage.getItem('view') == '1') {
      this._service.updateaddresslist(this.cid, this.newAdress).subscribe(
        (data) => {
          this.newAdress = new Address2();
        },
        (error) => {
          console.log('exception occured', error.error);
        })
      this._router.navigate(['review-date']);
    }
  }
  public onPrevClick(): void {
    this.prevClicked = true;
  }
}
