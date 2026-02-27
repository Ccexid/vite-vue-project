/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SearchItem {
    id: string | number;
    title: string;
    description?: string;
    [key: string]: any;
}