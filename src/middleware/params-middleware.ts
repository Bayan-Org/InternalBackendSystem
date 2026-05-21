import type { NextFunction, Request, Response } from "express";
import {
  isEmptyAmount,
  isEmptyDate,
  parseAmount,
  unformatDate,
} from "../utils/index-util.js";

export const FilterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { Service, sortDirection, sortField } = req.query;
  console.log("====================================");
  console.log(req.query);
  console.log("====================================");

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
