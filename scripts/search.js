const searchInput = document.getElementById('search-input')
const reverseIcon = document.getElementById('order-icon')

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

function reverseOrder() {
    const details = document.querySelectorAll('details');
    details.forEach(d => {
        // Grab all the links inside every details element
        let linkList = Array.from(d.childNodes[1].querySelectorAll('a'))

        // Check if they are already reversed
        if (linkList[0].dataset.num > linkList[1].dataset.num) {
            linkList.sort((a, b) => a.dataset.num - b.dataset.num)
        }
        // Return them to normal if they are reversed
        else {
            linkList.sort((a, b) => b.dataset.num - a.dataset.num)
        }

        // Clear the list and repopulate
        d.childNodes[1].textContent = ''
        linkList.forEach(l => d.childNodes[1].appendChild(l))
    });
}

// Attach the debounced event listener
searchInput.addEventListener('keyup', debounce(handleSearch, 300));

reverseIcon.addEventListener('click', reverseOrder);