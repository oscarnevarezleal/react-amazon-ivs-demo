import {Api} from "../API";
import {API_BASE_URL} from '../api.config';

const API_NEW_MEETING = '/join';

export default class ChimeApi extends Api {

    /**
     *
     * @param querystring
     * @param params
     */
    public createMeeting(querystring?: string, params?: object) {
        return this.post(API_NEW_MEETING + (querystring ? `?${querystring}` : ''), params)
            .then((axiosResponse) => {
                return axiosResponse.data;
            })
            .catch((error) => {
                throw error;
            });
    }
}

export const chimeApi = new ChimeApi({baseURL: API_BASE_URL})
