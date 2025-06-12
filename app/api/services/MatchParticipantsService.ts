/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MatchParticipantsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List all match_participants
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatchParticipants(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/match_participants',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new match_participant
     * @returns any Success
     * @throws ApiError
     */
    public postApiMatchParticipants(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/match_participants',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New match_participant
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatchParticipantsNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/match_participants/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit match_participant
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatchParticipantsEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/match_participants/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific match_participant
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatchParticipants1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/match_participants/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a match_participant
     * @returns any Success
     * @throws ApiError
     */
    public patchApiMatchParticipants(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/match_participants/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a match_participant
     * @returns any Success
     * @throws ApiError
     */
    public putApiMatchParticipants(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/match_participants/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a match_participant
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiMatchParticipants(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/match_participants/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
