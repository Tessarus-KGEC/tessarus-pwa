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
