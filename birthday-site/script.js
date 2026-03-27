// ==========================================
// 1. CAKE PAGE — Step-by-step ritual
// ==========================================

window.turnLight = function () {
    console.log("Cake: Turn Light Clicked");

    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'flash-effect';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    // Switch body to light mode
    setTimeout(() => {
        document.body.classList.add('light-on');
    }, 400);

    showStep('step-2');
    hideStep('step-1');
};

window.playCelebrationMusic = function () {
    console.log("Cake: Play Music Clicked");
    const music = document.getElementById('bg-music');
    if (music) {
        music.play().catch(e => console.log("Music blocked or file missing:", e));
    }
    showStep('step-3');
    hideStep('step-2');
};

window.launchCelebration = function () {
    console.log("Cake: Celebration Started");
    hideStep('step-3');
    buildCakeSequence();

    setTimeout(() => {
        // Show birthday banner
        const banner = document.getElementById('birthday-banner');
        if (banner) banner.classList.add('banner-visible');

        // Confetti
        if (typeof confetti === 'function') {
            confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
            setTimeout(() => confetti({ particleCount: 100, spread: 60, origin: { y: 0.4 } }), 700);
        }

        // Balloons
        createBalloons();
    }, 1200);
};

// ==========================================
// 2. CAKE HELPERS
// ==========================================

function hideStep(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => el.classList.add('hidden'), 500);
}

function showStep(id) {
    const el = document.getElementById(id);
    if (!el) return;
    // Wait a moment before revealing next step
    setTimeout(() => {
        el.classList.remove('hidden');
        el.style.opacity = '0';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => { el.style.opacity = '1'; });
        });
    }, 600);
}

function buildCakeSequence() {
    const container = document.getElementById('cake-builder');
    if (!container) return;

    const layers = [
        { w: '220px', c: '#ffdde1' },
        { w: '180px', c: '#fbc2eb' },
        { w: '140px', c: '#fad0c4' },
        { w: '100px', c: '#ffffff' }
    ];

    container.innerHTML = '';
    layers.forEach((layer, index) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'cake-layer';
            div.style.setProperty('--width', layer.w);
            div.style.setProperty('--color', layer.c);
            container.appendChild(div);
            setTimeout(() => div.classList.add('built'), 50);
            if (index === layers.length - 1) setTimeout(addCandle, 800);
        }, index * 800);
    });
}

function addCandle() {
    const builder = document.getElementById('cake-builder');
    if (!builder) return;
    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.innerHTML = '<div class="flame"></div>';
    builder.appendChild(candle);
    setTimeout(() => {
        candle.style.opacity = '1';
        const display = document.getElementById('cake-display');
        if (display) display.style.transform = 'scale(1.1)';
    }, 100);
}

function createBalloons() {
    const colors = ['#ff4baf', '#7000ff', '#ff9d00', '#ff4b5c', '#00d2ff'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const b = document.createElement('div');
            b.className = 'balloon';
            b.style.left = (Math.random() * 90 + 5) + 'vw';
            b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(b);
            setTimeout(() => b.remove(), 7000);
        }, i * 300);
    }
}

// ==========================================
// 3. GALLERY — Auto slideshow
// ==========================================

let currentPhotoIndex = 0;
let galleryTimer = null;

// Add your image filenames here. Supports jpeg, jpg, png, webp
const photoPaths = [
    "images/pic1.jpeg",
    "images/pic2.jpeg",
    "images/pic3.jpeg",
    "images/pic4.jpeg",
    "images/pic5.jpeg",
    "images/pic6.jpeg"
];

const captions = [
    "Every moment with you is a gift... 💕",
    "You make every day brighter ☀️",
    "My favourite person in the world 🌸",
    "Forever and always ❤️",
    "You are my sunshine 💛",
    "The best chapter of my life 📖"
];

window.startAutomaticGallery = function () {
    console.log("Gallery: Starting...");

    // Hide overlay
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 600);
    }

    // Show gallery content
    const content = document.getElementById('gallery-content');
    if (content) {
        content.style.display = 'block';
    }

    // Play music
    const music = document.getElementById('gallery-music');
    if (music) {
        music.play().catch(e => console.log("Music blocked:", e));
    }

    // Build slideshow images
    const slideshow = document.getElementById('slideshow');
    if (slideshow && slideshow.children.length === 0) {
        photoPaths.forEach((path, i) => {
            const img = document.createElement('img');
            img.src = path;
            img.className = (i === 0) ? 'active' : '';
            // Fallback for missing images
            img.onerror = function () {
                this.src = 'https://picsum.photos/seed/' + (i + 1) + '/600/400';
            };
            slideshow.appendChild(img);
        });
    }

    updateCaption(0);

    // Auto-advance every 4 seconds
    if (!galleryTimer) {
        galleryTimer = setInterval(() => {
            advancePhoto(1);
        }, 4000);
    }
};

