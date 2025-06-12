/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PaymentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List all payments
     * @returns any Success
     * @throws ApiError
     */
    public getApiPayments(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/payments',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new payment
     * @returns any Success
     * @throws ApiError
     */
    public postApiPayments(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/payments',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New payment
     * @returns any Success
     * @throws ApiError
     */
    public getApiPaymentsNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/payments/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit payment
     * @returns any Success
     * @throws ApiError
     */
    public getApiPaymentsEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/payments/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific payment
     * @returns any Success
     * @throws ApiError
     */
    public getApiPayments1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/payments/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a payment
     * @returns any Success
     * @throws ApiError
     */
    public patchApiPayments(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/payments/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a payment
     * @returns any Success
     * @throws ApiError
     */
    public putApiPayments(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/payments/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a payment
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiPayments(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/payments/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
