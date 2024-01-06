import historyService from "../services/history-service.js";

async function create(req, res) {
  const request = {
    user_id: req.body.user_id,
    transaction_id: req.body.transaction_id,
    transaction_detail: JSON.stringify(req.body.transaction_detail),
    product_details: req.body.product_details,
  };
  const result = await historyService.create(request);

  res.status(200).json({
    status: "OK",
    data: result,
  });
}

async function list(req, res) {
  const user_id = parseInt(req.params.userId);
  const result = await historyService.list(user_id);

  res.status(200).json({
    status: "OK",
    data: result,
  });
}

async function get(req, res) {
  const transaction_id = req.params.transactionId;
  const result = await historyService.get(transaction_id);

  res.status(200).json({
    status: "OK",
    data: result,
  });
}

async function update(req, res) {
  const request = {
    transaction_id: req.body.transaction_id,
    transaction_detail: JSON.stringify(req.body.transaction_detail),
  };
  const result = await historyService.update(request);
  res.status(200).json({
    status: "OK",
    data: result,
  });
}

export default {
  create,
  list,
  get,
  update,
};
