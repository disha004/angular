import { NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class Address {
  id!: number;
  address!: string;
  effdate!: Date;
  endate!: Date;
  cid!: number;
  // effdate!: NgbDate;
  // endate!: NgbDate;
}

export class Address2 {
  id!: number;
  address!: string;
  effdate!: NgbDateStruct ;
  endate!: NgbDateStruct ;
  cid!: number;
}
