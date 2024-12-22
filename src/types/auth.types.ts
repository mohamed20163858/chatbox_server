export interface RegisterUserDto {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}
