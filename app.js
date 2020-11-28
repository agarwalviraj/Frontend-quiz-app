const quesNum = document.getElementById("question-number");
const amt = 25;
const url = `https://opentdb.com/api.php?amount=${amt}&category=18`;

for (let i = 1; i <= amt; i++) {
  let number = document.createElement("span");
  number.classList.add("ques-style");
  number.innerHTML = i;
  quesNum.appendChild(number);
}

const timer = document.querySelector(".time");
const questionNumber = document.querySelectorAll(".ques-style");
const questionHeading = document.querySelector(".question-heading");
const questionPara = document.querySelector(".question-para");
const options = document.querySelectorAll(".options li");
const optionText = document.querySelectorAll(".option");
const next = document.querySelector(".next");
const submit = document.querySelector(".remark");
const root = document.documentElement;
let allQues,
  answers = [];
let map = [];
let selectedAnswers = [];

let m = 10;
let s = 30;
setInterval(() => {
  if (s >= 10) {
    timer.innerHTML = m + ":" + s;
  } else {
    timer.innerHTML = m + ":0" + s;
  }
  s--;
  if (s == 0) {
    s = 59;
    m--;
  }
  if (m < 0) {
    endQuiz();
  }
}, 1000);

questionNumber[0].classList.add("selected-number");

questionNumber.forEach((question) => {
  question.addEventListener("click", (event) => {
    selectQuestion(question);
  });
});

options.forEach((option) => {
  option.addEventListener("click", (event) => {
    selectOption(option);
  });
});

next.addEventListener("click", (event) => {
  selectQuestion(
    questionNumber[parseInt(questionHeading.innerText.substring(8))]
  );
});

submit.addEventListener("click", (event) => {
  endQuiz();
});

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    populate(data.results);
  });

function populate(text) {
  allQues = text;
  for (let i = 0; i < amt; i++) {
    answers[i] = allQues[i].incorrect_answers;
    answers[i].push(allQues[i].correct_answer);
    if (answers[i][0] == "True" || answers[i][0] == "False") {
      answers[i][3] = answers[i][0];
      answers[i][2] = answers[i][1];
    }
  }
  // answers.forEach((answer) => {
  //   if (answer[0] == "False" || answer[0] == "True") {
  //     //console.log(answer[0]);
  //     answer[3] = answer[1];
  //     answer[2] = answer[0];
  //   }
  // });
  // console.log(answers);
}

function selectQuestion(question) {
  question.classList.add("selected-number");
  setQuestion(question.innerHTML - 1);
  questionHeading.innerHTML = "Question " + question.innerHTML;
  questionNumber.forEach((rem) => {
    if (rem != question) {
      rem.classList.remove("selected-number");
    }
  });
  options.forEach((option) => {
    option.classList.remove("selected-option");
  });

  if (
    selectedAnswers[parseInt(questionHeading.innerText.substring(8))] != null
  ) {
    selectOption(
      selectedAnswers[parseInt(questionHeading.innerText.substring(8))]
    );
  }
  //console.log(selectedAnswers);
  //setProgressBar();
}

function selectOption(option) {
  option.classList.add("selected-option");
  options.forEach((rem) => {
    if (rem != option) {
      rem.classList.remove("selected-option");
    }
  });
  setOption(option);
  setProgressBar();
}

function setQuestion(num) {
  questionPara.innerHTML = allQues[num].question;
  //for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 4; j++) {
    optionText[map[num][0][j]].innerHTML = answers[num][map[num][1][j]];
  }
  //}
}

function setOption(selectedOption1) {
  selectedAnswers[
    parseInt(questionHeading.innerText.substring(8))
  ] = selectedOption1;
  if (selectedAnswers[questionHeading.innerText.substring(8)] != "undefined") {
    //options[selectedOption1.charCodeAt(0) - 65]
  }
}

function createMap() {
  for (let i = 0; i < amt; i++) {
    let first = [];
    let second = [];
    for (let j = 0; j < 4; j++) {
      let value = parseInt(Math.random() * 4);
      while (!isUnique(first, value)) value = parseInt(Math.random() * 4);
      first[j] = value;
    }
    for (let j = 0; j < 4; j++) {
      let value = parseInt(Math.random() * 4);
      while (!isUnique(second, value)) value = parseInt(Math.random() * 4);
      second[j] = value;
    }
    map[i] = [first, second];
  }
  //console.log(map);
}

function isUnique(first, value) {
  for (i = 0; i < 4; i++) {
    if (value == first[i]) return false;
  }
  return true;
}

function setProgressBar() {
  let c = 0;
  for (let i = 0; i < selectedAnswers.length; i++) {
    if (selectedAnswers[i] != null) {
      c++;
    }
  }
  document.querySelector(".count").innerText = c + "/" + amt + "Questions";
  let percent = parseInt((c / amt) * 100);

  root.style.setProperty("--completed", percent + "%");
}

function findPos(index, n) {
  for (let i = 0; i < 4; i++) {
    if (map[index][0][i] == n) return i;
  }
}

function endQuiz() {
  let c = 0;
  for (let i = 0; i < amt; i++) {
    if (selectedAnswers[i + 1] != null) {
      let pos = findPos(i, selectedAnswers[i + 1].innerText.charCodeAt(0) - 65);
      if (answers[i][map[i][1][pos]] == answers[i][3]) {
        console.log(answers[i][map[i][1][pos]]);
        c++;
      }
    }
  }
  // console.log(c);
  window.location.href = "score.html?score=" + c;
}

createMap();
setTimeout(() => {
  setQuestion(0);
}, 1500);

//this is a test
