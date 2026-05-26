import type { NextFunction, Request, Response } from "express";
import {
  isEmptyAmount,
  isEmptyDate,
  parseAmount,
  unformatDate,
} from "../utils/index-util.js";
import { createApiInstance } from "../utils/apiFactory-util.js";
import type { PendingApprovalDetailParams } from "../interface/index.js";

export const FilterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { Service, sortDirection, sortField } = req.query;

  if (!Service || Service === "") {
    return res.status(400).json({
      statusCode: 400,
      message: "Please provide a service that you want to check",
    });
  }

  if (!sortDirection || sortDirection === "") {
    return res.status(400).json({
      statusCode: 400,
      message: "Please provide a Sort Direction that you want to sort",
    });
  }

  if (!sortField || sortField === "") {
    return res.status(400).json({
      statusCode: 400,
      message: "Please provide a Sort Field that you want to sort",
    });
  }

  const { isFiltering } = req.query as any;
  if (isFiltering.toLowerCase() === "true") {
    const { amountFrom, amountTo, dateFrom, dateTo, currency } =
      req.query as any;

    const parsedAmountFrom = parseAmount(amountFrom);

    if (isNaN(parsedAmountFrom)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Amount from must be a valid number",
      });
    }

    // -----------------------------
    // amountTo validation
    // optional
    // -----------------------------
    let parsedAmountTo: number | undefined;

    if (!isEmptyAmount(amountTo)) {
      parsedAmountTo = parseAmount(amountTo);

      if (isNaN(parsedAmountTo)) {
        return res.status(400).json({
          statusCode: 400,
          message: "Amount to must be a valid number",
        });
      }
    }

    // -----------------------------
    // dateTo validation
    // optional
    // -----------------------------
    let parsedDateTo: Date | null | undefined;

    if (!isEmptyDate(dateTo)) {
      parsedDateTo = unformatDate(dateTo);

      if (!parsedDateTo) {
        return res.status(400).json({
          statusCode: 400,
          message: "Date to must be a valid date",
        });
      }
    }

    // -----------------------------
    // range validation
    // -----------------------------
    if (!isEmptyAmount(amountFrom) && !isEmptyAmount(amountTo)) {
      if (parsedAmountTo !== undefined && parsedAmountFrom > parsedAmountTo) {
        return res.status(400).json({
          statusCode: 400,
          message: "Amount from cannot be greater than amount to",
        });
      }
    }

    if (!isEmptyDate(dateFrom) && !isEmptyDate(dateTo)) {
      const parsedDateFrom = unformatDate(dateFrom) as any;
      if (parsedDateTo && parsedDateFrom > parsedDateTo) {
        return res.status(400).json({
          statusCode: 400,
          message: "Date from cannot be later than date to",
        });
      }
    }

    if (isEmptyDate(dateFrom) && !isEmptyDate(dateTo)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Date from must be filled",
      });
    }

    if (!isEmptyAmount(amountFrom) || !isEmptyAmount(amountTo)) {
      if (!currency || currency === "*") {
        return res.status(400).json({
          statusCode: 400,
          message: "Currency must be selected",
        });
      }
    }
  }
  next();
};

