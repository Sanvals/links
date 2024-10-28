// Define the conditions to store the URL
let lastUrl = "";
let intervalId = null
let connected = false

// Define the base URL for the teacher's page
const baseUrl = "https://sanvals.pythonanywhere.com/set_url/";
const baseIP = "https://sanvals.pythonanywhere.com";
const connectButton = document.getElementById('connect-button');

// Flag to check if teacher mode is active
let teacherMode = false;

// Store original URLs to revert later
const originalUrls = new Map();

// Function to change all links to the "teacher page" URLs
function setTeacherPage() {
    const links = document.querySelectorAll('a:not(#short-links a)');  // Get all anchor (<a>) tags except those inside #short-links
    links.forEach(link => {
        const originalUrl = link.getAttribute('href');
        // Check if the original URL is valid before updating
        if (originalUrl) {
            // Trim 'http://' or 'https://' from the original URL
            const trimmedUrl = originalUrl.replace(/^https?:\/\//, '');
            
            // Store the original URL before modifying it
            originalUrls.set(link, originalUrl);

            // Prepend the baseUrl only if it's not already using the baseUrl
            if (!trimmedUrl.startsWith('sanvals.pythonanywhere.com')) {
                link.setAttribute('href', baseUrl + encodeURIComponent(trimmedUrl));
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

// Event listener for key press (to detect the "L" key)
document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'l') {
        // Toggle teacher mode
        if (teacherMode) {
            revertLinks();
            teacherMode = false; // Set to normal mode
            closeToggles()
        } else {
            setTeacherPage();
            teacherMode = true; // Set to teacher mode
            closeToggles()
        }
    }
});


function closeToggles() {
    toggles = document.querySelectorAll('details');
    
    toggles.forEach(toggle => {
        if (toggle.open) {  
            toggle.open = false;
        } else {
            toggle.open = true;
        }
    });
}

// Manage the connect button behaviour
function connectToServer() {
    // Modify the button's background
    if (connected) {
        // Remove 'connected' class from button
        connectButton.classList.remove('connected');
        connected = false;
    } else {
        // Add 'connected' class to button
        connectButton.classList.add('connected');
        connected = true
        // Directly start checking for URLs with the base IP
        startCheckingForUrls(baseIP);
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
    fetch('./links.json')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('main');

            // Loop through each category in the JSON data
            Object.keys(data).forEach(category => {
                const categoryData = data[category];
                
                // Check if category has skipRender set to true, if so, skip rendering
                if (categoryData.skipRender) return;

                const detailsElement = document.createElement('details');
                const summaryElement = document.createElement('summary');
                summaryElement.textContent = category;

                const sectionElement = document.createElement('section');

                categoryData.links.forEach(linkData => {
                    const linkElement = document.createElement('a');
                    linkElement.href = linkData.url;
                    linkElement.target = "_blank";

                    const imgElement = document.createElement('img');
                    imgElement.src = linkData.img;

                    linkElement.appendChild(imgElement);
                    linkElement.appendChild(document.createTextNode(linkData.name));

                    sectionElement.appendChild(linkElement);
                });

                detailsElement.appendChild(summaryElement);
                detailsElement.appendChild(sectionElement);
                container.appendChild(detailsElement);
            });
        });

    // Toggle visibility by pressing "L"
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'l') {
            document.querySelectorAll('details').forEach(detail => {
                detail.open = !detail.open;
            });
        }
    });
});

