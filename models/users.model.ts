export interface UsersModel {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
  streetAddress: string;
  county: string;
  state: string;
  zipCode: string;
  subscriber: string;
  subscriptionLevel: number;
  verified: boolean;
  adminAuthorized: boolean;
}