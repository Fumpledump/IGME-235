//https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _totalScore = document.getElementById('total-score');
const _checkButton = document.getElementById('check-answer');
const _nextButton = document.getElementById('next-question');
const _tryAgainButton = document.getElementById('try-again');
const _result = document.getElementById('result');
const _startScreen = document.getElementById('start-screen');
const _startButton = document.getElementById('start-button');
const _restartButton = document.getElementById('restart');
const _gameContainer = document.querySelector('.game-container');
const _gameBody = document.querySelector('.game-body');
const _loadingScreen = document.getElementById('loading-screen');


function startGame()
{
    _startScreen.style.display = "none";
    _gameContainer.style.display = "block";
    loadQuestion();
}

function restart()
{
    _startScreen.style.display = "flex";
    _gameContainer.style.display = "none";
}


let correctAnswer = "";
let score = 0;

// Event Listeners
function eventListeners()
{
    _startButton.addEventListener('click', startGame);
    _checkButton.addEventListener('click', checkAnswer);
    _nextButton.addEventListener('click', loadQuestion);
    _tryAgainButton.addEventListener('click', loadQuestion);
    _restartButton.addEventListener('click', restart);
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
    _totalScore.innerHTML = `Total Score: ${score}`;
});

document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
});

let anyCategory = true;
let anyDifficulty = true;
let anyType = true;

async function loadQuestion()
{
    _gameBody.style.display = "none";
    _loadingScreen.style.display = "block";

    // Difficutly Setting
    const difficulty = document.getElementById('difficulty-select').value;
    let difficultySetting = "";
    if(difficulty != "any")
    {
        difficultySetting = `&difficulty=${difficulty}`;
        anyDifficulty = false;
    }

    // Category Setting
    const category = document.getElementById('category-select').value;
    let categorySetting = "";
    categoryChoice = category;
    if(category != "any")
    {
        categorySetting = `&category=${category}`;
        anyCategory = false;
    }

    // Category Setting
    const type = document.getElementById('type-select').value;
    let typeSetting = "";
    if(type != "any")
    {
        typeSetting = `&type=${type}`;
        anyType = false;
    }

    const apiURL = `https://opentdb.com/api.php?amount=1${categorySetting}${difficultySetting}${typeSetting}`;
    const result = await fetch(`${apiURL}`);
    const data = await result.json();
    //console.log(data.results[0]);

    console.log(apiURL);

    _result.innerHTML = "";
    _totalScore.innerHTML = `Total Score: ${score}`;
    showQuestion(data.results[0]);
    _nextButton.style.display = "none";
    _tryAgainButton.style.display = "none";
    _restartButton.style.display = "none";
    _gameBody.style.display = "block";
    _loadingScreen.style.display = "none";
}

// Display Questions and Answers
function showQuestion(data)
{
    _checkButton.disabled = false;
    _checkButton.style.display = "block";
    correctAnswer = data.correct_answer;
    let incorrectAnswers = data.incorrect_answers;
    let possibleAnswers = incorrectAnswers;

    // Insert Answers into Game with Correct One in Random Location
    possibleAnswers.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0 , correctAnswer);

    let currentSettings = "";
    if(!anyCategory)
    {
        currentSettings += `<span class = "category">${data.category} </span>`;
    }
    if(!anyDifficulty)
    {
        currentSettings += `<span class = "category">${data.difficulty} </span>`;
    }
    if(!anyType)
    {
        currentSettings += `<span class = "category">${data.type} </span>`;
    }

    _question.innerHTML = `${data.question} <br> ${currentSettings}`;

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
    if(_options.querySelector('.selected'))
    {
        _checkButton.style.display = "none";

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
            _restartButton.style.display = "block";
        }

    }
}