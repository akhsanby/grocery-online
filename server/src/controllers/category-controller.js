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
    const categoryId = req.params.categoryId;
    const result = await categoryService.get(categoryId);

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
