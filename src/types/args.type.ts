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
  orderId?: string;
  team: {
    name: string;
    members: string[];
  };
}

export interface CreatePaymentOrderArgs {
  orderType: string;
  amount: number;
}
