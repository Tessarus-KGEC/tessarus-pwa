export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  college: string;
  degree: string;
  year: number;
  stream: string;
  isVerified: boolean;
  isFromKGEC: boolean;
  isVolunteer: boolean;
  wallet: number;
  profileImageUrl: string;
  espektroId: string;
  events: string[];
  createdAt: string;
  updatedAt: string;
  permissions: string[];

  score: number;
}
