/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MatchesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Join match
     * @returns any Success
     * @throws ApiError
     */
    public postApiMatchesJoin(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/matches/{id}/join',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Leave match
     * @returns any Success
     * @throws ApiError
     */
    public postApiMatchesLeave(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/matches/{id}/leave',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Record result match
     * @returns any Success
     * @throws ApiError
     */
    public postApiMatchesRecordResult(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/matches/{id}/record_result',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upcoming match
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatchesUpcoming(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/matches/upcoming',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Nearby match
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatchesNearby(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/matches/nearby',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List all matches
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatches(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/matches',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new match
     * @returns any Success
     * @throws ApiError
     */
    public postApiMatches(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/matches',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New match
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatchesNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/matches/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit match
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatchesEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/matches/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific match
     * @returns any Success
     * @throws ApiError
     */
    public getApiMatches1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/matches/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a match
     * @returns any Success
     * @throws ApiError
     */
    public patchApiMatches(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/matches/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a match
     * @returns any Success
     * @throws ApiError
     */
    public putApiMatches(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/matches/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a match
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiMatches(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/matches/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
