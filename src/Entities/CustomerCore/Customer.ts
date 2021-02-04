import Token from '../TokenCore/Token';

export default interface Customer {
  customerId: number;
  token: Token;
  remarks: string;
}
