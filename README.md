# Stock Price View API Documentation

Deployed on Cyclic- https://plain-getup-worm.cyclic.app/api/

## Installation

1. **Clone the repository:**
```bash 
 git clone https://github.com/n1ght-k1ng/stock-price-view-app
```
2. **Navigate to the Project Directory**

    ```bash 
    cd stock-price-view-app
    ```
3. **Install Dependencies**
    ``` bash
    npm install 
    ```
4. **Setup Environment Variables** 
Create a .env file in the root directory and add the necessary environment variables:
    
    ```bash 
    MONGODB_URI = your_mongodb_uri
    ```

## Running the API 

with  `npm start`

The API will be accessible at http://localhost:8001/api.

# API Endpoints

## Refresh Data

- **URL:** `/`
- **Method:** `GET`
- **Example:** ` https://plain-getup-worm.cyclic.app/api/`
- **Description:** Refreshes stock data.

## Get Stock by Date

- **URL:** `/stock-by-date/:date`
- **Method:** `GET`
- **Parameters:**
  - `date`: Date in the format YY-MM-DD
- **Description:** Retrieves stock data for a specific date.

### Get Top 10 Stocks

- **URL:** `/top10stocks`
- **Example:** ` https://plain-getup-worm.cyclic.app/api/top10stocks`
- **Method:** `GET`
- **Description:** Retrieves information about the top 10 stocks of the last market day.

### Get Stock by Name

- **URL:** `/stock-by-name/:name`
- **Method:** `GET`
- **Example** `https://plain-getup-worm.cyclic.app/api/stock-by-name/mrf`
- **Parameters:**
  - `name`: Name of the stock
- **Description:** Retrieves stock data by name by regex search. 

### Get Stock History

- **URL:** `/stock-history/:code` 
- **Method:** `GET`
- **Example** `https://plain-getup-worm.cyclic.app/api/stock-history/500038`
- **Parameters:**
  - `code`: Stock code
- **Description:** Retrieves historical stock data.

### Post Favorite Stock

- **URL:** `http://localhost:8001/api/post-favorite/:code`
- **Test Local:** `curl -X POST http://localhost:8001/api/post-favorite/:code`
- **Test Remote** `curl -X POST https://plain-getup-worm.cyclic.app/api/post-favorite/500267`
- **Method:** `POST`
- **Parameters:**
  - `code`: Stock code
- **Description:** Adds a stock to favorites.
- **Example Codes** - 500038 , 500267 , 500268 

### Get Favorite Stocks

- **URL:** `/favorites`
- **Example:** `https://plain-getup-worm.cyclic.app/api/favorites`
- **Method:** `GET`
- **Description:** Retrieves a list of favorite stocks.

### Delete Favorite Stock

- **URL:** `http://localhost:8001/api/delete-favorite/:code`
- **Method:** `DELETE`
- **Test Local:** `curl -X DELETE http://localhost:8001/api/delete-favorite/:code`
- **Example** `curl -X DELETE https://plain-getup-worm.cyclic.app/api/delete-favorite/500267`
- **Parameters:**
  - `code`: Stock code
- **Description:** Removes a stock from favorites.
 - **Example Codes** - 500038 , 500267 , 500268 

# Bonus 
## Caching and Input Validation 

### Cache Control
Caching is implemented to reduce redundant requests and improve response time. The cache duration is set based on the time until the end of the day.

#### How to Use

**Method:** `cacheMiddleware(ttl)` *ttl: Time to live for cache in seconds*.

**Example Usage:**

```javascript
router.get('/', cacheMiddleware(getTimeUntilEndOfDayInSeconds()), removeDataBefore50thDay, fetchStockInfo);
```
### Input Validation Middleware

#### **Validate Date Format** - Ensures that the provided date follows the format YY-MM-DD.


**How to Use**

**Method**: `validateDateFormat`

Example Usage:
```javascript!
router.get('/stock-by-date/:date', cacheMiddleware(60 * 60 * 24 * 5), validateDateFormat, getStockByDate);
```

#### Validate Stock Code- Validates if the provided stock code is in the correct format.

How to Use

**Method**: `validateStockCode`

Example Usage:

```javascript!
router.get('/stock-history/:code', validateStockCode, cacheMiddleware(60 * 60 * 24 * 5), getStockHistory);
```

#### Check Stock Presence- Checks if the provided stock is present before performing certain operations.

How to Use

**Method**: `checkStockIfPresent`

Example Usage:

```javascript!
router.post('/post-favorite/:code', validateStockCode, checkStockIfPresent, postFavorite);
```

## Data Refresh Mechanism 

**Endpoint URL:** /
    **Method:** `GET`
    **Description:** Initiates the data refresh process.

Example Usage:

```javascript!
router.get('/', cacheMiddleware(getTimeUntilEndOfDayInSeconds()), removeDataBefore50thDay, fetchStockInfo);
```
**Sequence:**

1. The `GET` request to / triggers the middleware, checking for cached data.
1. If cached data is present, it is sent as a response.
1. If not cached, the `removeDataBefore50thDay` function removes outdated data.
1. The `fetchStockInfo` function fetches and inserts new stock data into the database.
1. **The updated data is now available for subsequent requests.**
