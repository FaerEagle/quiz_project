(function () {
    const Check = {
        quiz: null,
        rightAnswers: null,
        returnToResultLink: null,
        questionsElement: null,
        userResult: JSON.parse(sessionStorage.getItem('results')),
        init() {
            checkUserData();
            const testId = sessionStorage.getItem('testId');
            if (testId) {
                const xhrQuiz = new XMLHttpRequest();
                const xhrAnswers = new XMLHttpRequest();
                xhrQuiz.open('GET', 'https://testologia.site/get-quiz?id=' + testId, false);
                xhrAnswers.open('GET', 'https://testologia.site/get-quiz-right?id=' + testId, false);
                xhrQuiz.send();
                xhrAnswers.send();

                if (xhrQuiz.status === 200 && xhrQuiz.responseText && xhrAnswers.status === 200 && xhrAnswers.responseText) {
                    try {
                        this.quiz = JSON.parse(xhrQuiz.responseText);
                        this.rightAnswers = JSON.parse(xhrAnswers.responseText);
                    } catch (e) {
                        location.href = 'index.html';
                    }
                    this.showQuestions();
                } else {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }
            this.returnToResultLink = document.getElementById('return');
            this.returnToResultLink.onclick = this.returnToResult;
        },
        returnToResult() {
            return location.href = 'result.html';
        },
        showQuestions() {
            const that = this;
            const questions = this.quiz.questions;
            this.questionsElement = document.getElementById('questions');
            document.getElementById('test-name').innerText = this.quiz.name;
            document.getElementById('user-data').innerText = sessionStorage.getItem('name') +
                ' ' + sessionStorage.getItem('lastName') + ', ' + sessionStorage.getItem('email');
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
                    const chosenOption = this.userResult.results.find(item => item.questionId === question.id);
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
                    if (chosenOption && chosenOption.chosenAnswerId === answer.id && chosenOption.chosenAnswerId === that.rightAnswers[question.id - 1]) {
                        optionElement.classList.add('right');
                    } else if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
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

    Check.init();
})();