export interface UsersModel {
  id: number;
  first_name: string;
  last_name: string;
  email_id: number;
  password_hash: string;
  phone_number: string;
  county: string;
  state: string;
  zip_code: string;
  subscriber: string;
  subscription_level: number;
  verified: boolean;
  created_at: Date;
  admin_authorized: boolean;
}