export const FilterDetailMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      InstanceID,
      ReferenceDoc,
      sortDirection,
      sortField,
      TaskIndicator,
    } = req.query;
    if (!InstanceID) {
      return res.status(404).json({
        statusCode: 404,
        message: `Instance ID is missing`,
      });
    }
    if (!ReferenceDoc) {
      return res.status(404).json({
        statusCode: 404,
        message: `Reference document is missing`,
      });
    }

    // --> Task Indicator
    if (!TaskIndicator) {
      return res.status(404).json({
        statusCode: 404,
        message: `Task indicator is missing`,
      });
    }

    if (!sortField || sortField === "") {
      return res.status(400).json({
        statusCode: 400,
        message: "Please provide a Sort Direction that you want to sort",
      });
    }

    const { isFiltering } = req.query as any;
    if (isFiltering.toLowerCase() === "true" && isFiltering) {
      const {
        amountFrom,
        amountTo,
        currency,
        unitPriceFrom,
        unitPriceTo,
        quantityFrom,
        quantityTo,
        unit,
      } = req.query as any;
      const parsedAmountFrom = parseAmount(amountFrom);

      if (isNaN(parsedAmountFrom)) {
        return res.status(400).json({
          statusCode: 400,
          message: "Amount from must be a valid number",
        });
      }

      // -----------------------------
      // amountTo validation
      // optional
      // -----------------------------
      let parsedAmountTo: number | undefined;
      if (!isEmptyAmount(amountTo)) {
        parsedAmountTo = parseAmount(amountTo);

        if (isNaN(parsedAmountTo)) {
          return res.status(400).json({
            statusCode: 400,
            message: "Amount to must be a valid number",
          });
        }
      }

      // -----------------------------
      // range validation
      // -----------------------------
      if (!isEmptyAmount(amountFrom) && !isEmptyAmount(amountTo)) {
        if (parsedAmountTo !== undefined && parsedAmountFrom > parsedAmountTo) {
          return res.status(400).json({
            statusCode: 400,
            message: "Amount from cannot be greater than amount to",
          });
        }
      }

      if (!isEmptyAmount(amountFrom) || !isEmptyAmount(amountTo)) {
        if (!currency || currency === "*") {
          return res.status(400).json({
            statusCode: 400,
            message: "Currency must be selected",
          });
        }
      }

      // =====================================================
      // unitPrice validation
      // behavior same as amount
      // currency required
      // unit required
      // =====================================================
      const isEmptyUnitPriceFrom = isEmptyAmount(unitPriceFrom);
      const isEmptyUnitPriceTo = isEmptyAmount(unitPriceTo);

      let parsedUnitPriceFrom: number | undefined;
      if (!isEmptyUnitPriceFrom) {
        parsedUnitPriceFrom = parseAmount(unitPriceFrom);

        if (isNaN(parsedUnitPriceFrom)) {
          return res.status(400).json({
            statusCode: 400,
            message: "Unit price from must be a valid number",
          });
        }
      }

      let parsedUnitPriceTo: number | undefined;
      if (!isEmptyUnitPriceTo) {
        parsedUnitPriceTo = parseAmount(unitPriceTo);

        if (isNaN(parsedUnitPriceTo)) {
          return res.status(400).json({
            statusCode: 400,
            message: "Unit price to must be a valid number",
          });
        }
      }

      if (!isEmptyUnitPriceFrom && !isEmptyUnitPriceTo) {
        if (
          parsedUnitPriceTo !== undefined &&
          parsedUnitPriceFrom !== undefined &&
          parsedUnitPriceFrom > parsedUnitPriceTo
        ) {
          return res.status(400).json({
            statusCode: 400,
            message: "Unit price from cannot be greater than unit price to",
          });
        }
      }

      if (!isEmptyUnitPriceFrom || !isEmptyUnitPriceTo) {
        if (!currency || currency === "*") {
          return res.status(400).json({
            statusCode: 400,
            message: "Currency must be selected for unit price filter",
          });
        }

        if (!unit || unit === "*") {
          return res.status(400).json({
            statusCode: 400,
            message: "Unit must be selected for unit price filter",
          });
        }
      }

      // =====================================================
      // quantity validation
      // behavior same as amount
      // unit required
      // =====================================================
      const isEmptyQuantityFrom = isEmptyAmount(quantityFrom);
      const isEmptyQuantityTo = isEmptyAmount(quantityTo);

      let parsedQuantityFrom: number | undefined;
      if (!isEmptyQuantityFrom) {
        parsedQuantityFrom = parseAmount(quantityFrom);

        if (isNaN(parsedQuantityFrom)) {
          return res.status(400).json({
            statusCode: 400,
            message: "Quantity from must be a valid number",
          });
        }
      }

      let parsedQuantityTo: number | undefined;
      if (!isEmptyQuantityTo) {
        parsedQuantityTo = parseAmount(quantityTo);

        if (isNaN(parsedQuantityTo)) {
          return res.status(400).json({
            statusCode: 400,
            message: "Quantity to must be a valid number",
          });
        }
      }

      if (!isEmptyQuantityFrom && !isEmptyQuantityTo) {
        if (
          parsedQuantityTo !== undefined &&
          parsedQuantityFrom !== undefined &&
          parsedQuantityFrom > parsedQuantityTo
        ) {
          return res.status(400).json({
            statusCode: 400,
            message: "Quantity from cannot be greater than quantity to",
          });
        }
      }

      if (!isEmptyQuantityFrom || !isEmptyQuantityTo) {
        if (!unit || unit === "*") {
          return res.status(400).json({
            statusCode: 400,
            message: "Unit must be selected for quantity filter",
          });
        }
      }
    }

    res.locals.TaskIndicator = req.query.TaskIndicator;
    next();
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(400).json({
      statusCode: 400,
      message: "Internal Server Error get Task",
      data: error,
    });
  }
};
