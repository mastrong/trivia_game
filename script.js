const trivia_url = 'https://opentdb.com/api.php?amount=10&type=multiple&difficulty=easy';
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
        if (button.classList.contains('correct')) {
            button.style.border = "5px solid green";

        } else {
            button.style.border = "5px solid red";
        }
    }
}

function check_answer(event) {

    let button = event.target;
    let current_marker = document.getElementById(String(current_question));

    if (button.classList.contains('correct')) {
        current_score++;
        current_marker.src = "green.svg";
        current_marker.alt = "green";
    } else {
        current_marker.src = "red.svg";
        current_marker.alt = "red";
    }

    button.classList.add('clicked');
    // disable all buttons
    disable_buttons();

    if (current_question === questions.length) {
        let q_div = document.getElementsByClassName("question")[0]
        q_div.innerHTML = "Final score: " + current_score + "/" + questions.length;
        q_div.classList.add("final");
        document.getElementById("answer_buttons").style.display = "none";
        start.style.display = "block";
        start.innerHTML = "Restart";
        start.onclick = () => {
            location.reload()
        }

    } else {
        setTimeout(get_new_question, 1500);
    }
}

function get_new_question() {

    // clear old answer
    let answer_div = document.getElementById("answer_buttons");
    while (answer_div.firstChild) {
        answer_div.removeChild(answer_div.firstChild);
    }

    start.style.display = "none";

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
    current_question++;

    let current_marker = document.getElementById(String(current_question));
    current_marker.src = "white.svg";
    current_marker.alt = "white";
}

window.onload = async function () {

    questions = await get_questions();
    console.log("Done loading questions.");

    start.disabled = false;
};
