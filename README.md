# Ecommerce - 🛍️ Product Search API & Interface

Product Search Application is a full-stack web project that demonstrates a robust product search system. It provides a RESTful API and a responsive front-end interface for searching and browsing products. The application is built with a modern JavaScript stack:

**Backend**: Node.js with Express framework, using MongoDB as the database (via Mongoose ODM). It includes optional integration with Elasticsearch for advanced search features (autocomplete suggestions).

**Frontend**: React (bootstrapped with Vite) for a dynamic user interface. The front-end is styled with SCSS and uses modern React Hooks for state management and side effects.

**Infrastructure & Tools**: MongoDB for data storage (with indexing for performance), Docker Compose for quickly spinning up supporting services (Elasticsearch and Kibana for search analytics). The project uses Faker for seeding demo data and follows best practices like environment-based configuration and input validation.

This system allows users to search through a catalog of products by name or description, filter results by category or tenant (vendor), sort and paginate the results, and even get autocomplete suggestions as they type. It serves as an example of implementing efficient search and filtering in a MERN-stack application.

## Features

-   🔍 **Full-Text Product Search**: Users can search for products by name or description. The search is case-insensitive and supports partial matches (e.g. searching "phone" will match "smartphone"). Multiple keywords are handled by treating the search as a sequence of terms to match in order in the text.
-   🏷️ **Filtering by Category and Tenant**: Results can be narrowed down by product category (e.g. Electronics, Books, Fashion) and by tenant – a concept similar to a vendor or marketplace (e.g. Amazon, Walmart). This allows multi-tenant support, meaning the search can be scoped to a particular vendor's products if desired.
-   ↕ **Sorting**: Users can sort the results by various fields:
    -   Name (alphabetical order A–Z or Z–A)
    -   Price (lowest to highest or vice versa)
    -   Relevance (relevant according to search)  
        The backend supports a sort field and order parameters to deliver sorted results, and the UI provides dropdowns to select the sort criteria and order.
-   🔃 **Pagination**: Search and listing results are paginated. Users can navigate through pages of results using "Prev" and "Next" controls. The backend returns the total result count and total pages, enabling the front-end to display the current page and total pages.
-   💡 **Autocomplete Suggestions**: As you type in the search box, the app offers autocomplete suggestions for matching product names. This is implemented via an Elasticsearch query that finds products with names or descriptions starting with the input text. Up to 10 suggestions appear in a dropdown, and clicking a suggestion will populate the search field.
-   🕑 **Debounced Input**: The search input is debounced on the frontend – meaning the app waits briefly (e.g. 300ms) after the user stops typing before triggering a search or suggestions query. This prevents overwhelming the server with requests on every keystroke and improves performance and user experience.
-   ✅ **Safe Querying & Validation**: The backend validates all incoming query parameters and user input. It ensures required fields are present (e.g. the search term q must not be empty for the search endpoint) and that values are of the correct type/range (for example, page and limit must be positive integers, sort fields must be one of the allowed fields, etc.). This guards against malformed requests and potential injection attacks in queries.
-   🔄 **Data Seeding**: A convenient seeding script is included to populate the MongoDB database with sample product data (using faker). This generates a large set of realistic product entries across various categories and tenants for testing the search functionality. It also populates the Elasticsearch index for suggestions, so the features can be experienced with minimal setup.  
    (Additionally, the backend includes an endpoint to add new products (`POST /products`) for completeness, allowing expansion of the product catalog via API.)

A scalable, production-ready product search system for an e-commerce platform — built with **MongoDB**, **Express**, **React**, and **Node.js** (MERN). Designed with indexing, validation, pagination, and performance as first-class concerns.

---

# ⚙️ Setup & Installation

Follow these steps to set up the project for development or testing:

---

## 1. Clone the Repository

Clone the project repository to your local machine. (If you have the code archive, extract it.)

```bash
git clone https://github.com/gvaswani98/Ecommerce
cd Ecommerce
```

