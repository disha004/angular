export class Total {
  constructor(
    public id: number,
    public address: string,
    public effdate: Date,
    public endate: Date,
    public customerId: number,
    public firstName: string,
    public lastName: string,
    public telephone: number,
    public email: string,
    public comment: string,
    public reviewId: string,
    public revdate: string
  ) {
  }
}
