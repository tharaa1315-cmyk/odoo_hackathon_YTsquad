/**
 * Applies search / filter / sort / pagination to a Mongoose query
 * based on Express req.query.
 *
 * Supported query params:
 *  - keyword: text search across a `searchFields` list
 *  - sort: e.g. "-createdAt" or "name,-purchaseCost"
 *  - page, limit: pagination
 *  - any other field: treated as an exact-match filter (e.g. status=available)
 */
class ApiFeatures {
  constructor(query, reqQuery, searchFields = []) {
    this.query = query;
    this.reqQuery = reqQuery;
    this.searchFields = searchFields;
    this.pagination = { page: 1, limit: 10, total: 0, pages: 1 };
  }

  search() {
    const { keyword } = this.reqQuery;
    if (keyword && this.searchFields.length) {
      const regex = new RegExp(keyword, "i");
      this.query = this.query.find({
        $or: this.searchFields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }

  filter() {
    const excluded = ["keyword", "sort", "page", "limit", "fields"];
    const filters = { ...this.reqQuery };
    excluded.forEach((key) => delete filters[key]);

    Object.keys(filters).forEach((key) => {
      if (filters[key] === "" || filters[key] === undefined) delete filters[key];
    });

    this.query = this.query.find(filters);
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  async paginate() {
    const page = parseInt(this.reqQuery.page, 10) || 1;
    const limit = parseInt(this.reqQuery.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await this.query.model.countDocuments(this.query.getQuery());

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit, total, pages: Math.ceil(total / limit) || 1 };
    return this;
  }
}

module.exports = ApiFeatures;
