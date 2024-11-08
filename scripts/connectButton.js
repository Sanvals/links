const CONNECTBUTTON = document.getElementById('connect-button');
let connected = false

function connectToServer() {
    connected = !connected
    CONNECTBUTTON.classList.toggle('connected', connected)
    CONNECTBUTTON.innerHTML = connected ? '🛑' : '🔗'

    if(connected) {
        startCheckingForUrls(BASE_IP)
    } else {
        clearInterval(intervalId)
        intervalId = null;
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