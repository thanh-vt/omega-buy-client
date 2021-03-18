export interface UserProfile {
  id?: number | null;
  userId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | number | null;
  gender?: number | null;
  avatarUrl?: string | null;
}
