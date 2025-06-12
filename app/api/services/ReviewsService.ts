/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ReviewsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List all reviews
     * @returns any Success
     * @throws ApiError
     */
    public getApiReviews(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/reviews',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new review
     * @returns any Success
     * @throws ApiError
     */
    public postApiReviews(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/reviews',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New review
     * @returns any Success
     * @throws ApiError
     */
    public getApiReviewsNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/reviews/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit review
     * @returns any Success
     * @throws ApiError
     */
    public getApiReviewsEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/reviews/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific review
     * @returns any Success
     * @throws ApiError
     */
    public getApiReviews1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/reviews/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a review
     * @returns any Success
     * @throws ApiError
     */
    public patchApiReviews(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/reviews/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a review
     * @returns any Success
     * @throws ApiError
     */
    public putApiReviews(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/reviews/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a review
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiReviews(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/reviews/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
