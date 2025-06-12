/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SportsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List all sports
     * @returns any Success
     * @throws ApiError
     */
    public getApiSports(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/sports',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new sport
     * @returns any Success
     * @throws ApiError
     */
    public postApiSports(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/sports',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New sport
     * @returns any Success
     * @throws ApiError
     */
    public getApiSportsNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/sports/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit sport
     * @returns any Success
     * @throws ApiError
     */
    public getApiSportsEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/sports/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific sport
     * @returns any Success
     * @throws ApiError
     */
    public getApiSports1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/sports/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a sport
     * @returns any Success
     * @throws ApiError
     */
    public patchApiSports(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/sports/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a sport
     * @returns any Success
     * @throws ApiError
     */
    public putApiSports(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/sports/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a sport
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiSports(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/sports/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
