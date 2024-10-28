document.addEventListener('DOMContentLoaded', () => {
    // Fetch links from JSON file
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