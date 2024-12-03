const searchInput = document.getElementById('search-input')
const reverseIcon = document.getElementById('order-icon')

// State variables
let reversedLinks = JSON.parse(localStorage.getItem("reversedLinks")) || false;

// Debounce function to delay execution of the search logic
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

function handleSearch() {
    // Query dynamic elements only when needed
    const links = document.querySelectorAll('main a');
    const toggles = document.querySelectorAll('details');

    const searchValue = searchInput.value.trim().toLowerCase();

    // Filter links
    links.forEach(link => {
        const isMatch = link.textContent.toLowerCase().includes(searchValue);
        link.classList.toggle('hid', !isMatch);
    });

    // Toggle details elements
    const shouldOpenDetails = searchValue !== '';
    toggles.forEach(toggle => (toggle.open = shouldOpenDetails));
}

function reverse() {
    document.querySelectorAll('details').forEach(details => {
        const container = details.childNodes[1];
        
        // Grab all the links and repopulate
        const linkList = Array.from(container.querySelectorAll('a')).reverse()
        container.replaceChildren(...linkList);
    });
}

function reverseClick() {
    reverse();
    reversedLinks = !reversedLinks
    localStorage.setItem("reversedLinks", JSON.stringify(reversedLinks));
}

// Start the event listeners
searchInput.addEventListener('keyup', debounce(handleSearch, 300));
reverseIcon.addEventListener('click', reverseClick);