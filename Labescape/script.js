/**
 * Lab Escape - Game Logic
 */

// Level Data Definitions
const levels = {
    1: {
        id: 1,
        matchSize: 2,
        gridClass: 'grid-4x4',
        items: [
            { id: 1, texts: ["NaCl", "Yemek tuzu"] },
            { id: 2, texts: ["CaCO3", "Kireç taşı"] },
            { id: 3, texts: ["NaHCO3", "Yemek sodası"] },
            { id: 4, texts: ["Ca(OH)2", "Sönmüş kireç"] },
            { id: 5, texts: ["HNO3", "Kezzap"] },
            { id: 6, texts: ["KOH", "Potas kostik"] },
            { id: 7, texts: ["CaO", "Sönmemiş kireç"] },
            { id: 8, texts: ["NH3", "Amonyak"] }
        ],
        storyWin: "Sector 1 doors open... The lab gets darker."
    },
    2: {
        id: 2,
        matchSize: 3,
        gridClass: 'grid-4x3',
        items: [
            { id: 1, texts: ["HCl", "Tuz ruhu", "Temizlik dolabında"] },
            { id: 2, texts: ["H2SO4", "Zaç yağı", "Akü sıvısı"] },
            { id: 3, texts: ["NaOH", "Sud kostik", "Sabun yapımında"] },
            { id: 4, texts: ["CH3COOH", "Sirke asidi", "Salata sosu"] }
        ],
        storyWin: "Main terminal accessed. You are free."
    }
};

// Simple Web Audio API Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const soundSystem = {
    play: function(type) {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        }
    }
};

// Game Controller
const game = {
    levelData: null,
    cards: [],
    flippedCards: [],
    matchedSets: 0,
    score: 0,
    timeElapsed: 0,
    timerInterval: null,
    isProcessing: false, // Prevents clicking during animations

    init() {
        const highScore = localStorage.getItem('labEscapeHighScore') || 0;
        document.getElementById('high-score-display').textContent = highScore;
    },

    startLevel(levelIndex) {
        soundSystem.play('click');
        this.levelData = levels[levelIndex];
        this.resetGameData();
        this.buildGrid();
        this.switchScreen('game-screen');
        this.startTimer();
        this.updateStory(`Level ${levelIndex} initiated. Match ${this.levelData.matchSize} parameters to unlock.`);
        document.getElementById('level-display').textContent = levelIndex;
    },

    resetGameData() {
        this.flippedCards = [];
        this.matchedSets = 0;
        this.score = 0;
        this.timeElapsed = 0;
        this.isProcessing = false;
        this.updateScoreDisplay();
        this.updateTimeDisplay();
        clearInterval(this.timerInterval);
    },

    buildGrid() {
        const container = document.getElementById('grid-container');
        container.innerHTML = '';
        container.className = `grid-container ${this.levelData.gridClass}`;
        
        let cardData = [];
        // Flatten the items into individual cards
        this.levelData.items.forEach(item => {
            item.texts.forEach(text => {
                cardData.push({ setId: item.id, text: text });
            });
        });

        // Fisher-Yates Shuffle
        for (let i = cardData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardData[i], cardData[j]] = [cardData[j], cardData[i]];
        }

        // Generate DOM Elements
        cardData.forEach((data, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.setId = data.setId;
            cardElement.dataset.index = index;
            
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${data.text}</div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => this.flipCard(cardElement));
            container.appendChild(cardElement);
        });
    },

    flipCard(cardElement) {
        if (this.isProcessing) return;
        if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;

        soundSystem.play('click');
        cardElement.classList.add('flipped');
        this.flippedCards.push(cardElement);

        if (this.flippedCards.length === this.levelData.matchSize) {
            this.checkMatch();
        }
    },

    checkMatch() {
        this.isProcessing = true;
        
        // Check if all flipped cards share the same setId
        const firstId = this.flippedCards[0].dataset.setId;
        const isMatch = this.flippedCards.every(card => card.dataset.setId === firstId);

        if (isMatch) {
            soundSystem.play('success');
            this.flippedCards.forEach(card => card.classList.add('matched'));
            this.matchedSets++;
            this.score += Math.max(100 - this.timeElapsed, 10); // Faster match = higher score
            this.updateScoreDisplay();
            this.updateStory("Access granted for chemical signature.");
            this.flippedCards = [];
            this.isProcessing = false;
            this.checkWinCondition();
        } else {
            soundSystem.play('error');
            this.updateStory("Warning: Chemical mismatch detected.");
            this.flippedCards.forEach(card => card.classList.add('error'));
            
            // Penalty for wrong guess
            this.score = Math.max(0, this.score - 5);
            this.updateScoreDisplay();

            setTimeout(() => {
                this.flippedCards.forEach(card => {
                    card.classList.remove('flipped', 'error');
                });
                this.flippedCards = [];
                this.isProcessing = false;
            }, 1000);
        }
    },

    checkWinCondition() {
        if (this.matchedSets === this.levelData.items.length) {
            clearInterval(this.timerInterval);
            setTimeout(() => {
                document.getElementById('result-message').textContent = this.levelData.storyWin;
                document.getElementById('final-score').textContent = this.score;
                this.checkHighScore();
                this.switchScreen('result-screen');
                soundSystem.play('success'); // Play victory chime
            }, 500);
        }
    },

    checkHighScore() {
        let currentHigh = parseInt(localStorage.getItem('labEscapeHighScore')) || 0;
        if (this.score > currentHigh) {
            localStorage.setItem('labEscapeHighScore', this.score);
            document.getElementById('high-score-display').textContent = this.score;
            document.getElementById('result-message').innerText += "\nNew High Score recorded!";
        }
    },

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            this.updateTimeDisplay();
        }, 1000);
    },

    updateTimeDisplay() {
        const minutes = Math.floor(this.timeElapsed / 60).toString().padStart(2, '0');
        const seconds = (this.timeElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-display').textContent = `${minutes}:${seconds}`;
    },

    updateScoreDisplay() {
        document.getElementById('score-display').textContent = this.score;
    },

    updateStory(text) {
        document.getElementById('story-text').textContent = text;
    },

    quitToMenu() {
        soundSystem.play('click');
        clearInterval(this.timerInterval);
        this.switchScreen('menu-screen');
    },

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
};

// Boot Sequence
window.onload = () => game.init();
