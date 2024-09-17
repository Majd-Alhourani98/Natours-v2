class APIFeatures {
  constructor(model, queryString) {
    // Initialize the APIFeatures instance with a model and a query string.
    // The model is used to build the MongoDB query, and the queryString contains
    // parameters like filters, sorting, and pagination options.
    this.query = model.find();
    this.queryString = queryString;
  }

  filter() {
    // Apply filtering based on the query string.
    // Removes fields that are not related to filtering (e.g., sort, limit, etc.).
    // Converts query string to a filter object, handling MongoDB-specific operators (gte, gt, lte, lt).
    const queryObject = { ...this.queryString };
    const excludedFields = ['sort', 'limit', 'page', 'select'];
    excludedFields.forEach(field => delete queryObject[field]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const filter = JSON.parse(queryStr);

    this.query = this.query.find(filter);

    // Return `this` to allow method chaining.
    return this;
  }

  select() {
    // Specify fields to be included or excluded in the query result.
    // If `select` is provided in the query string, include those fields; otherwise, exclude the `__v` version field.
    if (this.queryString.select) {
      const fields = this.queryString.select.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    // Return `this` to allow method chaining.
    return this;
  }

  sort() {
    // Specify sorting order based on the query string.
    // If `sort` is provided, apply the sorting; otherwise, the sorting is omitted (or can be defaulted).
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Optionally, apply a default sorting (e.g., by creation date, descending).
      // this.query = this.query.sort('-createdAt');
    }

    // Return `this` to allow method chaining.
    return this;
  }

  paginate() {
    // Apply pagination based on `page` and `limit` from the query string.
    // Defaults to page 1 and limit 9 if not provided.
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // Return `this` to allow method chaining.
    return this;
  }
}

module.exports = APIFeatures;
