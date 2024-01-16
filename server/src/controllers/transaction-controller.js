import transactionService from "../services/transaction-service.js";

async function create(req, res) {
  const { user_id, transaction_type, total_price, product_details } = req.body;
  const result = await transactionService.create(user_id, transaction_type, total_price, product_details);

  res.status(200).json({
    status: "OK",
    data: result,
  });
}

async function check(req, res) {
  const transactionId = req.params.transactionId;
  const result = await transactionService.check(transactionId);

  res.status(200).json({
    status: "OK",
    data: result,
  });
}

export default {
  create,
  check,
};
