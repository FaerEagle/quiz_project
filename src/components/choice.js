import {UrlManager} from "../utils/url-manager.js";

export class Choice {

    constructor() {
        this.quizzes = [];
        UrlManager.checkUserData();

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://testologia.site/get-quizzes', false);
        xhr.send();

        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.quizzes = JSON.parse(xhr.responseText);
            } catch (e) {
                location.href = '#/';
            }
            this.processQuizzes();
        } else {
            location.href = '#/';
        }
    }

    processQuizzes() {
        const choiceOptionsElements = document.getElementById('choice-options');
        if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
                const that = this;
                const choiceOptionElement = document.createElement('div');
                choiceOptionElement.className = 'choice-option';
                choiceOptionElement.setAttribute('data-id', quiz.id);
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this);
                }

                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice-option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice-option-arrow';

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', '/images/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);
                choiceOptionsElements.appendChild(choiceOptionElement);
            });
        }
    }

    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id');
        if (dataId) {
            sessionStorage.setItem('testId', dataId);
            location.href = '#/test';
        }
        /*Вариант условия для работы с URL-параметрами
        if (dataId) {
                location.href = '#/test?name=' + this.routeParams.name + '&lastName=' + this.routeParams.lastName +
                '&email=' + this.routeParams.email + '&id=' + dataId;
        }*/

    }
}