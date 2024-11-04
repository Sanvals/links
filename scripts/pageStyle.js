// Get the page styles container
const pageStyleContainer = document.getElementById('pageStyle');
const footerImg = document.getElementById('footerImg');
let currentMood = 1;

// Define mood styles
const moods = {
    mood1: {
        footerImg: 'https://my.logiscool.com/static/media/space-footer.1b18286a.png',
        mainColor: '#cecece',
        buttonColor: 'rgb(36, 47, 112)',
        buttonShadow: 'rgb(21, 32, 83)',
        backColor: 'linear-gradient(rgb(12, 14, 39), rgba(18, 31, 66, 0.83)) 0% 0% / auto fixed, url(https://my.logiscool.com/static/media/space-bg.af3c9b72.jpg) 0% 0% / 1270px',
        textShadow: ''
    },
    mood2: {
        footerImg: 'https://my.logiscool.com/static/media/halloween_footer.09088135.webp',
        mainColor: '#cecece',
        buttonColor: 'rgb(181, 71, 5)',
        buttonShadow: 'rgb(153, 35, 35)',
        backColor: 'fixed rgb(67, 35, 95)',
        textShadow: ''
    },
    mood3: {
        footerImg: 'https://my.logiscool.com/static/media/easter-footer.e30df72f.webp',
        mainColor: 'rgb(0, 0, 0)',
        buttonColor: 'rgba(0, 0, 0, 0.04)',
        buttonShadow: 'rgba(0, 0, 0, 0.2)',
        backColor: 'linear-gradient(rgb(107, 217, 225), rgb(233, 251, 252)) fixed',
        textShadow: ''
    },
    mood4: {
        footerImg: 'https://my.logiscool.com/static/media/xmas-footer.a846342d.webp',
        mainColor: 'rgb(207, 236, 224)',
        buttonColor: 'rgb(0, 80, 46)',
        buttonShadow: 'rgb(17, 53, 38)',
        backColor: 'linear-gradient(rgb(29, 63, 110), rgb(31, 34, 43)) fixed',
        textShadow: 'rgba(53, 251, 169, 0.4) 0px 0px 6px'
    },
    mood5: {
        footerImg: '',
        mainColor: 'rgb(132, 233, 40)',
        buttonColor: 'rgb(0, 0, 0, 0)',
        buttonShadow: 'rgb(17, 53, 38)',
        backColor: 'rgb(20, 24, 31)',
        textShadow: 'rgba(53, 251, 169, 0.4) 0px 0px 6px'
    }
};

// Function to change the mood
function changeMood(mood) {
    const target = moods[mood]

    footerImg.src = target.footerImg;
    document.documentElement.style.setProperty('--main-color', target.mainColor);
    document.documentElement.style.setProperty('--button-color', target.buttonColor);
    document.documentElement.style.setProperty('--background-color', target.backColor);
    document.documentElement.style.setProperty('--button-shadow', target.buttonShadow);
    document.documentElement.style.setProperty('--text-shadow', target.textShadow);
}

// Add event listeners to the mood images
const styleImages = document.querySelectorAll('.styleImage');

styleImages.forEach((img, index) => {            
    if (currentMood === index + 1) {
        img.style.display = 'none';
    } else {
        img.style.display = 'block';
    }
})

styleImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentMood = index + 1
        changeMood(`mood${index + 1}`);
        styleImages.forEach((img, index) => {            
            if (currentMood === index + 1) {
                img.style.display = 'none';
            } else {
                img.style.display = 'block';
            }
        })
    });
});