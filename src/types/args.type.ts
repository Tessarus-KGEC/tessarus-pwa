export interface LoginArgs {
  email: string;
}

export interface VerifyOTPArgs {
  email: string;
  otp: string;
  otp_token: string;
}

export interface GetAllEventsArgs {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  eventType?: string;
  club?: string;
  freeEvent?: boolean;
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

export interface BookTicketArgs {
  eventId: string;
  transactionId?: string;
  team: {
    name: string;
    members: string[];
  };
}

export interface CreatePaymentOrderArgs {
  orderType: 'ticket' | 'wallet';
  amount: number;
  eventId?: string;
}

export interface GetAllUAMUsersArgs {
  page?: number;
  limit?: number;
  search?: string;
  fromKGEC?: boolean;
  permissions?: string[];
}

export interface UpdateUAMUserArgs {
  userId: string;
  isVolunteer: boolean;
  permissions: string[];
}
