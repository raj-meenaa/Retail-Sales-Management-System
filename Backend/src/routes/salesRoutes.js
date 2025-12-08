const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

router.get("/sales", salesController.getSales);

router.get("/filter-options", salesController.getFilterOptions);

router.get("/statistics", salesController.getStatistics);

module.exports = router;
