// Constants
const BASE_IP = "https://sanvals.pythonanywhere.com";

// DOM elements
const $ = (element) => document.getElementById(element);
const loader = $("loader");
const errorElement = $("loader-text");
const container = $('dynamic-links-container');
const avatarPicture = $("avatar-picture");
const teacherBadge = $("teacherBadge");
const dashboardButton = $("dashboard-button");
const refreshButton = $("refresh-button");
const emptyButton = $("empty-button");
const revertButton = $("revert-button");
const teacherCard = $("teacher-card");
const card = $("card");

const originalUrls = new Map();
const teacherPass = "logilogi";

const hiddenObjects = [
  teacherBadge,
  dashboardButton,
  refreshButton,
  emptyButton,
  revertButton,
]

// State variables
let teacherMode = false;

// Utility functions
function displayCard(message) {
  card.textContent = message;

  setTimeout(() => {
    card.style.opacity = "0";
    card.addEventListener("transitionend", () => {
      card.style.display = "none";
    }, {once: true})
  }, 2000);
}

function displayError(message, error = null) {
  errorElement.textContent = message;
  if (error) console.error(error)
}

const updateLink = (link, newUrl) => {
  link.setAttribute("href", newUrl);
  link.classList.add("active-link");
  originalUrls.set(link, newUrl);
};

function toggleObjects (objects) {
  objects.forEach((object) => {
    object.classList.toggle("hid", !teacherMode);
  });
}

function create(tag, attributes = {}, properties = {}) {
  const element = document.createElement(tag);

  // Apply attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  // Apply properties
  Object.entries(properties).forEach(([key, value]) => {
    element[key] = value;
  })

  return element;
}

function displayLinks(data) {
  // Save current open states
  const openStates = getOpenStates();

  // Prepare the fragment
  const fragment = document.createDocumentFragment();

  // Look through data and build structure
  Object.entries(data).forEach(([tag, catData]) => {
    const details = create("details");
    const summary = create("summary", {}, {textContent: tag});

    details.appendChild(summary);

    const section = create(
      "section", 
      {"aria-label": `${tag} links`}, 
      {textContent: tag}
    );

    catData.forEach((linkData) => {
      const linkElement = create(
        "a", 
        {
          href: linkData.url,
          target: "_blank",
          class: "link-item",
          "aria-label": linkData.name,
          "data-num": linkData.num
        },
        {
          textContent: linkData.name
        }
      )

      const imgElement = create(
        "img", 
        {
          src: linkData.icon,
          loading: "lazy",
          alt: `${linkData.name} icon`,
          class: "link-icon"
        }
      )

      const orderElement = create(
        "span",
        {class: "link-order"},
        {textContent: linkData.num},
      )

      linkElement.appendChild(orderElement);
      linkElement.appendChild(imgElement);
      section.appendChild(linkElement);
    });

    details.appendChild(section);
    fragment.appendChild(details);
  });

  container.replaceChildren(fragment);

  // Restore open states
  restoreOpenStates(openStates);
  if (reversedLinks) reverse()
}

// Function to change all links to the "teacher page" URLs
function toggleLinks(isTeacherMode) {
  const links = document.querySelectorAll("a:not(#short-links a)");
  links.forEach((link) => {
    const originalUrl = link.getAttribute("href");
    if (originalUrl) {
      const trimmedUrl = originalUrl.replace(/^https?:\/\//, "");

      // Activate the teacher mode
      if (isTeacherMode) {
        // Store the original URL
        originalUrls.set(link, originalUrl);

        // Prepend the BASE_IP only if it's not already using the BASE_IP
        if (!trimmedUrl.startsWith("sanvals.pythonanywhere.com")) {
          link.setAttribute(
            "href",
            BASE_IP + "/set_url/" + encodeURIComponent(trimmedUrl)
          );
        }

        // Add event listener for teacher mode behaviour
        const handler = teacherHandler("Link sent!");
        link.addEventListener("click", handler, false);
        link._handler = handler;

        link.classList.add("active-link");

        // Return back to the normal mode
      } else {
        // Restore the original URL
        if (originalUrls.has(link)) {
          link.setAttribute("href", originalUrls.get(link));
          originalUrls.delete(link);
        }
        link.classList.remove("active-link");

        link.removeEventListener("click", link._handler, false);
      }
    }
  });
  teacherMode = !teacherMode;
  toggleObjects(hiddenObjects);
}


function teacherHandler(message) {
  return function (event) {
    teacherClick(event, message);
  };
}

function teacherClick(event, message) {
  event.preventDefault();
  const link = event.currentTarget;
  const url = link.getAttribute("href");
  
  // Show the card before sending the request
  card.style.opacity = "1";
  card.style.display = "flex";
  card.textContent = "Sending request...";

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text()
    })
    .then(() => {
      console.log("Page set: " + url);
      displayCard(message)
    })
    .catch((error) => {
      console.error("Error sending page:", error);
      displayCard("Error sending page");
    });
}

