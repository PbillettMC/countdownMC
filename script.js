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
const lettersContainer = document.getElementById('letters');

const vowelWeights = [
    { letter: 'A', weight: 8 },
    { letter: 'E', weight: 12 },
    { letter: 'I', weight: 7 },
    { letter: 'O', weight: 7 },
    { letter: 'U', weight: 3 }
];

const consonantWeights = [
    { letter: 'B', weight: 2 },
    { letter: 'C', weight: 3 },
    { letter: 'D', weight: 6 },
    { letter: 'F', weight: 2 },
    { letter: 'G', weight: 3 },
    { letter: 'H', weight: 3 },
    { letter: 'J', weight: 1 },
    { letter: 'K', weight: 3 },
    { letter: 'L', weight: 7 },
    { letter: 'M', weight: 4 },
    { letter: 'N', weight: 8 },
    { letter: 'P', weight: 2 },
    { letter: 'Q', weight: 1 },
    { letter: 'R', weight: 9 },
    { letter: 'S', weight: 9 },
    { letter: 'T', weight: 10 },
    { letter: 'V', weight: 2 },
    { letter: 'W', weight: 2 },
    { letter: 'X', weight: 1 },
    { letter: 'Y', weight: 4 },
    { letter: 'Z', weight: 1 }
];

resetB.addEventListener('click', resetLetters);
startB.addEventListener('click', startTimer);
pauseB.addEventListener('click', pauseTimer);
resumeB.addEventListener('click', resumeTimer);
generateC.addEventListener('click', () => generateLetters(false));
generateV.addEventListener('click', () => generateLetters(true));

function getRandomLetter(weightedArray) {
    let totalWeight = weightedArray.reduce((sum, item) => sum + item.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (let item of weightedArray) {
        if (randomNum < item.weight) return item.letter;
        randomNum -= item.weight;
    }
}

// Generate a unique letter (reduce duplicates)
function generateUniqueLetter(isVowel) {
    let letter, attempts = 0;
    const weightedArray = isVowel ? vowelWeights : consonantWeights;
    
    do {
        letter = getRandomLetter(weightedArray);
        attempts++;
    } while (letters.includes(letter) && attempts < 5);
    
    return letter;
}

function generateLetters(isVowel) {
    if (letters.length >= 9) return; // Prevent exceeding letter limit
    
    const letter = generateUniqueLetter(isVowel);
    letters.push(letter);
    
    lettersContainer.innerHTML += `<span class="${isVowel ? 'vowelMove' : 'consonantMove'}">${letter}</span>`;

    if (letters.length >= 9) {
        generateV.disabled = true;
        generateC.disabled = true;
        resetB.hidden = false;
        startB.hidden = false;
    }
}

function resetLetters() {
    letters.length = 0;
    generateV.disabled = false;
    generateC.disabled = false;
    lettersContainer.innerHTML = "";
    
    clearInterval(timer);
    timeLeft = 300;
    updateTimerDisplay();
    
    resetB.hidden = true;
    startB.hidden = false;
    pauseB.hidden = true;
    resumeB.hidden = true;
}

function startTimer() {
    if (timer) clearInterval(timer);
    isPaused = false;
    timer = setInterval(countdown, 1000);
    
    startB.hidden = true;
    resetB.hidden = true;
    pauseB.hidden = false;
    resumeB.hidden = true;
}

function pauseTimer() {
    clearInterval(timer);
    isPaused = true;
    
    pauseB.hidden = true;
    resumeB.hidden = false;
    resetB.hidden = false;
}

function resumeTimer() {
    if (isPaused) {
        timer = setInterval(countdown, 1000);
        isPaused = false;
    }
    
    resumeB.hidden = true;
    pauseB.hidden = false;
    resetB.hidden = true;
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
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
