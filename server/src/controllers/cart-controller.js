import cartService from "../services/cart-service.js";

async function create(req, res) {
  const result = await cartService.create(req.body);

  res.status(200).json({
    data: result,
  });
}

async function get(req, res) {
  const userId = req.params.userId;

  const result = await cartService.get(userId);

  res.status(200).json({
    data: result.data,
    count: result.count,
  });
}

async function update(req, res) {
  const request = {
    cart_id: req.params.cartId,
    quantity: req.body.quantity,
  };

  const result = await cartService.update(request);

  res.status(200).json({
    data: result,
  });
}

async function remove(req, res) {
  const cartId = req.params.cartId;
  await cartService.remove(cartId);

  res.status(200).json({
    data: "OK",
  });
}

export default {
  create,
  get,
  update,
  remove,
};
