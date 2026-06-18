import {
  getSummaryReportService,
  getLowStockReportService,
  getExpiredProductsReportService,
} from "../services/report.service.js";

export async function getSummaryReport(req, res, next) {
  try {
    const summary = await getSummaryReportService();

    return res.status(200).json({
      message: "Summary report received successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLowStockReport(req, res, next) {
  try {
    const lowStock = await getLowStockReportService();

    return res.status(200).json({
      message: "Low stock report received successfully",
      count: lowStock.length,
      data: lowStock,
    });
  } catch (error) {
    next(error);
  }
}

export async function getExpiredProductsReport(req, res, next) {
  try {
    const expiredProducts = await getExpiredProductsReportService();

    return res.status(200).json({
      message: "Expired products report received successfully",
      count: expiredProducts.length,
      data: expiredProducts,
    });
  } catch (error) {
    next(error);
  }
}
