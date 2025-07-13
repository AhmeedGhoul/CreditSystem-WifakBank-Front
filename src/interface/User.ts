export type CivilStatus = 'Married' | 'Divorced' | 'Single' | 'Widow';

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  adress: string;
  phoneNumber: number;
  userScore?: number;
  roles: string[]; // dérivé du backend .roles.map(role => role.name)
  civilStatus: CivilStatus;
  dateOfBirth: string; // ou Date selon ton usage
  isEnabled?: boolean;
  isAccountBlocked?: boolean;
}
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  adress: string;
  phoneNumber: number;
  userScore?: number;
  role?: string;
  civilStatus: CivilStatus;
  dateOfBirth: Date;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface GrantRoleDto {
  roleName: string;
}