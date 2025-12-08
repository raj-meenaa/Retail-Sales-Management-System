const salesService = require("../services/salesService");

class SalesController {
  async getSales(req, res) {
    try {
      const filters = {
        search: req.query.search || "",

        regions: req.query.regions
          ? req.query.regions.split(",").filter(Boolean)
          : [],
        genders: req.query.genders
          ? req.query.genders.split(",").filter(Boolean)
          : [],
        categories: req.query.categories
          ? req.query.categories.split(",").filter(Boolean)
          : [],
        tags: req.query.tags ? req.query.tags.split(",").filter(Boolean) : [],
        paymentMethods: req.query.paymentMethods
          ? req.query.paymentMethods.split(",").filter(Boolean)
          : [],

        ageMin: req.query.ageMin ? parseInt(req.query.ageMin) : null,
        ageMax: req.query.ageMax ? parseInt(req.query.ageMax) : null,
        startDate: req.query.startDate || null,
        endDate: req.query.endDate || null,

        sortBy: req.query.sortBy || "date",
        sortOrder: req.query.sortOrder || "DESC",

        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
      };

      const result = await salesService.getSalesData(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error in getSales:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch sales data",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  async getFilterOptions(req, res) {
    try {
      const options = await salesService.getFilterOptions();

      res.json({
        success: true,
        ...options,
      });
    } catch (error) {
      console.error("Error in getFilterOptions:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch filter options",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  async getStatistics(req, res) {
    try {
      const filters = {
        search: req.query.search || "",
        regions: req.query.regions
          ? req.query.regions.split(",").filter(Boolean)
          : [],
        genders: req.query.genders
          ? req.query.genders.split(",").filter(Boolean)
          : [],
        categories: req.query.categories
          ? req.query.categories.split(",").filter(Boolean)
          : [],
        tags: req.query.tags ? req.query.tags.split(",").filter(Boolean) : [],
        paymentMethods: req.query.paymentMethods
          ? req.query.paymentMethods.split(",").filter(Boolean)
          : [],
        ageMin: req.query.ageMin ? parseInt(req.query.ageMin) : null,
        ageMax: req.query.ageMax ? parseInt(req.query.ageMax) : null,
        startDate: req.query.startDate || null,
        endDate: req.query.endDate || null,
      };

      const stats = await salesService.getStatistics(filters);

      res.json({
        success: true,
        ...stats,
      });
    } catch (error) {
      console.error("Error in getStatistics:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch statistics",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new SalesController();