function getOpenStates() {
  const openStates = {};
  const detailsElements = container.querySelectorAll("details");
  detailsElements.forEach((details) => {
    const summaryText = details.querySelector("summary").textContent;
    openStates[summaryText] = details.open;
  });
  return openStates;
}

function restoreOpenStates(openStates) {
  const detailsElements = container.querySelectorAll("details");
  detailsElements.forEach((details) => {
    const summaryText = details.querySelector("summary").textContent;
    if (openStates[summaryText]) {
      details.open = true;
    }
  });
}

function showQRCode() {
  teacherCard.classList.toggle("hid");
  
  const img = document.createElement("img");
  img.src = "static/images/qrcode.png";
  img.alt = "QR Code to the current page";

  teacherCard.textContent = "";
  teacherCard.appendChild(img)
}

// Fetch links from JSON file
document.addEventListener("DOMContentLoaded", () => {
  // Listeners for the buttons
  emptyButton.addEventListener("click", (event, message) => {
    emptyButton.href = BASE_IP + "/empty";
    card.style.opacity = "1";
    teacherClick(event, "Link emptied!")
  });

  refreshButton.addEventListener("click", (event, message) => {
    refreshButton.href = BASE_IP + "/refresh";
    teacherClick(event, "Database refreshed! Reloading page...")
      .then(() => {
        return setTimeout(() => {
          location.reload();
        }, 2000);
      })
  });

  // Listener to hide the card
  teacherCard.addEventListener("click", (event, message) => {
    teacherCard.classList.toggle("hid");
    teacherCard.innterHTML = "";
  });

  // Make the menu appear when the avatar picture is clicked
  avatarPicture.addEventListener("click", (event, message) =>{
    teacherCard.classList.toggle("hid");
    
    const input = create(
      "input", 
      { type: "password", name: "Password" }
    )

    teacherCard.replaceChildren(input)
    input.focus();

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const password = input.value;
        if (password === teacherPass) {
          teacherCard.classList.toggle("hid");
          toggleLinks(!teacherMode);
        }}
    });
  });

  // Loock for cached data and display if found
  const cachedData = localStorage.getItem("cachedLinks");
  if (cachedData) {
    setTimeout(() => {
      displayLinks(JSON.parse(cachedData));
      container.style.opacity = "1";
    }, 500);
  } else {
    loader.style.opacity = "1";
  }

// Fetch the data from pythonanywhere
  fetch(BASE_IP)
    .then((response) => {
      if (!response.ok) {
        displayError("Network error", response.statusText);
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Process and display the data
      if (!Object.keys(data).length) {
        displayError("Links are empty");
        
        card.style.opacity = "1";
        card.style.display = "flex";
        card.textContent = "Attempting to reach the database. Please wait...";
        // If there are no links, refresh the server
        if (!cachedData) {
          console.log("No cached links found. Sending refresh request to the server...");
          
          // Send the refresh request
          fetch(BASE_IP + "/refresh")
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to refresh links on the server");
              }
              return response.text();
            })
            .then(() => {
              card.style.opacity = "1";
              card.style.display = "flex";
              displayCard("Successful! Refreshing page...");
              
              // Reload the page after a short delay
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch((error) => {
              displayError("Failed to refresh links", error);
            });
        }
        return;
      }

      loader.style.opacity = 0;
      // Compare cached data and server data
      if (JSON.stringify(data) !== cachedData) {
        localStorage.setItem("cachedLinks", JSON.stringify(data));
        setTimeout(() => {
          displayLinks(data);
          container.style.opacity = "1";
        }, 500)
    }
  })
  .catch((error) => displayError("No links found", error));
});
