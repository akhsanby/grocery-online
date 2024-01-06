import currency from "currency.js";

export const RUPIAH = (value) => currency(value, { symbol: "Rp ", separator: ".", precision: 0 });
export const DOLLAR = (value) => currency(value, { symbol: "$", separator: ".", precision: 0 });
export const removeFormatRUPIAH = (value) => value.replace(/[Rp\s.]/g, "");
export const removeFormatDOLLAR = (value) => value.replace(/[$\s.]/g, "");
