//https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _totalScore = document.getElementById('total-score');
const _checkButton = document.getElementById('check-answer');
const _nextButton = document.getElementById('next-question');
const _tryAgainButton = document.getElementById('try-again');
const _result = document.getElementById('result');

let correctAnswer = "";
let score = 0;

// Event Listeners
function eventListeners()
{
    _checkButton.addEventListener('click', checkAnswer);
    _nextButton.addEventListener('click', loadQuestion);
    _tryAgainButton.addEventListener('click', loadQuestion);
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
    _totalScore.innerHTML = `Total Score: ${score}`;
});

async function loadQuestion()
{
    const apiURL = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${apiURL}`);
    const data = await result.json();
    //console.log(data.results[0]);

    _result.innerHTML = "";
    _totalScore.innerHTML = `Total Score: ${score}`;
    showQuestion(data.results[0]);
    _nextButton.style.display = "none";
    _tryAgainButton.style.display = "none";
}

// Display Questions and Answers
function showQuestion(data)
{
    _checkButton.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswers = data.incorrect_answers;
    let possibleAnswers = incorrectAnswers;

    // Insert Answers into Game with Correct One in Random Location
    possibleAnswers.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0 , correctAnswer);

    _question.innerHTML = `${data.question} <br> <span class = "category">${data.category} </span>`;

    _options.innerHTML = `
        ${possibleAnswers.map((option, index) => `
            <li><span> ${option} </span> </li>
        `).join('')}
    `;

    selectOption();
}

// Option Selection
function selectOption()
{
    _options.querySelectorAll("li").forEach((option) => {
        option.addEventListener('click', () => {
            if(_options.querySelector('.selected'))
            {
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// Answer Checking
function checkAnswer()
{
    _checkButton.disabled = true;
    if(_options.querySelector('.selected'))
    {
        let selectedAnswer = _options.querySelector('.selected span').textContent.replace(/\s/g, '');
        let answer = correctAnswer.replace(/\s/g, '');
        console.log(selectedAnswer);
        console.log(answer);
        console.log("[" + selectedAnswer + answer + "]");
        if(selectedAnswer == answer)
        {
            score++;
            _totalScore.innerHTML = `Total Score: ${score}`;
            _result.innerHTML = `<p>Correct Answer!</p>`
            _nextButton.style.display = "block";
        }else
        {
            _result.innerHTML = `<p>Wrong Answer! <b>Correct Answer: ${correctAnswer}</b></p>`;
            score = 0;
            _tryAgainButton.style.display = "block";
        }

    }
}