---

## 2. Install Backend Dependencies

Go to the `/server` directory and install the Node.js dependencies:

```bash
cd server
npm install
```

---

## 3. Install Frontend Dependencies

In a separate terminal, go to the `/client` directory and install its dependencies:

```bash
cd client
npm install
```

---

## 4. Configure Environment Variables

### MongoDB

Ensure you have a MongoDB instance running. You can use a local MongoDB (default: `mongodb://localhost:27017`) or a hosted MongoDB Atlas cluster.

### Elasticsearch (Optional for Suggestions)

If you want to enable autocomplete suggestions, you should have Elasticsearch up and running (default: `http://localhost:9200`). You can quickly start it using Docker Compose (see step 5).

### Create .env files

#### Server (`/server/.env`)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=products
ELASTICSEARCH_URL=http://localhost:9200
```

> Replace `MONGO_URI` with your MongoDB Atlas string if needed. `ELASTICSEARCH_URL` is optional and only needed if using suggestions.

#### Client (`/client/.env`)

```env
VITE_SERVER_API=http://localhost:3000
```

> Adjust if your backend runs on a different port or host.

---

## 5. Start Elasticsearch via Docker

The project provides a Docker Compose file to run Elasticsearch and Kibana:

```bash
# From the project root directory:
docker-compose up -d
```

-   Elasticsearch will be available on port `9200`
-   Kibana (for inspection) on port `5601` (optional)
-   Default setup disables security for development use

---

## 6. Seed the Database (and Elasticsearch)

Seed the MongoDB database with fake product data:

```bash
cd server
npm run seed
```

-   Clears existing data
-   Populates thousands of sample product entries
-   Indexes data into Elasticsearch (if running)

---

## 7. Run the Backend Server

Start the Express server:

```bash
npm run dev
```

Expected output:

```
✅ MongoDB connected to DB: products @ localhost
Server is running on port 3000
```

---

## 8. Run the Frontend Development Server

Open another terminal and run:

```bash
cd client
npm run dev
```

-   This launches Vite dev server, typically at `http://localhost:5173`
-   Open in browser to view the app

---

## 9. Using the Application

-   Type a term (e.g., "Laptop") into the search bar
-   View matching product results
-   Autocomplete suggestions appear (if Elasticsearch is active)
-   Use filters for Category and Tenant
-   Sort by Name, Price, or Search Relevance
-   Paginate using Next/Prev buttons

---

## 📂 Folder Structure

