import nookies from "nookies";
import { getProducts, getProductsByCategory } from "@/utils/api.js";
import { withRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage, setCurrentProducts } from "@/app/features/product-slice.js";

function Pagination({ router }) {
  const cookies = nookies.get();
  const pageNumbers = useSelector((state) => state.product.pageNumbers);
  const activeCategory = useSelector((state) => state.product.activeCategory);
  const currentProducts = useSelector((state) => state.product.currentProducts.data);
  const currentPaging = useSelector((state) => state.product.currentProducts.paging);

  const onPageChange = async (newPage) => {
    if (activeCategory.name) {
      const { paging } = await getProducts(cookies.token, newPage, activeCategory.category_id);
      setActivePage(paging.page);
      router.replace({
        query: { page: paging.page },
      });
    } else {
      const { paging } = await getProducts(cookies.token, newPage);
      setActivePage(paging.page);
      router.replace({
        query: { page: paging.page },
      });
    }
  };

  if (currentProducts.length > 0 && pageNumbers.length > 1) {
    return (
      <ul className="pagination">
        <li className="page-item">
          <button className={`page-link ${currentPaging.page == 1 ? "disabled" : ""}`} disabled={currentPaging.page == 1} onClick={() => onPageChange(currentPaging.page - 1)}>
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
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
