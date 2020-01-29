export interface AuthUser {
  id: string;
  fullName: string;
  preferenceCategories: string[];
  roles?: string[];
}
