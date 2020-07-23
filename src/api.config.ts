import * as qs from "qs";
import {PathLike} from "fs";
// https://gist.githubusercontent.com/EnetoJara/331960fbb8744abca3d7dd600a28e829/raw/9e93c17f37734d654dfbe0833f358dac4caa0e9e/api.config.ts

export const API_BASE_URL = 'http://localhost:8080';
export const apiConfig = {
    returnRejectedPromiseOnError: true,
    withCredentials: true,
    timeout: 30000,
    baseURL: API_BASE_URL,
    headers: {
        common: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    },
    paramsSerializer: (params: PathLike) => qs.stringify(params, {indices: false}),
}
