// Export generated API types for use throughout the app
export type {
  User,
  Match,
  Club,
  Booking,
  Post,
  Player,
  Sport,
  Court,
  Review,
  Notification,
  Payment,
  Session,
  MatchParticipant,
  Like,
  Follow,
  SupportTicket,
  PlayerSession,
  ClubSport
} from '../api';

// Re-export services for easier importing
export {
  BookingsService,
  ClubsService,
  CourtsService,
  ImagesService,
  MatchesService,
  MatchParticipantsService,
  NotificationsService,
  PaymentsService,
  PlayersService,
  PostsService,
  ReviewsService,
  SportsService
} from '../api';

// Export the main API client
export { PadelClubApi } from '../api';

// Export OpenAPI configuration
export { OpenAPI } from '../api';