import { EventStatus, OrganisingClub } from '../constants';
import { User } from './app.type';

export interface LoginResponse {
  otp_token: string;
  expiryTime: number;
}

export interface VerifyOTPResponse {
  accessToken: string;
}

export interface VerifyUniversityRollResponse {
  verified: boolean;
  email: string;
  roll: string;
}

export interface VerifyUniversityRollArgs {
  roll: string;
}

export interface SignupUserResponse {}

export interface SignupUserArgs {
  name: string;
  email: string;
  phone: string;
  college: string;
  isFromKGEC: boolean;
  universityRoll?: string;
  referralCode?: string;
}

export interface UserSelfResponse extends User {}

export interface EventCoordinatorsResponse extends Pick<User, '_id' | 'name' | 'email' | 'isFromKGEC' | 'isVolunteer' | 'profileImageUrl'> {}

export interface LeaderboardContestantsQuery {
  page: number;
  limit: number;
}
export interface LeaderboardContestantsResponse {
  total: number;
  list: (Pick<User, '_id' | 'name' | 'email' | 'isFromKGEC' | 'profileImageUrl' | 'score'> & { rank: number })[];
  rank?: number;
}

export interface PushSubscriptionPublicKeyResponse {
  publicKey: string;
}

export interface IEvent
  extends Pick<
    EventResponse,
    | '_id'
    | 'title'
    | 'description'
    | 'status'
    | 'eventPrice'
    | 'eventPriceForKGEC'
    | 'startTime'
    | 'endTime'
    | 'eventVenue'
    | 'eventThumbnailImage'
    | 'eventType'
    | 'eventOrganiserClub'
  > {}

export interface GetAllEventsResponse {
  events: (Pick<
    EventResponse,
    | '_id'
    | 'title'
    | 'description'
    | 'status'
    | 'eventPrice'
    | 'eventPriceForKGEC'
    | 'startTime'
    | 'endTime'
    | 'eventVenue'
    | 'eventThumbnailImage'
    | 'eventType'
  > & {
    eventOrganiserClub: OrganisingClub;
  })[];
  totalCount: number;
  nextPage: number | null;
  currentPage: number;
  hasMore: boolean;
}

export interface CreateEventResponse {
  _id: string;
  title: string;
}

export interface EventResponse {
  _id: string;
  title: string;
  description: string;
  status?: EventStatus;
  rules?: string;
  prizes?: string;
  tagLine?: string;
  startTime: string;
  endTime: string;
  eventVenue: string;
  eventThumbnailImage?: string;
  eventCoverImage?: string;
  pastEventImages?: [string];
  otherPlatformUrl?: string;
  eventType: 'group' | 'solo';
  minTeamMembersSize?: number;
  maxTeamMembersSize?: number;
  eventPrice: number;
  eventPriceForKGEC?: number;
  isEventCancelled?: boolean;
  eventOrganiserClub: {
    name: string;
    logo: string;
  };
  createdBy: {
    name: string;
    phone: string;
    email: string;
    profileImageUrl: string;
  };
  eventCoordinators: {
    name: string;
    phone: string;
    email: string;
    profileImageUrl: string;
  }[];
  sponsors?: {
    name: string;
    type?: string;
    image?: string;
  }[];
}

export interface BookTicketResponse {
  _id: string;
  ticketNumber: string;
  order?: string;
}

export interface CheckinTicketArgs {
  ticketId: string;
}
export interface CheckinTicketResponse {
  _id: string;
  isCheckedIn: string;
}

export interface TicketResponse {
  _id: string;
  ticketNumber: string;
  event: Pick<EventResponse, 'title'>;
  user: Pick<UserSelfResponse, 'name' | 'email' | 'espektroId'>; // team leader
  isCheckedIn?: boolean;
  checkInTime?: string;
  team?: {
    name: string;
    members: Pick<
      UserSelfResponse,
      '_id' | 'name' | 'email' | 'phone' | 'college' | 'espektroId' | 'isFromKGEC' | 'isVolunteer' | 'profileImageUrl'
    >[];
  };
}

export interface CreatePaymentOrderResponse {
  order: {
    _id: string;
  };
  razorpayOrderId: string;
  amount: number;
  transaction: string;
}

export interface GetAllUAMUsersResponse {
  users: Pick<
    User,
    '_id' | 'name' | 'email' | 'phone' | 'college' | 'espektroId' | 'isFromKGEC' | 'isVolunteer' | 'profileImageUrl' | 'permissions'
  >[];
  total: number;
}

export interface GetWalletBalanceResponse {
  wallet: number;
  _id: string;
}
export interface AddAmountArgs {
  amount: number;
  transactionId: string;
}
export interface AddAmountResponse {
  _id: string;
  amount: number;
}

export interface DeductWalletAmountArgs {
  amount: number;
  eventId?: string;
}
export interface DeductWalletAmountResponse {
  _id: string;
  amount: number;
  transaction: string;
}

export interface UpdateUserDetailsArg {
  name?: string;
  email?: string;
  phone?: string;
  college?: string;
}

export interface UpdateUserDetailsResponse {
  name: string;
  email: string;
  phone: string;
  college: string;
}