function advancePhoto(direction) {
    const imgs = document.querySelectorAll('#slideshow img');
    if (imgs.length === 0) return;

    imgs[currentPhotoIndex].classList.remove('active');
    currentPhotoIndex = (currentPhotoIndex + direction + imgs.length) % imgs.length;
    imgs[currentPhotoIndex].classList.add('active');
    updateCaption(currentPhotoIndex);
}

function updateCaption(index) {
    const caption = document.getElementById('caption');
    if (caption && captions[index]) {
        caption.style.opacity = '0';
        setTimeout(() => {
            caption.textContent = captions[index] || "Every moment with you...";
            caption.style.opacity = '1';
        }, 400);
    }
}

// Exposed for prev/next buttons
window.nextPhoto = function () { advancePhoto(1); };
window.prevPhoto = function () { advancePhoto(-1); };

// ==========================================
// 4. PARTICLE SYSTEM (Global — hearts & stars)
// ==========================================
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() { this.init(); }
        init() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 14 + 6;
            this.speed = Math.random() * 0.8 + 0.4;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.drift = (Math.random() - 0.5) * 0.6;
            this.text = Math.random() > 0.5 ? '❤️' : '✨';
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px serif`;
            ctx.fillText(this.text, this.x, this.y);
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            if (this.y < -50) this.init();
        }
    }

    for (let i = 0; i < 30; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
})();

// ==========================================
// 5. PUZZLE LOGIC
// ==========================================

window.initPuzzle = function () {
    const grid = document.getElementById('grid');
    if (!grid) return;

    // Hide win message on reset
    const win = document.getElementById('puzzle-win');
    if (win) win.style.display = 'none';

    let tiles = [1, 2, 3, 4, 5, 6, 7, 8, null];

    // Shuffle until we get a solvable puzzle (not already solved)
    do {
        tiles = shuffleArray([...tiles]);
    } while (isSolved(tiles) || !isSolvable(tiles));

    renderPuzzle(tiles);
};

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Checks if an 8-puzzle configuration is solvable
function isSolvable(tiles) {
    const flat = tiles.filter(t => t !== null);
    let inversions = 0;
    for (let i = 0; i < flat.length; i++) {
        for (let j = i + 1; j < flat.length; j++) {
            if (flat[i] > flat[j]) inversions++;
        }
    }
    return inversions % 2 === 0;
}

function isSolved(tiles) {
    const win = [1, 2, 3, 4, 5, 6, 7, 8, null];
    return tiles.every((v, i) => v === win[i]);
}

function renderPuzzle(tiles) {
    const grid = document.getElementById('grid');
    if (!grid) return;
    grid.innerHTML = '';

    tiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = 'tile' + (tile === null ? ' empty' : '');
        div.innerText = tile !== null ? tile : '';

        if (tile !== null) {
            div.addEventListener('click', () => moveTile(index, tiles));
        }
        grid.appendChild(div);
    });
}

function moveTile(index, tiles) {
    const emptyIndex = tiles.indexOf(null);

    // Valid moves: up/down (±3) and left/right (±1) — but no wrapping on rows
    const row = Math.floor(index / 3);
    const emptyRow = Math.floor(emptyIndex / 3);

    const validMove =
        (index === emptyIndex - 3) ||
        (index === emptyIndex + 3) ||
        (row === emptyRow && index === emptyIndex - 1) ||
        (row === emptyRow && index === emptyIndex + 1);

    if (validMove) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        renderPuzzle(tiles);

        if (isSolved(tiles)) {
            setTimeout(() => {
                const win = document.getElementById('puzzle-win');
                if (win) win.style.display = 'block';
            }, 300);
        }
    }
}

// ==========================================
// 6. DOMContentLoaded — safe initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize puzzle only on puzzle page
    if (document.getElementById('grid')) {
        window.initPuzzle();
    }
});