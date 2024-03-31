# NoteKeeper API: DEMO API
![Version](https://img.shields.io/badge/version-1.0.0-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
## Introduction

Welcome to NoteKeeper API, an demo project. Crafted with the latest technologies and best practices, NoteKeeper API is designed to provide a seamless, secure, and scalable experience. Built with TypeScript, it offers a type-safe environment, ensuring that user's data is always valid and consistent.

## Features

- **Type-Safe Development**: Leverages TypeScript and Zod for schema validation, ensuring data integrity and reducing runtime errors.
- **Secure by Design**: Implements basic authentication and secure headers to protect your notes from unauthorized access.
- **Performance Optimized**: Features rate limiting to prevent abuse and ensure fair usage, ensuring your API remains responsive.
- **Scalable and Efficient**: Utilizes Drizzle ORM for efficient database operations, supporting MySQL as the backend, ensuring your notes are stored securely and efficiently.
- **Developer-Friendly**: Comes with a comprehensive set of middleware for logging, compression, CORS, and more, enhancing the development experience and making it easier to integrate with other services.

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MySQL Database

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ItsPinion/NoteKeeper-API.git
   ```

2. **Install Dependencies**

   Navigate to the project directory and run:

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root of your project and add the following environment variables:

   ```env
   MYSQL_HOST=your_mysql_host
   PMA_USER=your_mysql_user
   MYSQL_DATABASE=your_mysql_database
   MYSQL_ROOT_PASSWORD=your_mysql_password
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

## Usage

### Creating a Note

```http
POST /
Content-Type: application/json

{
 "text": "This is a new note",
 "date": "2023-04-01T00:00:00Z"
}
```

### Reading a Note by ID

```http
GET /1
```

### Updating a Note

```http
PUT /1
Content-Type: application/json

{
 "text": "Updated note text",
 "date": "2023-04-02T00:00:00Z"
}
```

### Deleting a Note

```http
DELETE /1
```

### Listing Notes

```http
GET /?page=1&limit=10
```

## License

NoteKeeper API is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please open an issue on GitHub or contact me directly at out [discord server](https://discord.gg/XnzQUw3FPR).

## Acknowledgements

NoteKeeper API is built on the shoulders of giants. Here are the key packages that make it possible:

- **[Hono](https://hono.dev/)**: A lightweight and flexible framework for building web applications, providing the necessary tools to build our API.
- **[Drizzle ORM](https://orm.drizzle.team/)**: Our ORM of choice, enabling efficient database operations and ensuring data integrity.
- **zod**: Our schema validation library, ensuring that all data passed through our API is valid and consistent.

---