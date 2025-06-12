/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClubsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Nearby club
     * @returns any Success
     * @throws ApiError
     */
    public getApiClubsNearby(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/clubs/nearby',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Default club
     * @returns any Success
     * @throws ApiError
     */
    public getApiClubsDefault(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/clubs/default',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Availability club
     * @returns any Success
     * @throws ApiError
     */
    public getApiClubsAvailability(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/clubs/{id}/availability',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List all clubs
     * @returns any Success
     * @throws ApiError
     */
    public getApiClubs(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/clubs',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new club
     * @returns any Success
     * @throws ApiError
     */
    public postApiClubs(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/clubs',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New club
     * @returns any Success
     * @throws ApiError
     */
    public getApiClubsNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/clubs/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit club
     * @returns any Success
     * @throws ApiError
     */
    public getApiClubsEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/clubs/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific club
     * @returns any Success
     * @throws ApiError
     */
    public getApiClubs1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/clubs/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a club
     * @returns any Success
     * @throws ApiError
     */
    public patchApiClubs(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/clubs/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a club
     * @returns any Success
     * @throws ApiError
     */
    public putApiClubs(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/clubs/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a club
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiClubs(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/clubs/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
