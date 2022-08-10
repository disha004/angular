import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomerListComponent } from './customer-list.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'; 
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Routes } from '@angular/router';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerListComponent ],
      imports: [ HttpClientTestingModule,RouterModule.forRoot([]),  TranslateModule.forRoot(),FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
