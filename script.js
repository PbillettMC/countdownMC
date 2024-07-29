let timer;
let timeLeft = 300; // 5 minutes in seconds
let isPaused = false;

const letters = [];
const generateV = document.getElementById('generateV');
const generateC = document.getElementById('generateC');
const resetB = document.getElementById('resetB');
const startB = document.getElementById('timerB');
const pauseB = document.getElementById('pauseB');
const resumeB = document.getElementById('resumeB');
const timerElement = document.getElementById('timer');
const vowels = ['A', 'E', 'I', 'O', 'U'];
const consonants = [
    { letter: 'B', weight: 3 },
    { letter: 'C', weight: 5 },
    { letter: 'D', weight: 6 },
    { letter: 'F', weight: 3 },
    { letter: 'G', weight: 6 },
    { letter: 'H', weight: 5 },
    { letter: 'J', weight: 3 },
    { letter: 'K', weight: 5 },
    { letter: 'L', weight: 7},
    { letter: 'M', weight: 6 },
    { letter: 'N', weight: 6 },
    { letter: 'P', weight: 3 },
    { letter: 'Q', weight: 1 },
    { letter: 'R', weight: 6 },
    { letter: 'S', weight: 6 },
    { letter: 'T', weight: 9 },
    { letter: 'V', weight: 3 },
    { letter: 'W', weight: 2 },
    { letter: 'X', weight: 1 },
    { letter: 'Y', weight: 4 },
    { letter: 'Z', weight: 1 }
];

resetB.addEventListener('click', resetLetters);
startB.addEventListener('click', startTimer);
pauseB.addEventListener('click', pauseTimer);
resumeB.addEventListener('click', resumeTimer);
generateC.addEventListener('click', generateLetters);
generateC.myParam = 'Con';
generateV.addEventListener('click', generateLetters);
generateV.myParam = 'Vow';

function generateLetters(evt) {
    

    if (evt.currentTarget.myParam == 'Vow') {
        const randomIndex = Math.floor(Math.random() * vowels.length);
        letters.push(vowels[randomIndex]);
    } else {
        letters.push(getRandomConsonant());
    }
    
    document.getElementById('letters').innerText = letters.join('');
    $(".letters").lettering();
    $('div span').each(function() {
      var $span = $(this);
    });
    
  if (letters.length > 8) {
    generateV.disabled = true;
    generateC.disabled = true;
    resetB.hidden = false;
    timerB.hidden = false;
  }
}

function getRandomConsonant() {
    const totalWeight = consonants.reduce((acc, consonant) => acc + consonant.weight, 0);
    let random = Math.random() * totalWeight;

    for (let consonant of consonants) {
        if (random < consonant.weight) {
            return consonant.letter;
        }
        random -= consonant.weight;
    }
}

function resetLetters(){
    letters.length = 0;
    resetB.hidden = true;
    timerB.hidden = true;
    resumeB.hidden = true;
    generateV.disabled = false;
    generateC.disabled = false;
    document.getElementById('letters').innerText = "";
    clearInterval(timer);
    timeLeft = 301;
    countdown();
}

function startTimer() {
    startB.hidden = true;
    resetB.hidden = true;
    pauseB.hidden = false;
    resumeB.hidden = true;
    timer = setInterval(countdown, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isPaused = true;
    resetB.hidden = false;
    pauseB.hidden = true;
    resumeB.hidden = false;
}

function resumeTimer() {
    timer = setInterval(countdown, 1000);
    isPaused = false;
    resetB.hidden = true;
    pauseB.hidden = false;
    resumeB.hidden = true;
}

function countdown() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        timerElement.textContent = '00:00';
        startB.hidden = true;
        pauseB.hidden = true;
        alert('Time is up!');
    } else {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${pad(minutes)}:${pad(seconds)}`;
    }
}

function pad(value) {
    return value < 10 ? '0' + value : value;
}
