// Constants
const BASE_IP = "https://sanvals.pythonanywhere.com";
const CONNECTBUTTON = document.getElementById('connect-button');
const FETCHDATA = "https://notionserver.vercel.app"
const loader = document.querySelector('#loader');
const container = document.querySelector('main');
const originalUrls = new Map();
const errorElement = document.querySelector('#loader-text');
const errorImage = document.querySelector('#loader-img');

// State variables
let lastUrl = "";
let intervalId = null
let connected = false
let teacherMode = false;

// Utility functions
function changeOpacity(element, opacity) {
    element.style.opacity = opacity;
}

function displayError(message) {
    errorElement.textContent = message;
    errorImage.style.opacity = 0;
}

const updateLink = (link, newUrl) => {
    link.setAttribute('href', newUrl);
    link.classList.add('active-link');
    originalUrls.set(link, newUrl);
};

function displayLinks(data) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment(); // Create a document fragment for better performance

    // Iterate over each category in the data
    Object.entries(data).forEach(([tag, catData]) => {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = tag;
        
        details.appendChild(summary);

        const section = document.createElement('section');
        section.setAttribute('aria-label', `${tag} links`); // Accessibility improvement

        // Loop through each link object in the category
        catData.forEach(linkData => {
            const linkElement = document.createElement('a');
            linkElement.href = linkData.url;
            linkElement.target = "_blank";
            linkElement.classList.add('link-item'); // Add class for easier styling
            linkElement.setAttribute('aria-label', linkData.name); // Accessibility improvement

            // Icon image
            const imgElement = document.createElement('img');
            imgElement.src = linkData.icon;
            imgElement.loading = "lazy";
            imgElement.alt = `${linkData.name} icon`;
            imgElement.classList.add('link-icon'); // Add class for easier styling

            // Assemble link element
            linkElement.appendChild(imgElement);
            linkElement.appendChild(document.createTextNode(linkData.name));
            section.appendChild(linkElement);
        });

        details.appendChild(section);
        fragment.appendChild(details);
    });

    container.appendChild(fragment); // Append all elements at once for efficiency
   
}


// Function to change all links to the "teacher page" URLs
function toggleLinks(isTeacherMode) {
    const links = document.querySelectorAll('a:not(#short-links a)');
    links.forEach(link => {
      const originalUrl = link.getAttribute('href');
      if (originalUrl) {
        const trimmedUrl = originalUrl.replace(/^https?:\/\//, '');
  
        if (isTeacherMode) {
          // Store the original URL
          originalUrls.set(link, originalUrl);
  
          // Prepend the BASE_IP only if it's not already using the BASE_IP
          if (!trimmedUrl.startsWith('sanvals.pythonanywhere.com')) {
            link.setAttribute('href', BASE_IP + '/set_url/' + encodeURIComponent(trimmedUrl));
          }
          link.classList.add('active-link');
        } else {
          // Restore the original URL
          if (originalUrls.has(link)) {
            link.setAttribute('href', originalUrls.get(link));
            originalUrls.delete(link);
          }
          link.classList.remove('active-link');
        }
      }
    });
    teacherMode = !teacherMode;
}

// Event listener for key presses
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    if (key === 'l') toggleLinks(!teacherMode);
    if (key === 'd' && teacherMode) window.open(`${BASE_IP}/empty`, '_blank');
});

// Fetch links from JSON file
document.addEventListener('DOMContentLoaded', () => {
    changeOpacity(container, 0)

    const cachedData = localStorage.getItem('cachedLinks');
    if (cachedData) {
        setTimeout(() => {
            displayLinks(JSON.parse(cachedData))
            changeOpacity(container, 100)
        }, 500)
    } else {
        changeOpacity(loader, 100)
    }

    // Fetch the data from notionserver
    fetch(FETCHDATA)
        .then(response => {
            if (!response.ok) {
                displayError('Network error');
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
        // Process and display the data
            if (!Object.keys(data).length) {
                displayError('Links are empty');
                return;
            }

            loader.style.opacity = 0;
            // Compare cached data and server data
            if (JSON.stringify(data) !== cachedData) {
                localStorage.setItem('cachedLinks', JSON.stringify(data));
                setTimeout(() => {
                    displayLinks(data)
                    changeOpacity(container, 100)
                }, 500)
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error)
            displayError('No links found');
        });
});
