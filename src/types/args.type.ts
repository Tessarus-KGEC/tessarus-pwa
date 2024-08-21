export interface LoginArgs {
  email: string;
}

export interface VerifyOTPArgs {
  email: string;
  otp: string;
  otp_token: string;
}

export interface CreateEventArgs {
  title: string;
  description: string;
  status?: string;
  rules?: string;
  prizes?: string;
  tagLine?: string;
  startTime: string;
  endTime: string;
  eventVenue: string;
  eventCoverImage?: string;
  pastEventImages?: string[];
  otherPlatformUrl?: string;
  eventType: string;
  minTeamMembersSize?: number;
  maxTeamMembersSize?: number;
  eventPrice: number;
  eventPriceForKGEC?: number;
  eventOrganiserClub: string;
  eventCoordinators?: string[];
  sponsors?: {
    name: string;
    type?: string;
    image?: string;
  }[];
}
