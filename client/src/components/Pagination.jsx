import nookies from "nookies";
import { getProducts, getProductsByCategory } from "@/utils/api.js";
import { withRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage, setCurrentProducts } from "@/app/features/product-slice.js";

function Pagination({ router }) {
  const cookies = nookies.get();
  const dispatch = useDispatch();
  const pageNumbers = useSelector((state) => state.product.pageNumbers);
  const activeCategory = useSelector((state) => state.product.activeCategory);
  const currentProducts = useSelector((state) => state.product.currentProducts.data);
  const currentPaging = useSelector((state) => state.product.currentProducts.paging);
  const currentCategories = useSelector((state) => state.product.currentCategories.data);

  const onPageChange = async (newPage) => {
    console.log(newPage);
    if (activeCategory) {
      dispatch(setActivePage(newPage));

      const { category_id } = currentCategories.find((category) => category.name == activeCategory);
      await getProductsByCategory(cookies.token, category_id, newPage);
      router.replace({
        query: { ...router.query, page: newPage },
      });
    } else if (!router.query.page || router.query.page) {
      dispatch(setActivePage(newPage));

      await getProducts(cookies.token, newPage);
      router.replace({
        query: { ...router.query, page: newPage },
      });
    }
  };

  if (currentProducts.length > 0) {
    return (
      <ul className="pagination">
        <li className="page-item">
          <button className={`page-link ${currentPaging.page == 1 ? "disabled" : ""}`} disabled={currentPaging.page == 1} onClick={() => onPageChange(currentPaging.page - 1)}>
            Previous
          </button>
        </li>
        {pageNumbers &&
          pageNumbers.map((number) => (
            <li key={number} className={`page-item ${number === currentPaging.page ? "active" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(number)}>
                {number}
              </button>
            </li>
          ))}
        <li className="page-item">
          <button className={`page-link ${currentPaging.page == currentPaging.total_page ? "disabled" : ""}`} disabled={currentPaging.page == currentPaging.total_page} onClick={() => onPageChange(currentPaging.page + 1)}>
            Next
          </button>
        </li>
      </ul>
    );
  } else {
    return <div></div>;
  }
}

export default withRouter(Pagination);
