// Get the page styles container
const pageStyleContainer = document.getElementById('pageStyle');
const footerImg = document.getElementById('footerImg');
let currentMood = 1;

// Define mood styles
const moods = {
    mood1: {
        footerImg: 'https://my.logiscool.com/static/media/space-footer.1b18286a.png',
        buttonColor: 'rgb(36, 47, 112)',
        buttonShadow: 'rgb(21, 32, 83)',
        backColor: 'linear-gradient(rgb(12, 14, 39), rgba(18, 31, 66, 0.83)) 0% 0% / auto fixed, url(https://my.logiscool.com/static/media/space-bg.af3c9b72.jpg) 0% 0% / 1270px'
    },
    mood2: {
        footerImg: 'https://my.logiscool.com/static/media/halloween_footer.09088135.webp',
        buttonColor: 'rgb(255, 123, 10)',
        buttonShadow: 'rgb(132, 69, 69)',
        backColor: 'fixed rgb(67, 35, 95)'
    }
};

// Function to change the mood
function changeMood(mood) {
    const target = moods[mood]

    footerImg.src = target.footerImg;
    document.documentElement.style.setProperty('--button-color', target.buttonColor);
    document.documentElement.style.setProperty('--background-color', target.backColor);
    document.documentElement.style.setProperty('--button-shadow', target.buttonShadow);
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