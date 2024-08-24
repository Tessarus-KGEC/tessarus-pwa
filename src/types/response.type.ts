import { EventType } from 'react-hook-form';
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

export interface GetAllEventsResponse {
  events: {
    _id: string;
    title: string;
    description: string;
    status: EventStatus;
    eventPrice: number;
    eventPriceForKGEC: number;
    startTime: string;
    endTime: string;
    eventVenue: string;
    eventThumbnailImage: string;
    eventType: EventType;
    eventOrganiserClub: OrganisingClub;
  }[];
  totalCount: number;
}

export interface CreateEventResponse {
  _id: string;
  title: string;
}
