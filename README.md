# URL Shortener Microservice

This is a URL shortener microservice built with Node.js, Express, and MongoDB. It allows users to shorten long URLs and provides a way to retrieve the original URLs using the shortened version.

## Features

- Shorten long URLs to more manageable, unique short URLs.
- Redirect to the original URL using the shortened URL.
- Validate URLs to ensure they are correctly formatted and resolvable.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. Install the dependencies:
    ```sh
    npm install
    ```

2. Create a `.env` file in the root directory and add your MongoDB connection string:
    ```env
    MONGODB_LINK=your_mongodb_connection_string
    ```

### Running the Application

1. Start the server:
    ```sh
    node index.js
    ```

2. The application will listen on port `5000`. You will see a message in the console indicating the port:
    ```
    Listening on port 5000
    ```

## API Endpoints

### POST `/api/shorturl/`

- **Description:** Shortens a given URL.
- **Parameters:** 
  - `url` (required): The URL to be shortened.
- **Request Body:**
    ```json
    {
      "url": "https://www.example.com"
    }
    ```
- **Response:**
  - If the URL is valid:
    ```json
    {
      "original_url": "https://www.example.com",
      "short_url": "abc12"
    }
    ```
  - If the URL is invalid:
    ```json
    {
      "error": "invalid url"
    }
    ```

### GET `/api/shorturl/:short_url`

- **Description:** Redirects to the original URL corresponding to the given short URL.
- **Parameters:** 
  - `short_url` (required): The shortened URL identifier.
- **Response:**
  - If the short URL is found:
    - Redirects to the original URL.
  - If the short URL is not found:
    - Responds with a `404` status code.

Instructions for building this project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.
