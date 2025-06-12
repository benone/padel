/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PostsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Like post
     * @returns any Success
     * @throws ApiError
     */
    public postApiPostsLike(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/posts/{id}/like',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List all posts
     * @returns any Success
     * @throws ApiError
     */
    public getApiPosts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/posts',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create a new post
     * @returns any Success
     * @throws ApiError
     */
    public postApiPosts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/posts',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * New post
     * @returns any Success
     * @throws ApiError
     */
    public getApiPostsNew(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/posts/new',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit post
     * @returns any Success
     * @throws ApiError
     */
    public getApiPostsEdit(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/posts/{id}/edit',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get a specific post
     * @returns any Success
     * @throws ApiError
     */
    public getApiPosts1(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/posts/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a post
     * @returns any Success
     * @throws ApiError
     */
    public patchApiPosts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/posts/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update a post
     * @returns any Success
     * @throws ApiError
     */
    public putApiPosts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/posts/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete a post
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiPosts(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/posts/{id}',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
