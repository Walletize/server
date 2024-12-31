![Walletize](hero-light.png)

# Walletize Server

The backend server for Walletize - the open-source personal finance app that's simple and modern.

## About

This is the Express.js server that powers Walletize, a web application designed to help individuals efficiently manage their personal finances. It provides the API endpoints needed to track income, expenses, assets, and liabilities while enabling comprehensive insights into net worth and overall financial health.

Key features:

- Multi-currency support with automatic rate updates
- User authentication and authorization
- Shared financial accounts management
- Asset tracking (savings, investments, real estate, etc.)
- Transaction management
- RESTful API endpoints

## Prerequisites

- PostgreSQL 14 or higher
- Node.js 18 or higher
- Docker (if using containerized deployment)

## How to Use

There are two ways to use the Walletize server:

### 1. Managed Service

Visit [www.walletize.app](https://www.walletize.app) to use the managed version. This is the easiest way to get started - simply create an account and start tracking your finances. The managed version includes automatic updates, backups, and technical support.

### 2. Self-Hosting with Docker

To self-host the Walletize server:

1. Clone this repository:

   ```bash
   git clone https://github.com/justinjap/walletize-server.git
   cd walletize-server
   ```

2. Set up a PostgreSQL database:

   - Install PostgreSQL if you haven't already
   - Create a new database:
     ```bash
     createdb walletize
     ```
   - Or use Docker to run PostgreSQL:
     ```bash
     docker run --name walletize-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=walletize -p 5432:5432 -d postgres:14
     ```

3. Create a `.env` file in the root directory with the following variables:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/walletize"
   PORT=3100
   WEB_URL="http://localhost:3000"
   ```

4. Build the Docker image:

   ```bash
   docker build -t walletize-server .
   ```

5. Run the container:

   ```bash
   docker run -d \
     --name walletize-server \
     -p 3100:3100 \
     --env-file .env \
     walletize-server
   ```

6. The server will be running at `http://localhost:3100`

After setting up the server, you'll need to set up the web application by following the instructions in the [walletize](https://github.com/justinjap/walletize) repository.
