// Constants
// const BASE_IP = "http://localhost:5000";
const BASE_IP = "https://sanvals.pythonanywhere.com";
const loader = document.querySelector("#loader");
const container = document.querySelector("main");
const originalUrls = new Map();
const errorElement = document.querySelector("#loader-text");
const errorImage = document.querySelector("#loader-img");
const avatarPicture = document.getElementById("avatar-picture");
// Buttons visible on teacher mode
const teacherBadge = document.getElementById("teacherBadge")
const dashboardButton = document.getElementById("dashboard-button");
const refreshButton = document.getElementById('refresh-button');
const emptyButton = document.getElementById("empty-button");
const revertButton = document.getElementById('revert-button');
// Alert messages
const teacherCard = document.getElementById("teacher-card");
const card = document.querySelector("#card");

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
let passw = false;

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
  errorImage.style.opacity = 0;
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

function displayLinks(data) {
  const openStates = getOpenStates(); // Step 1: Save current open states

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  Object.entries(data).forEach(([tag, catData]) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = tag;

    details.appendChild(summary);

    const section = document.createElement("section");
    section.setAttribute("aria-label", `${tag} links`);

    catData.forEach((linkData) => {
      const linkElement = document.createElement("a");
      linkElement.href = linkData.url;
      linkElement.target = "_blank";
      linkElement.classList.add("link-item");
      linkElement.setAttribute("aria-label", linkData.name);

      const imgElement = document.createElement("img");
      imgElement.src = linkData.icon;
      imgElement.loading = "lazy";
      imgElement.alt = `${linkData.name} icon`;
      imgElement.classList.add("link-icon");

      linkElement.appendChild(imgElement);
      linkElement.appendChild(document.createTextNode(linkData.name));
      section.appendChild(linkElement);
    });

    details.appendChild(section);
    fragment.appendChild(details);
  });

  container.appendChild(fragment);

  restoreOpenStates(openStates); // Step 2: Restore previous open states
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

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text()
    })
    .then(() => {
      console.log("Set page: " + url);
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
    openStates[summaryText] = details.open; // Store whether it is open or closed
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
    refreshButton.href= BASE_IP + "/refresh";
    teacherClick(event, "Link database refreshed!")
  });

  // Listener to hide the card
  teacherCard.addEventListener("click", (event, message) => {
    teacherCard.classList.toggle("hid");
    teacherCard.innterHTML = "";
  });

  // Make the menu appear when the avatar picture is clicked
  avatarPicture.addEventListener("click", (event, message) =>{
    teacherCard.classList.toggle("hid");

    const input = document.createElement("input");
    input.type = "password";
    input.classList.add("teacher-input");

    teacherCard.innerHTML = "";
    teacherCard.appendChild(input)
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
        return;
      }

      loader.style.opacity = 0;
      // Compare cached data and server data
      if (JSON.stringify(data) !== cachedData) {
        localStorage.setItem("cachedLinks", JSON.stringify(data));
        setTimeout(() => {
          displayLinks(data);
          container.style.opacity = "1";
        }, 500);
    }
  })
  .catch((error) => displayError("No links found", error));
});
