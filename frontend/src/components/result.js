import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";

export class Result {

    constructor() {
        this.checkAnswersLink = null;
        this.testId = sessionStorage.getItem('testId');

        this.checkAnswersLink = document.getElementById('answers');
        this.checkAnswersLink.onclick = this.checkAnswers;
        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        if (this.testId) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result?userId=' + userInfo.userId);

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
        return location.href = '#/check-result';
    }
}