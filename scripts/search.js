const searchInput = document.getElementById('search-input')

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

// Attach the debounced event listener
searchInput.addEventListener('keyup', debounce(handleSearch, 300));