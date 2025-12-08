class QueryBuilder {
  constructor() {
    this.whereConditions = [];
    this.params = [];
    this.paramCounter = 1;
  }

  addSearchCondition(searchTerm) {
    if (searchTerm && searchTerm.trim()) {
      const searchParam = `%${searchTerm.toLowerCase()}%`;
      this.whereConditions.push(
        `(LOWER(customer_name) LIKE $${this.paramCounter} OR LOWER(phone_number) LIKE $${this.paramCounter})`
      );
      this.params.push(searchParam);
      this.paramCounter++;
    }
  }

  addMultiSelectFilter(field, values) {
    if (values && Array.isArray(values) && values.length > 0) {
      this.whereConditions.push(`${field} = ANY($${this.paramCounter})`);
      this.params.push(values);
      this.paramCounter++;
    }
  }

  addTagsFilter(tags) {
    if (tags && Array.isArray(tags) && tags.length > 0) {
      this.whereConditions.push(`tags && $${this.paramCounter}`);
      this.params.push(tags);
      this.paramCounter++;
    }
  }

  addRangeFilter(field, min, max) {
    if (min !== undefined && min !== null && min !== "") {
      this.whereConditions.push(`${field} >= $${this.paramCounter}`);
      this.params.push(parseInt(min));
      this.paramCounter++;
    }
    if (max !== undefined && max !== null && max !== "") {
      this.whereConditions.push(`${field} <= $${this.paramCounter}`);
      this.params.push(parseInt(max));
      this.paramCounter++;
    }
  }

  addDateRangeFilter(startDate, endDate) {
    if (startDate) {
      this.whereConditions.push(`date >= $${this.paramCounter}`);
      this.params.push(startDate);
      this.paramCounter++;
    }
    if (endDate) {
      this.whereConditions.push(`date <= $${this.paramCounter}`);
      this.params.push(endDate);
      this.paramCounter++;
    }
  }

  buildWhereClause() {
    return this.whereConditions.length > 0
      ? `WHERE ${this.whereConditions.join(" AND ")}`
      : "";
  }

  getParams() {
    return this.params;
  }

  getParamCounter() {
    return this.paramCounter;
  }
}

module.exports = QueryBuilder;
