# Train Booking API

## Introduction

The Train Booking API to allow users to register, log in, and book seats on trains. It also includes admin functionality to add new trains and provides users with the ability to view train availability and booking details. 

---

## Features

- **User Authentication**: Register and log in with password hashing and JWT authentication.
- **Admin Functionality**: Add new trains with API key protection.
- **Train Management**: Check train availability for specific routes.
- **Booking System**: Book seats on available trains and retrieve booking details.

---

## Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JSON Web Tokens
- **Security**: bcrypt for password hashing

---

## Requirements

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma CLI](https://www.prisma.io/docs/getting-started)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/AdarshSinha7/Railway-Management-API.git
cd <repository_folder>
npm install for installing the packages
node index.js to start the backend for testing the apis
use potman for further testing
