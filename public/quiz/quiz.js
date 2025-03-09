document.addEventListener("DOMContentLoaded", () => {
    
    const params = new URLSearchParams(location.href.split("?")[1]);
    const quizId = params.get("id");
    const className = params.get("className");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");
    
    let questionCounter = 0;
    const totalQuizPoints = 100;
    const bonusQuizPoints = 25;

    const requiredTheshold = .70;
    const quizData = db[quizId];
    const questionLength = 12;
    let questions = quizData.questions.slice(0, questionLength);

    const answersContainer = document.getElementById("answers-container");
    const answerTemplate = document.getElementById("answer-template");
    const questionText = document.getElementById("tquestion-text");
    const quizTitle = document.getElementById('quiz-title');
    const buttonNext = document.getElementById('button-next');
    const buttonCheck = document.getElementById('button-check');
    const buttonReset = document.getElementById('button-reset');
    const buttonEnd = document.getElementById('button-end');
    const progress = document.getElementById('progress');
    const answeredQuestions = document.getElementById('answered-questions');
    const totalQuestions = document.getElementById('total-questions');
    const requiredQuestionsLbl = document.getElementById('required-questions');
    const correctAnswersLbl = document.getElementById('correct-answers');
    const userName = document.getElementById('username');

    const cardIcon = document.getElementById('card-icon');
    const card = document.getElementById('card');
    const questionContainer = document.getElementById('question-container');
    const scoreScreen = document.getElementById('score-screen');
    const scoreScreenTitle = document.getElementById('score-screen-title');
    const scoreScreenTxt = document.getElementById('score-screen-txt');
    const questionImg = document.getElementById('question-img');

    let correctAnswerCnt = 0;
    let requiredQuestionCnt = Math.ceil(questions.length * requiredTheshold);

    

    quizTitle.textContent = quizData.title;
    userName.textContent = `${firstName} ${lastName} - ${className}`;

    buttonNext.addEventListener('click', () => {
        nextQuestion();
    });
    buttonCheck.addEventListener('click', () => {
        checkAnswer();
    });
    buttonReset.addEventListener('click', () => {
        reset();
    });
    buttonEnd.addEventListener('click', () => {
        postResult();
    });

    totalQuestions.textContent = questions.length;
    requiredQuestionsLbl.textContent = requiredQuestionCnt;

    // Funktion zum Mischen eines Arrays
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function checkAnswer() {
        buttonCheck.hidden = true;
        buttonNext.hidden = false;
        const question = questions[questionCounter];
        // Sammle alle ausgewählten Optionen
        const selected = Array.from(document.querySelectorAll(`input[name="answer"]:checked`))
                .map(input => parseInt(input.value)); // Array mit gewählten Indizes

        // Überprüfe die Richtigkeit
        const isCorrect =
                question.options.every((option, i) =>
                    ((option.correct || false) && selected.includes(i)) || // Korrekte Antwort ist gewählt
                            (!(option.correct || false) && !selected.includes(i))  // Falsche Antwort ist nicht gewählt
                );

        answerUserFeedback(isCorrect);
        if (isCorrect) {
            correctAnswerCnt++;
        }
        questionCounter++;
    }

    function answerUserFeedback(isCorrect) {
        cardIcon.style.display = 'inline-block';
        cardIcon.textContent = isCorrect ? 'check' : 'close';
        cardIcon.style.color = isCorrect ? 'green' : 'red';
        card.style.backgroundColor = isCorrect ? '#e0ffe0' : '#ffefef';
    }

    function resetUserFeedback() {
        cardIcon.style.display = 'none';
        card.style.backgroundColor = 'white';
    }

    function showScore() {
        scoreScreen.hidden = false;
        questionContainer.hidden = true;

        if (correctAnswerCnt === questions.length) {
            scoreScreenTitle.textContent = 'Perfekt!!! 😃';
            scoreScreenTxt.innerHTML = `Du hast <b>alle Fragen</b> richtig beantwortet. Du hast somit <span class="points">${totalQuizPoints + bonusQuizPoints} Punkte</span> und <span class="credits">💎 ${totalQuizPoints + bonusQuizPoints} </span> verdient.`;
            buttonEnd.hidden = false;
        } else if (correctAnswerCnt >= requiredQuestionCnt) {
            scoreScreenTitle.textContent = 'Suuuper! 🙂';
            scoreScreenTxt.innerHTML = `Du hast <b>${correctAnswerCnt}</b> von <b>${questions.length} Fragen</b> richtig beantwortet. Du hast somit <span class="points">${Math.round(totalQuizPoints * (correctAnswerCnt / questions.length))} Punkte</span> und <span class="credits">💎 ${Math.round(totalQuizPoints * (correctAnswerCnt / questions.length))} </span> verdient. Wenn du die volle Punktzahl erreichst bekommst du 25 Punkte zusaetzlich.`;
            buttonEnd.hidden = false;
            buttonReset.hidden = false;
        } else {
            scoreScreenTitle.textContent = 'Schade. 😐';
            scoreScreenTxt.innerHTML = `Du hast nur <b>${correctAnswerCnt}</b> von <b>${questions.length} Fragen</b> richtig beantwortet. Du musst mindestens <b>${requiredQuestionCnt} Fragen </b> richtig beantworten um Punkte zu bekommen. Bitte versuche es nocheinmal.`;
            buttonReset.hidden = false;
        }
        updateProgress(100);
    }

    function showQuestion() {
        answersContainer.textContent = '';

        const question = questions[questionCounter];
        shuffleArray(question.options).forEach((answer, index) => {
            const clone = answerTemplate.content.cloneNode(true);
            const input = clone.querySelector('input');
            const span = clone.querySelector('.mdl-checkbox__label');
            const label = clone.querySelector('.answer-label');
            const questionTitle = input.id = `a${index}`;

            input.value = index;
            span.textContent = answer.text;
            label.setAttribute('for', `a${index}`);

            answersContainer.appendChild(clone);
        });

        questionText.textContent = question.text;
        questionImg.setAttribute('src', question.img ? question.img : "src/placeholder.jpg");

        componentHandler.upgradeDom();
    }

    function updateProgress(percentage) {
        answeredQuestions.textContent = questionCounter;
        correctAnswersLbl.textContent = correctAnswerCnt;
        progress.MaterialProgress.setProgress(percentage);
    }

    function nextQuestion() {
        buttonNext.hidden = true;
        resetUserFeedback();
        if (questionCounter < questions.length) {
            buttonCheck.hidden = false;
            showQuestion();
            updateProgress((questionCounter / questions.length) * 100);
        } else {
            showScore();
        }
    }

    function reset() {
        buttonNext.hidden = true;
        buttonCheck.hidden = false;
        buttonReset.hidden = true;
        buttonEnd.hidden = true;
        scoreScreen.hidden = true;
        questionContainer.hidden = false;
        questionCounter = 0;
        correctAnswerCnt = 0;
        questions = shuffleArray(questions);
        nextQuestion();
    }

    function showSpinner(show) {
        const spinner = document.getElementById('spinner');
        if (show) {
            spinner.classList.add("is-active");
        } else {
            spinner.classList.remove("is-active");
        }
    }

    function postResult() {        
        _login_token = getCookie('login_token');

        if (!_login_token) {
            // Redirect to index.html
            throw new Error("No login token.");
        }

        const [schoolId, className, hash] = _login_token.split('|');

        //const apiUrl = "https://script.google.com/macros/s/AKfycby8il1TZFhPqQPZWnEZ7w_XkgUiSppU8RM9ezsuEzHoClA6Rt1WkrVVcKqwr3Z5NcE/exec";
        const apiUrl = `${BASE_URL}/api/quiz/`;

        showSpinner(true);
        buttonEnd.hidden = true;

        fetch(apiUrl, {
            method: "POST", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify JSON format
            },
            body: JSON.stringify({
                schoolId: schoolId,
                className: className,
                hash: hash,
                quizId: quizId,
                score: correctAnswerCnt,
                total: questions.length
            })
        })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Parse JSON response
                })
                .then((data) => {
                    console.log("Response from API:", data);
                    showSnackbar("Ergebnis eingereicht. Du kannst das Quiz jetzt schließen.");
                })
                .catch((error) => {
                    console.error("Error posting data:", error);
                    showSnackbar(error.message);
                    buttonEnd.hidden = false;
                })
                .finally(() => {
                    showSpinner(false);
                });
    }

    componentHandler.upgradeDom();

    reset();
});

