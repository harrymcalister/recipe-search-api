# Recipe Search API

The Recipe Search API is a simple serverless API built on Vercel that allows users to search for recipes using the [Tasty API](https://rapidapi.com/apidojo/api/tasty). The main purpose of creating this API is to improve security by keeping the API key private and to provide a suitable rate limiting mechanism for the intended usage amount. The API is hosted on Vercel's free tier, and it utilizes Upstash and a Redis database for rate limiting the edge function.

## API Endpoint

### Search Recipes

Search for recipes based on the given query string.

* **URL**

  `/recipes`

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `search=[string]`
   
   **Optional:**
   
   `from=[integer]`
   
   `size=[integer]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ results: [ { id: 123, name: "Recipe Name", ... }, ... ] }`

* **Error Response:**

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ error: "An error occurred." }`

  * **Code:** 429 TOO MANY REQUESTS <br />
    **Content:** `{ error: "Too many requests, please try again later." }`

## Usage

To use the Recipe Search API, make a GET request to the `/recipes` endpoint with the required `search` parameter and optional `from` and `size` parameters. For example:

```http
GET https://recipe-search-api.vercel.app/recipes?search=pasta&from=0&size=10