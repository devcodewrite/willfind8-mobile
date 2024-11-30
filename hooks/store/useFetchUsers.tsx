interface User {
  id: number;
  name: string;
  username: string;
  country_code: string;
  language_code: string;
  user_type_id: number | null;
  gender_id: number;
  photo?: string | null;
  about?: string | null;
  auth_field: "email" | "phone" | "string";
  email: string;
  phone: string;
  phone_national: string;
  phone_country: string;
  phone_hidden: boolean;
  disable_comments?: boolean;
  ip_addr?: string;
  provider: string;
  provider_id: string;
  email_token: string | null;
  phone_token: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  accept_terms: boolean;
  accept_marketing_offers: boolean;
  time_zone: string | null;
  blocked: boolean;
  closed: boolean;
  last_activity: string | null;
  phone_intl: string;
  updated_at: string | null;
  original_updated_at: string | null;
  original_last_activity: string | null;
  created_at_formatted: string | null;
  photo_url: string | null;
  p_is_online?: boolean;
  country_flag_url?: string | null;
}

export { User };
