/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Payment = {
    id?: number;
    player_id?: number;
    payable_type?: string;
    payable_id?: number;
    payment_type?: number;
    amount?: number;
    currency?: string;
    payment_method?: string;
    status?: number;
    transaction_id?: string;
    gateway_response?: string;
    refund_amount?: number;
    refund_reason?: string;
    completed_at?: string;
    refunded_at?: string;
    created_at?: string;
    updated_at?: string;
};

