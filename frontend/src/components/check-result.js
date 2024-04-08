import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Check {

    constructor() {
        this.quiz = null;
        this.rightAnswers = null;
        this.returnToResultLink = null;
        this.questionsElement = null;
        this.userResult = JSON.parse(sessionStorage.getItem('results'));
        this.routeParams = UrlManager.getQueryParams();
        this.userInfo = Auth.getUserInfo();

        this.returnToResultLink = document.getElementById('return');
        this.returnToResultLink.onclick = this.returnToResult.bind(this);
        this.init();
    }

    async init() {

        if (!this.userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {

            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error)
                    }
                    this.quiz = result.test;
                    if (this.quiz) {
                        this.showQuestions();
                    }
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }

        location.href = '#/';
    }

    returnToResult() {
        return location.href = '#/result?id=' + this.routeParams.id;
    }

    showQuestions() {
        const that = this;
        const questions = this.quiz.questions;
        this.questionsElement = document.getElementById('questions');
        document.getElementById('test-name').innerText = this.quiz.name;
        document.getElementById('user-data').innerText = this.userInfo.fullName + ', ' + this.userInfo.email;
        this.questionsElement.innerHTML = '';
        questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'check-test-question';
            const questionTitleElement = document.createElement('div');
            questionTitleElement.className = 'check-test-question-title test-question-title';
            questionTitleElement.innerHTML = '<span>Вопрос ' + question.id + ':</span> ' + question.question;
            const questionOptionsElement = document.createElement('div');
            questionOptionsElement.className = 'check-test-question-options test-question-options';
            questionElement.appendChild(questionTitleElement);

            question.answers.forEach((answer) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'check-test-question-option test-question-option';

                const inputId = 'answer-' + answer.id;
                const inputElement = document.createElement('input');
                inputElement.className = 'option-answer';
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer-' + question.id);
                inputElement.setAttribute('value', answer.id);
                inputElement.setAttribute('disabled', 'disabled');
                if (answer.correct) {
                    optionElement.classList.add('right');
                } else if (answer.hasOwnProperty('correct') && !answer.correct) {
                    optionElement.classList.add('wrong');
                }

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);

                questionOptionsElement.appendChild(optionElement);
            });

            questionElement.appendChild(questionOptionsElement);
            this.questionsElement.appendChild(questionElement);
        });
    }
}