import request, {Method} from "@/utils/request";
import {converToUrl} from "@/utils/paramUtils";

export function getFlvUrl (data) {
    return request({
        url: `/barrage/flvUrl`+converToUrl(data),
        method: Method.GET,
        needToken: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
}







