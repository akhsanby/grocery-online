import { useSelector, useDispatch } from "react-redux";
import { getCategories, setActiveCategory } from "@/app/features/category-slice.js";
import { getProducts } from "@/app/features/product-slice.js";
import { useEffect } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

export default function CategoryBox() {
  const dispatch = useDispatch();
  const screenSize = useWindowSize();
  const categories = useSelector((state) => state.category.categories.data);
  const activeCategory = useSelector((state) => state.category.activeCategory);

  async function updateProductByCategory(category) {
    dispatch(setActiveCategory(category));
    const { category_id, name } = category;
    const queryParams = {
      page: 1,
      category_id,
    };
    dispatch(getProducts(queryParams));
  }

  useEffect(() => {
    dispatch(getCategories());
    dispatch(setActiveCategory({ category_id: 0, name: "All Products" }));
  }, []);

  if (!categories)
    return (
      <div className="col-3">
        <div className="card">
          <div className="card-header fw-bold">Category</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item pointer">Loading...</li>
          </ul>
        </div>
      </div>
    );
  return (
    <div className={`${screenSize.width >= 768 ? "col-3" : "col-4"}`}>
      <div className="card">
        <div className="card-header fw-bold">Category</div>
        <ul className="list-group list-group-flush">
          {categories.map((category, index) => (
            <li className={`list-group-item pointer ${category.name === activeCategory.name ? "active" : ""}`} key={index} onClick={() => updateProductByCategory(category)}>
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
