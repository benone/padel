/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { BookingsService } from './services/BookingsService';
import { ClubsService } from './services/ClubsService';
import { CourtsService } from './services/CourtsService';
import { ImagesService } from './services/ImagesService';
import { MatchesService } from './services/MatchesService';
import { MatchParticipantsService } from './services/MatchParticipantsService';
import { NotificationsService } from './services/NotificationsService';
import { PaymentsService } from './services/PaymentsService';
import { PlayersService } from './services/PlayersService';
import { PostsService } from './services/PostsService';
import { ReviewsService } from './services/ReviewsService';
import { SportsService } from './services/SportsService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class PadelClubApi {
    public readonly bookings: BookingsService;
    public readonly clubs: ClubsService;
    public readonly courts: CourtsService;
    public readonly images: ImagesService;
    public readonly matches: MatchesService;
    public readonly matchParticipants: MatchParticipantsService;
    public readonly notifications: NotificationsService;
    public readonly payments: PaymentsService;
    public readonly players: PlayersService;
    public readonly posts: PostsService;
    public readonly reviews: ReviewsService;
    public readonly sports: SportsService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE,
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.bookings = new BookingsService(this.request);
        this.clubs = new ClubsService(this.request);
        this.courts = new CourtsService(this.request);
        this.images = new ImagesService(this.request);
        this.matches = new MatchesService(this.request);
        this.matchParticipants = new MatchParticipantsService(this.request);
        this.notifications = new NotificationsService(this.request);
        this.payments = new PaymentsService(this.request);
        this.players = new PlayersService(this.request);
        this.posts = new PostsService(this.request);
        this.reviews = new ReviewsService(this.request);
        this.sports = new SportsService(this.request);
    }
}

