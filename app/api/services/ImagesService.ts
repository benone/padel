/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ImagesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Generate image
     * @returns any Success
     * @throws ApiError
     */
    public getApiImagesGenerate(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/images/generate',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
