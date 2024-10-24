let lastUrl = "";
let intervalId; // To store the interval ID

const baseIP = "https://sanvals.pythonanywhere.com"; // Your PythonAnywhere URL

function connectToServer() {
    // Modify the button's background
    const connectButton = document.getElementById('connect-button');
    connectButton.classList.add('connected');  // Add 'connected' class to button

    // Directly start checking for URLs with the base IP
    startCheckingForUrls(baseIP);
}

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