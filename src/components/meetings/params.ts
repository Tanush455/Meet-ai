import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs/server';
import { MeetingStatus } from './types';

export const filterSearchParams = {
    search: parseAsString.withDefault("").withOptions({
        clearOnDefault: true,
    }),
    page: parseAsInteger.withDefault(1).withOptions({
        clearOnDefault: true,
    }),
    status: parseAsStringEnum(Object.values(MeetingStatus)).withOptions({
        clearOnDefault: true,
    }),
    agentId: parseAsString.withDefault("").withOptions({
        clearOnDefault: true,
    })
};

export const loadSearchParams = createLoader(filterSearchParams);