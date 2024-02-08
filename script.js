const trivia_url = 'https://opentdb.com/api.php?amount=10&type=multiple';
let questions = {};
let start = document.getElementById("start-btn");
let current_question = 0;
let current_score = 0;


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

        current_score++;
        document.getElementById("current_score").innerText = String(current_score);


    } else {
        button.classList.add('clicked');
    }
    disable_buttons();
}

function get_new_question() {

    let current = document.getElementById("current_question");

    // clear old answer
    let answer_div = document.getElementById("answer_buttons");
    while (answer_div.firstChild) {
        answer_div.removeChild(answer_div.firstChild);
    }

    if (current_question === 0) {
        start.innerHTML = "Next Question";
    } else if (current_question === questions.length - 1) {
        start.innerHTML = "Restart";
        start.onclick = () => {
            location.reload()
        }
    } else {
        start.innerHTML = "Next Question";
    }
    let new_q = document.getElementsByClassName("question")[0]
    new_q.innerHTML = questions[current_question].question;
    const answers = questions[current_question].incorrect_answers;
    answers.push(questions[current_question].correct_answer);
    answers.sort();

    for (let answer of answers) {
        let answer_button = document.createElement("button");
        answer_button.classList.add("btn");
        if (questions[current_question].correct_answer === answer) {
            answer_button.classList.add("correct");
        }
        answer_button.innerHTML = answer;
        answer_button.onclick = check_answer;
        answer_div.appendChild(answer_button);
    }

    // increment current question
    current.innerText = String(current_question + 1);
    current_question++;
}

window.onload = async function () {

    questions = await get_questions();
    console.log("Done loading questions.");

    start.disabled = false;
};
