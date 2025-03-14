export const ORGANISING_CLUB_MAP = {
  ALL: 'All',
  RIYAZ: 'Riyaz',
  ELYSIUM: 'Elysium',
  SHUTTERBUG: 'Shutterbug',
  CHITRANK: 'Chitrank',
  LITMUS: 'Litmus',
  GDSC: 'Google Developer Student Club',
  ROBOTICS_SOCIETY: 'Robotics Society',
  SAC: 'Student Automobile Club',
  LESQUIZARABLE: 'Lesquizarable',
  INFINITIO: 'Infinitio',
  KEYGENCODERS: 'KeygenCoders',
  NOSCOPE: 'NoScope',
  IMPOSTER: 'Imposter',
  NOVA: 'Nova',
  SPORTRIX: 'Sportrix',
} as const;

export type OrganisingClub = keyof typeof ORGANISING_CLUB_MAP;
export const OrganisingClubArray = Object.keys(ORGANISING_CLUB_MAP);

export const EVENT_STATUS_MAP = {
  DRAFTED: 'drafted',
  PUBLISHED: 'published',
} as const;

export type EventStatus = (typeof EVENT_STATUS_MAP)[keyof typeof EVENT_STATUS_MAP];
export const EventStatusArray = Object.values(EVENT_STATUS_MAP);

export const EVENT_TYPE_MAP = {
  SOLO: 'solo',
  GROUP: 'group',
} as const;

export type EventType = (typeof EVENT_TYPE_MAP)[keyof typeof EVENT_TYPE_MAP];
export const EventTypeArray = Object.values(EVENT_TYPE_MAP);

export const PERMISSIONS = {
  // handling user roles
  ASSIGN_ROLE: 'assign:role',
  REVOKE_ROLE: 'revoke:role',

  // handling event permissions
  CREATE_EVENT: 'create:event',
  UPDATE_EVENT: 'update:event',
  DELETE_EVENT: 'delete:event',
  ASSIGN_EVENT: 'assign:event',
  REVOKE_EVENT: 'revoke:event',
  VIEW_EVENT: 'view:event',

  // handling payment permissions
  // can view all the payments logs
  PAYMENT_LOGS: 'payment:logs',

  // handling addition of coins in wallet
  /**
   * @description This permission is used to add coins to a user's wallet
   */
  ADD_COINS: 'add:coins',
  /**
   * @description This permission is used to revoke coins from a user's wallet
   */
  REVOKE_COINS: 'revoke:coins',

  // assign volunteer to an event
  ASSIGN_VOLUNTEER: 'assign:volunteer',
  // revoke volunteer from an event
  REVOKE_VOLUNTEER: 'revoke:volunteer',

  // handling visibility permissions
  ADMIN_READONLY: 'admin:readonly',
  VOLUNTEER_READONLY: 'volunteer:readonly',
  USER_READONLY: 'user:readonly',
} as const;

export const PaymentMethodMap = {
  WALLET: 'wallet',
  RAZORPAY: 'razorpay',
} as const;

export const FallbacKImage = 'https://via.placeholder.com/300x200';

export type PaymentMethod = (typeof PaymentMethodMap)[keyof typeof PaymentMethodMap];

export const PointsMap = {
  DAILY_ACTIVE: 'daily_active',
  EVENT_REGISTRATION: 'event_registration',
  EVENT_PARTICIPATION: 'event_participation',
  EVENT_WINNER: 'event_winner',
  EVENT_RUNNER_UP: 'event_runner_up',
  EVENT_THIRD: 'event_third',
  REFER_FRIEND: 'refer_friend',
  WALLET_RECHARGE: 'wallet_recharge',
} as const;

export const PointsDescriptionMap = {
  [PointsMap.DAILY_ACTIVE]: 'Earn points daily by being active on the platform.',
  [PointsMap.EVENT_REGISTRATION]: 'Get rewarded for registering for events on the platform.',
  [PointsMap.EVENT_PARTICIPATION]: 'Earn points for actively participating in events.',
  [PointsMap.EVENT_WINNER]: 'Winning an event grants you bonus points!',
  [PointsMap.EVENT_RUNNER_UP]: 'Secure second place in an event to earn additional points.',
  [PointsMap.EVENT_THIRD]: 'Finish in third place and receive points as a reward.',
  [PointsMap.REFER_FRIEND]: 'Invite friends to join and earn points when they sign up.',
  [PointsMap.WALLET_RECHARGE]: 'Recharge your wallet and get rewarded with points.',
} as const;
