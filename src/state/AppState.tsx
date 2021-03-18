import {UserState} from "./UserState";
import {RouteState} from "./RouteState";
import {MessageState} from "./MessageState";
import {ThemeState} from "./ThemeState";

export interface AppState {
  user?: UserState | null;
  message?: MessageState | null;
  route?: RouteState | null;
  theme?: ThemeState | null;
}
