const trivia_url = 'https://opentdb.com/api.php?amount=10&type=multiple';
let questions = {};
let start = document.getElementById("start-btn");

const get_questions = async () => {

    console.log("Retrieving questions...");
    const request = await fetch(
        trivia_url, {
            headers: {'Accept': 'application/json'}
        });
    const data = await request.json();
    return data.results;
};

function disable_buttons() {
    const buttons = document.querySelectorAll('.btn');
    for (let button of buttons) {
        button.disabled = true;
    }
}

function check_answer(event) {
    let button = event.target;

    if (button.classList.contains('correct')) {
        button.classList.add('clicked');

        let current_score = document.getElementById("current_score");
        current_score.innerHTML = String(parseInt(current_score.innerHTML) + 1);

    } else {
        button.classList.add('clicked');
    }
    disable_buttons();
}

function get_new_question() {
    let current = document.getElementById("current_question");
    let id = parseInt(current.innerHTML);

    // clear old answer
    let answer_div = document.getElementById("answer_buttons");
    while (answer_div.firstChild) {
        answer_div.removeChild(answer_div.firstChild);
    }


    if (id === 0) {
        start.innerHTML = "Next Question";
    } else if (id === 9) {
        start.innerHTML = "Refresh the page to play again!";
        start.disabled = true;
    }

    let new_q = document.getElementsByClassName("question")[0]
    new_q.innerHTML = questions[id].question;
    const answers = questions[id].incorrect_answers;
    answers.push(questions[id].correct_answer);
    answers.sort();

    for (let answer of answers) {
        let answer_button = document.createElement("button");
        answer_button.classList.add("btn");
        if (questions[id].correct_answer === answer) {
            answer_button.classList.add("correct");
        }
        answer_button.innerHTML = answer;
        answer_button.onclick = check_answer;
        answer_div.appendChild(answer_button);
    }

    // increment current question
    current.innerHTML = String(id + 1);
}

window.onload = async function () {

    questions = await get_questions();
    console.log(questions);
    console.log("DONE");

    start.disabled = false;
};
