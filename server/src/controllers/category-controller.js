import categoryService from "../services/category-service.js";

const list = async (req, res, next) => {
  try {
    const result = await categoryService.list();

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

async function get(req, res, next) {
  try {
    const category_id = req.query.category_id;
    const request = {
      page: req.query.page,
      size: req.query.size,
      category_id,
    };
    const result = await categoryService.get(request);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  list,
  get,
};
