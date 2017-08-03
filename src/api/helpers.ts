import { ApiError } from '../types/spotify';

export function isApiError(res: ApiError | any): res is ApiError {
    return !!res.error;
}
