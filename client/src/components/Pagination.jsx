import { withRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage, getProducts } from "@/app/features/product-slice.js";

function Pagination({ router }) {
  const dispatch = useDispatch();
  const pageNumbers = useSelector((state) => state.product.pageNumbers);
  const activeCategory = useSelector((state) => state.product.activeCategory);
  const products = useSelector((state) => state.product.products.data);
  const paging = useSelector((state) => state.product.products.paging);

  const onPageChange = async (newPage) => {
    if (activeCategory.name) {
      const queryParams = {
        page: newPage,
        category_id: activeCategory.category_id,
      };
      dispatch(getProducts(queryParams));
      setActivePage(paging.page);
      router.push({ query: { page: newPage } }, undefined, { shallow: true });
    } else {
      const queryParams = {
        page: newPage,
      };
      dispatch(getProducts(queryParams));
      setActivePage(paging.page);
      router.push({ query: { page: newPage } }, undefined, { shallow: true });
    }
  };

  if (products.length > 0 && pageNumbers.length > 1) {
    return (
      <ul className="pagination">
        <li className="page-item">
          <button className={`page-link ${paging.page == 1 ? "disabled" : ""}`} disabled={paging.page == 1} onClick={() => onPageChange(paging.page - 1)}>
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${number === paging.page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button className={`page-link ${paging.page == paging.total_page ? "disabled" : ""}`} disabled={paging.page == paging.total_page} onClick={() => onPageChange(paging.page + 1)}>
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
