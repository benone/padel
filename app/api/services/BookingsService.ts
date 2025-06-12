/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class BookingsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Available slots booking
     * @returns any Success
     * @throws ApiError
     */
    public getApiBookingsAvailableSlots(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/bookings/available_slots',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List all bookings
     * @returns any Success
     * @throws ApiError
     */
    public getApiBookings(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/bookings',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new booking
     * @returns any Success
     * @throws ApiError
     */
    public postApiBookings(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bookings',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New booking
     * @returns any Success
     * @throws ApiError
     */
    public getApiBookingsNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/bookings/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit booking
     * @returns any Success
     * @throws ApiError
     */
    public getApiBookingsEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/bookings/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific booking
     * @returns any Success
     * @throws ApiError
     */
    public getApiBookings1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/bookings/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a booking
     * @returns any Success
     * @throws ApiError
     */
    public patchApiBookings(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/bookings/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a booking
     * @returns any Success
     * @throws ApiError
     */
    public putApiBookings(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/bookings/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a booking
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiBookings(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/bookings/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
