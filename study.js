// Constants
const BASE_IP = "https://sanvals.pythonanywhere.com";
const CONNECTBUTTON = document.getElementById('connect-button');
const loader = document.querySelector('#loader');
const container = document.querySelector('main');
const originalUrls = new Map();

// State Variables
let lastUrl = "";
let intervalId = null;
let connected = false;
let teacherMode = false;

// Utility Functions
const setElementOpacity = (element, opacityValue) => {
    element.style.opacity = opacityValue;
};

const displayError = (message) => {
    const errorElement = document.querySelector('#loader-text');
    const errorImage = document.querySelector('#loader-img');
    errorElement.textContent = message;
    errorElement.style.fontWeight = 'bold';
    errorElement.style.margin = '10px 0';
    errorImage.style.opacity = 0;
};

const updateLink = (link, newUrl) => {
    link.setAttribute('href', newUrl);
    link.classList.add('active-link');
    originalUrls.set(link, newUrl);
};

// Fetch Data
const fetchLinks = (url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .catch(error => {
            displayError('Network error');
            console.error('Error fetching data:', error);
        });
};

// Rendering Functions
const displayLinks = (data) => {
    container.innerHTML = ''; // Clear the existing content
    const fragment = document.createDocumentFragment();

    Object.entries(data).forEach(([tag, catData]) => {
        const details = createCategoryElement(tag, catData);
        fragment.appendChild(details);
    });

    container.appendChild(fragment);
    setElementOpacity(container, 1);
};

const createCategoryElement = (tag, catData) => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = tag;
    details.appendChild(summary);

    const section = document.createElement('section');
    section.setAttribute('aria-label', `${tag} links`);

    catData.forEach(linkData => {
        const linkElement = createLinkElement(linkData);
        section.appendChild(linkElement);
    });

    details.appendChild(section);
    return details;
};

const createLinkElement = ({ url, name, icon }) => {
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.target = "_blank";
    linkElement.classList.add('link-item');
    linkElement.setAttribute('aria-label', name);

    const imgElement = document.createElement('img');
    imgElement.src = icon;
    imgElement.loading = "lazy";
    imgElement.alt = `${name} icon`;
    imgElement.classList.add('link-icon');

    linkElement.appendChild(imgElement);
    linkElement.appendChild(document.createTextNode(name));

    return linkElement;
};

// Teacher Mode Functions
const toggleTeacherMode = () => {
    teacherMode ? revertLinks() : setTeacherPage();
    teacherMode = !teacherMode;
};

const setTeacherPage = () => {
    const links = document.querySelectorAll('a:not(#short-links a)');
    links.forEach(link => {
        const originalUrl = link.getAttribute('href');
        if (originalUrl && !originalUrl.startsWith(BASE_IP)) {
            const trimmedUrl = originalUrl.replace(/^https?:\/\//, '');
            updateLink(link, `${BASE_IP}/set_url/${encodeURIComponent(trimmedUrl)}`);
        }
    });
};

const revertLinks = () => {
    const links = document.querySelectorAll('a:not(#short-links a)');
    links.forEach(link => {
        if (originalUrls.has(link)) {
            const originalUrl = originalUrls.get(link);
            updateLink(link, originalUrl);
            originalUrls.delete(link);
        }
        link.classList.remove('active-link');
    });
};

// Server Connection Functions
const connectToServer = () => {
    connected = !connected;
    CONNECTBUTTON.classList.toggle('connected', connected);
    connected && startCheckingForUrls(BASE_IP);
};

const startCheckingForUrls = (serverIP) => {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
        fetch(`${serverIP}/get_url`)
            .then(response => response.json())
            .then(data => {
                if (data.url && data.url !== lastUrl) {
                    lastUrl = data.url;
                    window.open(lastUrl, '_blank');
                }
            })
            .catch(error => console.error('Error fetching URL:', error));
    }, 5000);
};

// Initial Data Fetching
document.addEventListener('DOMContentLoaded', () => {
    setElementOpacity(container, 0);
    const cachedData = localStorage.getItem('cachedLinks');
    if (cachedData) {
        setTimeout(() => displayLinks(JSON.parse(cachedData)), 500);
    } else {
        setElementOpacity(loader, 1);
    }

    fetchLinks('https://notionserver.vercel.app')
        .then(data => {
            if (!data || !Object.keys(data).length) {
                displayError('Links are empty');
                return;
            }

            const cachedDataStr = localStorage.getItem('cachedLinks');
            if (JSON.stringify(data) !== cachedDataStr) {
                localStorage.setItem('cachedLinks', JSON.stringify(data));
                setTimeout(() => displayLinks(data), 500);
            }
            setElementOpacity(loader, 0);
        });
});

// Event Listeners
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'l') toggleTeacherMode();
    if (key === 'd' && teacherMode) window.open(`${BASE_IP}/empty`, '_blank');
});