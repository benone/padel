/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PlayersService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Join match player
     * @returns any Success
     * @throws ApiError
     */
    public postApiPlayersJoinMatch(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/players/{id}/join_match',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List all players
     * @returns any Success
     * @throws ApiError
     */
    public getApiPlayers(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/players',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new player
     * @returns any Success
     * @throws ApiError
     */
    public postApiPlayers(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/players',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New player
     * @returns any Success
     * @throws ApiError
     */
    public getApiPlayersNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/players/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit player
     * @returns any Success
     * @throws ApiError
     */
    public getApiPlayersEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/players/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific player
     * @returns any Success
     * @throws ApiError
     */
    public getApiPlayers1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/players/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a player
     * @returns any Success
     * @throws ApiError
     */
    public patchApiPlayers(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/players/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a player
     * @returns any Success
     * @throws ApiError
     */
    public putApiPlayers(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/players/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a player
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiPlayers(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/players/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
