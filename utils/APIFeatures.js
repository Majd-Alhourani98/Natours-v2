/**
 * The APIFeatures class is a utility designed to enhance the flexibility and functionality
 * of MongoDB queries using Mongoose. This class allows for dynamic querying based on
 * request parameters, making it easier to build complex API endpoints with features such
 * as filtering, sorting, field selection, and pagination.
 *
 * This class is initialized with a Mongoose model and the query parameters from the request.
 * It provides methods to apply various query modifications in a chainable manner. The
 * modifications include:
 *
 * - **Filtering**: Applies filters to the query based on the provided query parameters.
 *   It excludes fields like `page`, `limit`, `sort`, and `select` from the filtering process.
 *   It also translates query operators such as `gte`, `gt`, `lte`, `lt`, and `ne` to their
 *   MongoDB equivalents (e.g., `$gte`, `$gt`, `$lte`, `$lt`, `$ne`).
 *
 * - **Sorting**: Sorts the query results based on the `sort` parameter from the request.
 *   If the `sort` parameter is absent, it defaults to sorting by `createdAt` in descending
 *   order.
 *
 * - **Field Selection**: Controls which fields are included or excluded in the query results
 *   based on the `select` parameter from the request. By default, it excludes the `__v` field.
 *
 * - **Pagination**: Handles pagination of the query results using the `page` and `limit`
 *   parameters. It calculates the number of documents to skip and limits the number of documents
 *   per page, defaulting to the first page and ten documents per page if not specified.
 *
 * Example Usage:
 *
 * **Usage 1**: Example 1
 * ```javascript
 * const features = new APIFeatures(Tour, req.query)
 *   .filter()   // Apply filtering based on query parameters
 *   .select()   // Specify which fields to include or exclude
 *   .sort()     // Sort results based on the 'sort' parameter
 *   .paginate(); // Handle pagination using 'page' and 'limit' parameters
 *
 * const results = await features.query;
 * ```
 *
 * **Usage 2**: Example 2 (Destructuring)
 * ```javascript
 * const { query } = Tour.find({ status: 'active' });
 * const features = new APIFeatures(customQuery, req.query)
 *   .filter()   // Apply filtering based on query parameters
 *   .select()   // Specify which fields to include or exclude
 *   .sort()     // Sort results based on the 'sort' parameter
 *   .paginate(); // Handle pagination using 'page' and 'limit' parameters
 *
 * const results = await query;
 * ```
 *
 * Detailed Explanation of Method Functionality with Examples:
 *
 * Suppose `requestQuery` is:
 * ```json
 * {
 *   "name": "Tour",
 *   "price[gte]": "500",
 *   "page": "2",
 *   "limit": "10",
 *   "sort": "price,-rating",
 *   "select": "name,price"
 * }
 * ```
 *
 * 1. **Filtering** (`.filter()`):
 *    - **Process**:
 *      - Exclude fields that should not be used for filtering, namely `page`, `limit`, `sort`, and `select`.
 *      - Convert the remaining fields into a format suitable for MongoDB querying.
 *    - **Initial Query**: `{ "name": "Tour", "price[gte]": "500" }`
 *    - **After Exclusion**: `{ "name": "Tour", "price[gte]": "500" }` (no change since `page`, `limit`, `sort`, `select` are excluded)
 *    - **Conversion**:
 *      - Convert `"price[gte]": "500"` to `"$gte": 500`.
 *      - Final Filter Object: `{ "price": { "$gte": 500 } }`
 *    - **Effect**: The query will be filtered to include only documents where `price` is greater than or equal to 500.
 *
 * 2. **Field Selection** (`.select()`):
 *    - **Process**:
 *      - Include only the fields specified in the `select` parameter.
 *      - Exclude the `__v` field by default.
 *    - **Initial Query**: Includes all fields by default.
 *    - **After Selection**: Includes only the `name` and `price` fields in the result.
 *    - **Effect**: Only the `name` and `price` fields will be returned in the query results, omitting other fields and `__v`.
 *
 * 3. **Sorting** (`.sort()`):
 *    - **Process**:
 *      - Sort the query results based on the `sort` parameter.
 *    - **Initial Query**:
 *      - Sorting by `price,-rating` (ascending by `price`, descending by `rating`).
 *    - **Effect**: The results will be sorted accordingly. If `sort` is not provided, defaults to sorting by `createdAt` in descending order.
 *
 * 4. **Pagination** (`.paginate()`):
 *    - **Process**:
 *      - Calculate the number of documents to skip and the limit of documents per page based on `page` and `limit`.
 *    - **Initial Query**:
 *      - `page = 2` and `limit = 10`.
 *    - **Pagination Calculation**:
 *      - Skip: `(2 - 1) * 10 = 10` documents.
 *      - Limit: 10 documents per page.
 *    - **Effect**: The query will skip the first 10 documents and limit the results to 10 documents for the second page.
 *
 * This class aims to simplify and streamline query operations, making it easier to handle
 * complex querying scenarios in MongoDB applications.
 */

class APIFeatures {
  constructor(model, requestQuery) {
    this.query = model.find(); // Start with a query that finds all documents in the model
    this.requestQuery = requestQuery; // Store the query string from the request
  }

  // Filtering
  filter() {
    // Create a copy of the query string and remove fields we don't want to filter by (like page, limit, sort, select)
    let filterQuery = { ...this.requestQuery };
    const fieldsToExclude = ['page', 'limit', 'sort', 'select'];
    fieldsToExclude.forEach(field => delete filterQuery[field]);

    // Convert the filter query to a JSON string
    // Add '$' prefix to MongoDB operators (gte, gt, lte, lt, ne) for proper querying
    filterQuery = JSON.stringify(filterQuery);
    filterQuery = filterQuery.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      match => `$${match}`
    );

    // Convert the modified JSON string back to an object and apply it to the query
    const filter = JSON.parse(filterQuery);
    this.query = this.query.find(filter);

    return this; // Return 'this' for method chaining
  }

  // Sorting
  sort() {
    // Check if a sort parameter is provided in the query string
    // If yes, sort by the fields specified (e.g., 'price,rating')
    // If no sort parameter is provided, default to sorting by 'createdAt' in descending order
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this; // Return 'this' for method chaining
  }

  // Limiting Fields
  select() {
    // Check if a select parameter is provided in the query string
    // If yes, include only the specified fields (e.g., 'name,price')
    // If no select parameter is provided, exclude the '__v' field by default
    if (this.requestQuery.select) {
      const select = this.requestQuery.select.split(',').join(' ');
      this.query = this.query.select(select);
    } else {
      this.query = this.query.select('-__v');
    }

    return this; // Return 'this' for method chaining
  }

  // Pagination
  paginate() {
    // Get the current page and limit from the query string
    // Default to page 1 and 10 documents per page if not provided
    // Calculate the number of documents to skip and set the limit for pagination
    const currentPage = Number(this.requestQuery.page) || 1;
    const pageSize = Number(this.requestQuery.limit) || 100;
    const skipCount = (currentPage - 1) * pageSize;
    this.query = this.query.skip(skipCount).limit(pageSize);

    return this; // Return 'this' for method chaining
  }
}

module.exports = APIFeatures;
