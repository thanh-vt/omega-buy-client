import {Setting} from "../shared/model/Setting";

export interface UserState {
  user_name?: string;
  access_token?: string | null;
  authorities?: string[] | null;
  expires_in?: number | null;
  id?: number | null;
  refresh_token?: string | null;
  scope?: string | null;
  setting?: Setting | null;
  avatar_url: string | null;
  date_of_birth: number | null;
  first_name: string | null;
  gender: number | null;
  jti: string | null;
  last_name: string | null;
  timestamp: number;
  token_type: "bearer"
}
