(function () {
    const Result = {
        checkAnswersLink: null,
        init() {
            const score = sessionStorage.getItem('score');
            const total = sessionStorage.getItem('total');
            if (score && total) {
                document.getElementById('result-score').innerText = score +
                    '/' + total;
            } else {
                location.href = 'index.html';
            }
            this.checkAnswersLink = document.getElementById('answers');
            this.checkAnswersLink.onclick = this.checkAnswers;
        },
        checkAnswers() {
            return location.href = 'check-result.html';
        }
    }

    Result.init();
})();