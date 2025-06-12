/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CourtsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List all courts
     * @returns any Success
     * @throws ApiError
     */
    public getApiCourts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/courts',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new court
     * @returns any Success
     * @throws ApiError
     */
    public postApiCourts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/courts',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New court
     * @returns any Success
     * @throws ApiError
     */
    public getApiCourtsNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/courts/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit court
     * @returns any Success
     * @throws ApiError
     */
    public getApiCourtsEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/courts/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific court
     * @returns any Success
     * @throws ApiError
     */
    public getApiCourts1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/courts/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a court
     * @returns any Success
     * @throws ApiError
     */
    public patchApiCourts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/courts/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a court
     * @returns any Success
     * @throws ApiError
     */
    public putApiCourts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/courts/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a court
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiCourts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/courts/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
