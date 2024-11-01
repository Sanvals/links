// Define the base URL for the teacher's page
const CONNECTBUTTON = document.getElementById('connect-button');
const loader = document.querySelector('#loader');
const container = document.querySelector('main');

// Define the conditions to store the URL
const BASE_IP = "https://sanvals.pythonanywhere.com";
let lastUrl = "";
let intervalId = null
let connected = false
let teacherMode = false;
const originalUrls = new Map();

// Function to change all links to the "teacher page" URLs
function setTeacherPage() {
    // Get all anchor (<a>) tags except those inside #short-links
    const links = document.querySelectorAll('a:not(#short-links a)');
    links.forEach(link => {
        const originalUrl = link.getAttribute('href');
        // Check if the original URL is valid before updating
        if (originalUrl) {
            // Trim 'http://' or 'https://' from the original URL
            const trimmedUrl = originalUrl.replace(/^https?:\/\//, '');
            
            // Store the original URL before modifying it
            originalUrls.set(link, originalUrl);

            // Prepend the BASE_IP only if it's not already using the BASE_IP
            if (!trimmedUrl.startsWith('sanvals.pythonanywhere.com')) {
                link.setAttribute('href', BASE_IP + '/set_url/' + encodeURIComponent(trimmedUrl));
            }
            // Change the link's background color to green
            link.classList.add('active-link');
        }
    });
}

// Function to revert links to normal mode
function revertLinks() {
    const links = document.querySelectorAll('a:not(#short-links a)');  // Get all anchor (<a>) tags except those inside #short-links
    links.forEach(link => {
        // Check if this link has a stored original URL
        if (originalUrls.has(link)) {
            const originalUrl = originalUrls.get(link);
            link.setAttribute('href', originalUrl); // Restore the original URL
            originalUrls.delete(link); // Remove from map since it's reverted
        }
        link.classList.remove('active-link'); // Remove the active link class
    });
    
}

// Event listener for key presses)
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    if (key === 'l') toggleTeacherMode()
    if (key === 'd' && teacherMode) window.open(`${BASE_IP}/empty`, '_blank');
});

function toggleTeacherMode() {
    teacherMode ? revertLinks() : setTeacherPage();
    teacherMode = !teacherMode;
}

// Manage the connect button behaviour
function connectToServer() {
    // Modify the button's background
    if (connected) {
        // Remove 'connected' class from button
        CONNECTBUTTON.classList.remove('connected');
        connected = false;
    } else {
        // Add 'connected' class to button
        CONNECTBUTTON.classList.add('connected');
        connected = true
        // Directly start checking for URLs with the base IP
        startCheckingForUrls(BASE_IP);
    }
}

// Create the checking for url function
function startCheckingForUrls(serverIP) {
    if (intervalId) clearInterval(intervalId); // Clear any existing interval
    // Set an interval to fetch the URL from the server
    intervalId = setInterval(() => {
        fetch(`${serverIP}/get_url`)  // Use the constructed base IP
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.url && data.url !== lastUrl) {
                    lastUrl = data.url;
                    window.open(lastUrl, '_blank');  // Open the new URL in a new tab
                }
            })
            .catch(error => console.error('Error fetching URL:', error));
    }, 5000);
}

// Fetch links from JSON file
document.addEventListener('DOMContentLoaded', () => {
    // Catch the two relevant elements on the page
    container.style.opacity = 0;

    function displayError(message) {
        const errorElement = document.querySelector('#loader-text');
        const errorImage = document.querySelector('#loader-img');
        errorElement.textContent = message;
        errorElement.style.fontWeight = 'bold'; // Optional: make it stand out
        errorElement.style.margin = '10px 0'; // Optional: add some margin
        errorImage.style.opacity = 0;
    }

    // Fetch the data from notionserver
    fetch('https://notionserver.vercel.app')
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
            setTimeout(() => {
                displayLinks(data)
                container.style.opacity = 100;
            }, 500)
        })
        .catch(error => {
            console.error('Error fetching data:', error)
            displayError('No links found');
        });
    
        function displayLinks(data) {
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
});
