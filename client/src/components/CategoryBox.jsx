import { useSelector, useDispatch } from "react-redux";
import { getCategories, setActiveCategory } from "@/app/features/category-slice.js";
import { getProducts } from "@/app/features/product-slice.js";
import { useEffect } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export default function CategoryBox() {
  const dispatch = useDispatch();
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

  return (
    <SimpleBar style={{ whiteSpace: "nowrap", height: "3rem" }}>
      <div className="d-flex gap-2">
        {categories.map((category, index) => (
          <button key={index} type="button" className={`btn btn-outline-primary ${category.name === activeCategory.name ? "active" : ""}`} onClick={() => updateProductByCategory(category)}>
            {category.name}
          </button>
        ))}
      </div>
    </SimpleBar>
  );
}
