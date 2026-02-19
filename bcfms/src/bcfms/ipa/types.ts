import type { IPAType } from '@/bcfms/ipa/schema/IPASchema.ts';

export type IPAListResponseType = {
    count: number;
    next: string;
    previous: string;
    results: IPAType[];
};
