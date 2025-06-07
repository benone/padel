export const DATES = [
  { day: 'ПТ', date: 6, month: 'Июн' },
  { day: 'СБ', date: 7, month: 'Июн' },
  { day: 'ВС', date: 8, month: 'Июн' },
  { day: 'ПН', date: 9, month: 'Июн' },
  { day: 'ВТ', date: 10, month: 'Июн' },
  { day: 'СР', date: 11, month: 'Июн' },
  { day: 'ЧТ', date: 12, month: 'Июн' },
];

export const TIME_SLOTS = [
  '08:00', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00',
  '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '21:30',
];

export const TABS = {
  HOME: 'home',
  RESERVE: 'reserve',
  MATCHES: 'matches',
  ACTIVE: 'active',
};

export const TAB_CONFIG = {
  [TABS.HOME]: { title: 'Главная' },
  [TABS.RESERVE]: { title: 'Забронировать' },
  [TABS.MATCHES]: { title: 'Открытые матчи' },
  [TABS.ACTIVE]: { title: 'Активные' },
};