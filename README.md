## ExpressJs-Redis-MongoDb

## Description

ExpressJs-Redis-MongoDb is a versatile Node.js project designed to seamlessly fetch data from an external API using an integrated HTTP Proxy. The retrieved data is intelligently stored in a MongoDB database for persistent storage, while Redis serves as a high-performance cache to optimize subsequent data access. This project empowers developers to build robust applications that leverage the power of proxying, database storage, and caching for efficient and scalable data management.



## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/enegadi/ExpressJs-Redis-MongoDb.git
   ```

2. Navigate to the project directory:

   ```bash
   cd express-redis-mongodb
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Configure the environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables and provide appropriate values:

     ```plaintext
     PORT=3000
     API_URL="external_api_url"
     DATABASE_URL="your_database_url"
     ```

5. Start the server:

   ```bash
   npm run dev
   ```

6. The server should now be running on `http://localhost:3000`.


## Project Structure

The project structure for ExpressJs-Redis-MongoDb is as follows:

- `node_modules`: (Auto-generated) Contains project dependencies.
- `prisma`: Prisma configuration and migrations.
- `src`: Source code files.
    - `config`: Configuration files.
    - `controllers`: Request handlers.
    - `helpers`: Utility functions or helper modules.
    - `interfaces`: TypeScript interfaces or type declarations.
    - `middlewares`: Middleware functions.
    - `routes`: Route definitions.
    - `services`: Business logic or services.
    - `app.ts`: Main application file.
