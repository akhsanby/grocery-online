import productService from "../services/product-service.js";

async function create(req, res, next) {
  try {
    const result = await productService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
}

async function search(req, res, next) {
  try {
    const request = {
      page: req.query.page,
      size: req.query.size,
      name: req.query.name,
      category_id: req.query.category_id,
    };

    const result = await productService.search(request);

    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const productId = req.params.productId;
    const request = req.body;
    request.product_id = productId;

    const result = await productService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
}

const remove = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    await productService.remove(productId);

    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const result = await productService.get(productId);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  search,
  update,
  remove,
  get,
};
