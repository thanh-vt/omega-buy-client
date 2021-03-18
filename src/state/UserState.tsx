import {OtherInfo} from "../shared/model/OtherInfo";
import {UserProfile} from "../shared/model/UserProfile";
import {Setting} from "../shared/model/Setting";

export interface UserState {
  user_name?: string;
  access_token?: string | null;
  authorities?: string[] | null;
  expires_in?: number | null;
  id?: number | null;
  other?: OtherInfo | null;
  profile?: UserProfile | null;
  refresh_token?: string | null;
  scope?: string | null;
  setting?: Setting | null;
  token_type?: "bearer" | null;
}
