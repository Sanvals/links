// Get the DOM elements
const pageStyleContainer = document.getElementById('pageStyle');
const footerImg = document.getElementById('footerImg');
const savedMood = localStorage.getItem('currentMood') || 'mood1';

// Define style images
const images = [
    'https://cdn-icons-png.flaticon.com/64/5551/5551395.png', // Violet world
    'https://cdn-icons-png.flaticon.com/64/685/685842.png', // Halloween
    'https://cdn-icons-png.flaticon.com/64/616/616541.png', // Forest
    'https://cdn-icons-png.flaticon.com/64/2331/2331397.png', // Easter
    'https://cdn-icons-png.flaticon.com/64/7645/7645197.png', // Night
    'https://cdn-icons-png.flaticon.com/64/338/338337.png' // Simple blue
];

// Define mood styles
const moods = {
    mood1: {
        footerImg: 'https://my.logiscool.com/static/media/space-footer.1b18286a.png',
        mainColor: '#cecece', // Main text color
        buttonTextColor: '#cecece', // Main button text color
        buttonColor: 'rgb(36, 47, 112)', // Main button color
        buttonShadow: 'rgb(21, 32, 83)', // Main button shadow
        backColor: 'linear-gradient(rgb(12, 14, 39), rgba(18, 31, 66, 0.83)) 0% 0% / auto fixed, url(https://my.logiscool.com/static/media/space-bg.af3c9b72.jpg) 0% 0% / 1270px',
        textShadow: ''
    },
    mood2: {
        footerImg: 'https://my.logiscool.com/static/media/halloween_footer.09088135.webp',
        mainColor: '#cecece',
        buttonTextColor: '#cecece',
        buttonColor: 'rgb(181, 71, 5)',
        buttonShadow: 'rgb(153, 35, 35)',
        backColor: 'fixed rgb(67, 35, 95)', // Background color
        textShadow: ''
    },
    mood3: {
        footerImg: 'https://my.logiscool.com/static/media/easter-footer.e30df72f.webp',
        mainColor: 'rgb(0, 0, 0)',
        buttonTextColor: 'rgb(0, 0, 0)',
        buttonColor: 'rgba(0, 0, 0, 0.04)',
        buttonShadow: 'rgba(0, 0, 0, 0.2)',
        backColor: 'linear-gradient(rgb(107, 217, 225), rgb(233, 251, 252)) fixed',
        textShadow: ''
    },
    mood4: {
        footerImg: 'https://my.logiscool.com/static/media/xmas-footer.a846342d.webp',
        mainColor: 'rgb(207, 236, 224)',
        buttonTextColor: 'rgb(207, 236, 224)',
        buttonColor: 'rgb(0, 80, 46)',
        buttonShadow: 'rgb(17, 53, 38)',
        backColor: 'linear-gradient(rgb(29, 63, 110), rgb(31, 34, 43)) fixed',
        textShadow: 'rgba(53, 251, 169, 0.4) 0px 0px 6px'
    },
    mood5: {
        footerImg: '',
        mainColor: 'rgb(132, 233, 40)',
        buttonTextColor: 'rgb(132, 233, 40)',
        buttonColor: 'rgb(0, 0, 0, 0)',
        buttonShadow: 'rgb(17, 53, 38)',
        backColor: 'rgb(20, 24, 31)',
        textShadow: 'rgba(53, 251, 169, 0.4) 0px 0px 6px'
    },
    mood6: {
        footerImg: '',
        mainColor: '#404040',
        buttonTextColor: 'rgb(255, 255, 255)',
        buttonColor: 'rgb(36, 48, 112)',
        buttonShadow: 'rgb(6 18 81)',
        backColor: '#f5f5fb',
        textShadow: 'rgba(165, 183, 125, 0.87) 0px 0px 5px'
    }
};

// Function to create and add images to the DOM
function loadStyleImages() {
    if (!pageStyleContainer) return;
    images.forEach((src, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = src;
        imgElement.alt = "Style option " + (index + 1);
        imgElement.classList.add('styleImage');
        imgElement.dataset.mood = 'mood' + (index + 1);
        imgElement.loading = 'lazy';
        imgElement.setAttribute('aria-label', 'Style option ' + (index + 1));
        pageStyleContainer.appendChild(imgElement);
    });

    // Re-select the images after they are added to the DOM
    pageStyleContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('styleImage')) {
            changeMood(e.target.dataset.mood);
        }
    });
}

// Function to change the mood
function changeMood(mood) {
    const target = moods[mood]
    if (!target) return;
    footerImg.src = target.footerImg

    // Update CSS variables
    const set = (name, value) => document.documentElement.style.setProperty(name, value);
    set('--main-color', target.mainColor);
    set('--button-color', target.buttonColor);
    set('--background-color', target.backColor);
    set('--button-shadow', target.buttonShadow);
    set('--text-shadow', target.textShadow);
    set('--button-text-color', target.buttonTextColor);

    // Save current mood to local storage
    if(localStorage.getItem('currentMood') !== mood) localStorage.setItem('currentMood', mood);

    // Update visibility of style images
    document.querySelectorAll('.styleImage').forEach(img => {
        img.style.display = img.dataset.mood === mood ? 'none' : 'block';
    });
}

window.addEventListener('load', () => {
    loadStyleImages();
    changeMood(savedMood);
});