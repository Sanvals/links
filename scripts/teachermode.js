        // Define the base URL for the teacher's page
        const baseUrl = "https://sanvals.pythonanywhere.com/set_url/";

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