```
root/
├── server/
│   ├── routes/          # API endpoints
│   ├── data/            # Data access layer
│   ├── models/          # Mongoose models
│   ├── helpers/         # Validation, error handling
│   ├── constants/       # Reusable enums/constants
│   └── seed.js          # DB seeding logic
├── client/
│   ├── src/
│   │   ├── components/  # UI components (Input, Select, Card)
│   │   ├── pages/       # Home page
│   │   ├── styles/      # SCSS modules (variables, global, per-component)
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

---

# 📡 API Documentation

The backend provides a RESTful API for retrieving and managing products. Below are the primary endpoints relevant to product search and listing:

---

## 🔹 `GET /products` – List All Products (Paginated)

Returns a list of products with optional filtering by category or tenant. Supports pagination and sorting.

-   **Use case**: General browsing or when no search term is provided.

---

## 🔹 `GET /products/search` – Full-Text Product Search

Searches products by name or description using a text query. Supports filters, pagination, and sorting.

---

## 🔹 `GET /products/suggestions` – Autocomplete Suggestions

Returns suggested product names based on a partial query. Meant to provide instant suggestions as the user types.

> Requires Elasticsearch. If not available, this endpoint will return an error, and the frontend disables suggestions automatically.

---

## 🔹 `POST /products` – Add New Product

Allows adding a new product by sending product details in the request body (JSON). Mainly for development/testing.

---

## 📌 Detailed Endpoint: `GET /products/search`

### Description

Retrieves products matching a search query. Filters, sorting, and pagination supported.

### Method

`GET`

### Endpoint

`/products/search`

---

### Query Parameters

| Parameter  | Type   | Required | Description                                                                |
| ---------- | ------ | -------- | -------------------------------------------------------------------------- |
| `q`        | string | ✅ Yes   | Search term to match in name/description (case-insensitive, partial match) |
| `category` | string | ❌ No    | Filter by category (exact match)                                           |
| `tenant`   | string | ❌ No    | Filter by tenant/vendor (exact match)                                      |
| `page`     | number | ❌ No    | Page number (1-indexed). Defaults to `1`                                   |
| `limit`    | number | ❌ No    | Results per page. Defaults to `10`                                         |
| `sortBy`   | string | ❌ No    | Sort field (`name`, `price`, `createdAt`, `score`)                         |
| `order`    | string | ❌ No    | Sort direction (`asc` or `desc`). Default: `desc`                          |

---

### Example Request

```http
GET http://localhost:3000/products/search?q=laptop&category=Electronics&page=1&limit=5&sortBy=price&order=asc
```

---

### Example Response

```json
{
	"meta": {
		"total": 12,
		"page": 1,
		"limit": 5,
		"totalPages": 3
	},
	"results": [
		{
			"_id": "644ad74d8f5b4b4d88f2fabc",
			"name": "Gaming Laptop",
			"description": "High-end electronics item sold by Amazon. Perfect for your needs.",
			"category": "Electronics",
			"tenant": "Amazon",
			"price": 1299.99,
			"inStock": true,
			"createdAt": "2025-05-01T14:32:17.123Z"
		},
		{
			"_id": "644ad74d8f5b4b4d88f2fac0",
			"name": "Ultrabook Laptop",
			"description": "Lightweight Electronics sold by Amazon. Perfect for your needs.",
			"category": "Electronics",
			"tenant": "Amazon",
			"price": 999.5,
			"inStock": false,
			"createdAt": "2025-05-01T14:32:17.125Z"
		}
	]
}
```

---

### Notes

-   Results are paginated based on `limit` and `page`
-   All matched products will contain the search term in their name or description
-   Sorting is handled as specified in query

---

### Error Handling

-   Missing `q` parameter returns:

```json
{ "error": "Search query (q) is required" }
```

-   Invalid values for `page`, `limit`, or `sortBy` yield 400 errors with messages

---

# 🏗️ System Architecture

This project follows a typical **three-tier architecture** with a client-server-database pattern, plus an optional search engine component:

---

## 1. 🧑‍💻 Frontend (React)

-   Built as a single-page application using React (Vite)
-   Uses Axios to make HTTP requests to the backend
-   User interactions (search terms, filters) trigger API calls to the backend

---

## 2. 🖥️ Backend (Node.js + Express API)

-   Provides REST endpoints under `/products`
-   Handles:
    -   Receiving and validating HTTP requests
    -   Processing query parameters
    -   Querying MongoDB or Elasticsearch
    -   Formatting and returning JSON responses

---

## 3. 🗄️ Database (MongoDB)

-   Product data is stored in MongoDB
-   Accessed via Mongoose ORM
-   Handles:
    -   Listing and filtering products with `find()` queries
    -   Full-text search via regex match on `name` and `description` fields
    -   Utilizes indexes to optimize lookups

---

## 4. 🔍 Search Engine (Elasticsearch)

-   Used for autocomplete suggestions only
-   Handles:
    -   Prefix-based search on product name/description fields
    -   Fast, efficient partial match lookups

---

## 🔁 Flow Summary

1. **User** enters search text or filters in the **React UI**
2. The **React app** sends an API request to the **Express server**
3. The **Express backend**:
    - For listings/search → queries MongoDB
    - For suggestions → queries Elasticsearch
4. **MongoDB** returns product documents; **Elasticsearch** returns matching suggestion strings
5. The **backend** constructs a JSON response with product data and metadata
6. The **frontend** updates UI components: product cards, pagination, or autocomplete suggestions

---

## 🔌 Communication

-   All frontend-backend interaction happens over HTTP using JSON
-   Backend is stateless and modular, making it scalable
-   Components (DB, frontend, backend, search engine) can be independently deployed or scaled

---

## 📦 Data Sync (Seeding)

-   The `seed` script populates:
    -   MongoDB with product data
    -   Elasticsearch with corresponding text index
-   Ensures consistency between database and search index

# 🧾 Database Design & Indexing

The application uses a single primary MongoDB collection to store product data.

---

## 📦 Product Schema (Mongoose)

```js
Product {
  name:        String,  // Product name (required, indexed for text search)
  category:    String,  // Category name (required)
  tenant:      String,  // Vendor/tenant name (required)
  description: String,  // Description (optional)
  price:       Number,  // Product price (non-negative)
  inStock:     Boolean, // Availability (default: true)
  createdAt:   Date,    // Created timestamp (auto-generated)
}
```

---

## 🔍 Indexes

### 1. Compound Index on `category` and `tenant`

```js
ProductSchema.index({ category: 1, tenant: 1 });
```

-   Optimizes filtered queries like "Electronics from Amazon"
-   Helps general listing endpoints with filters

### 2. Text Index on `name` and `description`

```js
ProductSchema.index({ name: 'text', description: 'text' });
```

-   Enables full-text search
-   Allows future use of `$text` queries with relevance scores
-   Though current search uses regex, this index supports switch to advanced search

> ⚠️ MongoDB's text index doesn't support prefix matching. Regex was chosen for autocomplete-like partial matches.

---

## 🧠 Design Notes

-   **Multi-Tenant Support**: `tenant` field tags products with a vendor (e.g., "Amazon", "Walmart")
-   **Timestamps**: `createdAt` and `updatedAt` managed by Mongoose
-   **Seed Volume**: Inserts ~2,500 products for testing but can scale much further
-   **Index Usage**: Verified using MongoDB's `.explain()` to ensure optimized queries

---

# 📄 Pagination

Pagination is implemented both on the backend and frontend.

---

## 🖥 Backend Logic

-   Accepts `page` and `limit` query params
-   Uses:
    ```js
    const skip = (page - 1) * limit;
    .find(...).skip(skip).limit(limit);
    ```
-   Executes a parallel `countDocuments()` call to compute total results
-   Constructs and returns:

```json
{
	"meta": {
		"total": 100,
		"page": 1,
		"limit": 10,
		"totalPages": 10
	},
	"results": [
		/* products */
	]
}
```

---

## 🧑‍💻 Frontend Pagination

-   Tracks current `page` in state
-   Updates via Prev/Next buttons
-   On page change → triggers new API call with `useEffect`
-   Displays "Page X of Y" with Prev/Next controls
-   Reset to page 1 on any new search/filter (handled in `handleSearch`)

---

## ⚙️ Page Size (Limit)

-   Default: `10` (via `DEFAULT_PAGE_LIMIT`)
-   Can be overridden by `limit` param in query
-   UI does not expose this yet (can be added)

---

## ✅ UX Notes

-   Prevents confusing states like being on page 5 of a new search
-   Lightweight UI avoids numbered page links for simplicity
-   Can easily extend for better navigation if dataset grows

---

## 💡 Summary

Combined backend and frontend pagination ensures:

-   Only a limited set of products is queried and rendered
-   Scalable UX and fast response time
-   Efficient use of database indexes and query planners

# 🚀 Performance & Optimization

Several strategies ensure the search experience remains fast and responsive:

---

## ⚡ MongoDB Indexes

-   Indexes on `category + tenant` and `name + description` optimize lookups.
-   Text index enables fast full-text searches (if used).
-   Compound index accelerates filtered queries.

---

## 🧠 Lean Queries

-   Mongoose `.lean()` is used to return plain JS objects, reducing memory use and overhead.

---

## 🧵 Parallelized Count & Find

-   `Promise.all()` is used to run `find()` and `countDocuments()` simultaneously.
-   Minimizes overall request latency.

---

## 🕒 Debounced Input

-   300ms debounce using a custom `useDebounce` hook avoids unnecessary API calls.
-   Reduces backend load and improves UX.

---

## ❌ Autocomplete Toggle on Failure

-   If `/products/suggestions` fails, frontend disables suggestions to avoid repeated failed requests.

---

## 🔐 Input Validation

-   Validates all query parameters (e.g., `q`, `limit`, `sortBy`) to prevent abuse or expensive queries.

---

## 🔤 Case-Insensitive Sorting

-   Uses MongoDB collation `{ locale: 'en', strength: 2 }` for consistent string sorting.

---

## 📦 Efficient Data Transfer

-   Only required fields are returned to minimize payload size.
-   Suggestions endpoint returns only names via `_source: ['name']` in Elasticsearch.

---

## 🧪 Developer Experience

-   Seeder populates MongoDB and Elasticsearch efficiently.
-   Docker setup helps simulate realistic environments quickly.

---

# 📈 Scalability Opportunities

Ways to scale the app for production environments:

---

## 🧩 Sharding MongoDB

-   Split large datasets across shards (e.g., by tenant or category).
-   Enables horizontal scaling.

---

## 🔁 Replica Sets for Read Scaling

-   Secondary replicas can handle reads.
-   Useful when reads far outnumber writes.

---

## 🧠 Redis Caching

-   Cache common search queries.
-   Reduces database load and improves speed.

---

## 🚫 Rate Limiting

-   Middleware like `express-rate-limit` can cap requests/IP.
-   Prevents abuse and ensures fair use.

---

## 🔍 Atlas Search or Elasticsearch

-   Atlas Search (Lucene-powered) enables rich full-text search within MongoDB.
-   Expand Elasticsearch from just suggestions to full search handling.

---

## 🧱 Dedicated Search Microservice

-   Search logic could be separated into a scalable microservice.

---

## 📤 Asynchronous Indexing

-   Use a message queue (Kafka, RabbitMQ) to index new data in Elasticsearch without blocking.

---

## 📶 Load Balanced Backend

-   Deploy multiple server instances behind a load balancer (Nginx, HAProxy, or cloud-native).

---

## 🌍 CDN & Asset Optimization

-   Serve React build via CDN.
-   Use API gateway for global traffic routing.

---

# 🎁 Bonus Features

Additional enhancements built into the project:

---

## ✨ Autocomplete Suggestions

-   Elasticsearch-powered, returns top 10 name/description matches.
-   Disabled gracefully if Elasticsearch is down.

---

## 🔃 Flexible Sorting

-   Sort by name, price, date, or search (relevance).
-   Extendable via UI dropdowns.

---

## 🏪 Multi-Tenancy Support

-   `tenant` field supports vendor-specific filtering and admin scoping.

---

## 🎯 Relevance Sorting Placeholder

-   UI and backend accept `score` sort.
-   Ready for upgrade to true relevance-based search (via text score or Elasticsearch).

---

## 🔒 Secure & Modern Practices

-   Uses environment variables
-   CORS-enabled backend
-   Linting setup
-   Modern ES modules

---

## ➕ POST /products Endpoint

-   Allows adding products via API (future admin panel use)

---

## 🐳 DevOps-Ready

-   Docker Compose for Elasticsearch + Kibana
-   Easy to containerize server/client with Docker

---

## 🧪 Realistic Testing Data

-   Uses Faker to create diverse, realistic product listings
-   Uncovers edge cases naturally

---

## 👨‍💻 Author

**Gautam Vaswani**  
Full-Stack Developer
[LinkedIn](https://www.linkedin.com/in/gautamvaswani/)
