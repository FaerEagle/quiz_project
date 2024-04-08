import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {UrlManager} from "../utils/url-manager";

export class Result {

    constructor() {
        this.checkAnswersLink = null;
        this.checkAnswersLink = document.getElementById('answers');
        this.checkAnswersLink.onclick = this.checkAnswers.bind(this);
        this.routeParams = UrlManager.getQueryParams();

        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();

        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.message)
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }

        location.href = '#/';
    }

    checkAnswers() {
        return location.href = '#/check-result?id=' + this.routeParams.id;
    }
}