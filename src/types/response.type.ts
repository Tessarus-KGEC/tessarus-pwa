import { EventStatus, OrganisingClub } from '../constants';
import { User } from './app.type';

export interface LoginResponse {
  otp_token: string;
  expiryTime: number;
}

export interface VerifyOTPResponse {
  accessToken: string;
}

export interface UserSelfResponse extends User {}

export interface EventCoordinatorsResponse extends Pick<User, '_id' | 'name' | 'email' | 'isFromKGEC' | 'isVolunteer' | 'profileImageUrl'> {}

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
  events: Pick<
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
  >[];
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
  eventOrganiserClub: OrganisingClub;
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

export interface TicketResponse {
  _id: string;
  ticketNumber: string;
  event: Pick<EventResponse, 'title'>;
  user: Pick<UserSelfResponse, 'name' | 'email' | 'espektroId'>; // team leader
  order?: {
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    paymentVerified?: boolean;
  };
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
  orderId: string;
  amount: number;
}
