# 🔗 Educational Links Page

A customizable and dynamic web application designed to provide easy access to educational resources and websites for students and teachers. It features a special "Teacher Mode" that helps open links on the students laptops, making it easier for teachers to share content with their students.

# 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Technologies](#technologies)


## 🧩 Features

- **Teacher Mode**: Easy toggle for 'teacher mode'.
- **Customizable**: Costomization of the page's style via vanilla JS.
- **Responsive**: View links and resources on different devices.
- **Safe**: For security, links are validated before being set on the server.
- **Offline Support**: Offline fully functional mode via cached links.
- **Search**: Search for links by name.

## 🎥 Demo

[View Demo](https://sanvals.github.io/links/)

## 🚀 Installation

In order to set up the project locally, follow these steps:

1. Clone the repository to your local machine.

```bash
git clone https://github.com/sanvals/links.git
```

2. Navigate to the project directory.

```bash
cd links
```

### 🛠️ Usage

1. Access the Links Page from the browser.

2. Browse the links and resources.

3. Access the 'Teacher Mode':

    - Press the avatar picture and enter the password to switch to teacher mode.
    - Links set the URL on the server, and it's sent to the student's laptops.
    - 'Empty' button clears the URL from the database.
    - 'Refresh' button calls Notion server and refresh the links database.

#### Endpoints

- `/set_url/:url` - Sets the source data on the server.
- `/get_url` - Gets the source data from the server.
- `/empty` - Empties the source data from the server.
- `/refresh` - Refreshes the data the server holds.

## ⚙️ Configuration

The project is configured to use environment variables. Please ensure that the following environment variables are set:

- `NOTION_TOKEN`: The Notion API token.
- `DATABASE_ID`: The Notion database ID.

## 🛠️ Technologies

On the server:

- [Flask](https://flask.palletsprojects.com/en/2.2.x/)
- [Flask-Cors](https://flask-cors.readthedocs.io/en/latest/)
- [Python](https://www.python.org/)
- [Notion](https://www.notion.so/)

On the client:

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)