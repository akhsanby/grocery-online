import { store } from "@/app/store";
import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import { getProducts, getCategories, getProductsByCategory, getCart } from "@/utils/api.js";
import { useEffect } from "react";
import { withRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword, setActiveCategory, toggleCreateModal } from "@/app/features/product-slice.js";

// components
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import CreateProductModal from "@/components/modals/CreateProduct";
import DetailProductModal from "@/components/modals/DetailProduct";
import ProductBox from "@/components/ProductBox";

function Home({ router, decodeToken, currentCategories, currentCarts }) {
  const dispatch = useDispatch();
  const searchKeyword = useSelector((state) => state.product.searchKeyword);
  const activePage = useSelector((state) => state.product.activePage);
  const activeCategory = useSelector((state) => state.product.activeCategory);

  useEffect(() => {
    (async () => {
      const cookies = nookies.get();
      if (activeCategory && searchKeyword) {
        const fetchData = setTimeout(async () => {
          const cookies = nookies.get();
          const { category_id } = currentCategories.find((category) => category.name == activeCategory);
          await getProductsByCategory(cookies.token, category_id, undefined, undefined, searchKeyword);

          router.replace({
            query: { page: 1, q: searchKeyword },
          });
        }, 500);
        return () => clearTimeout(fetchData);
      } else if (activeCategory) {
        setSearchKeyword("");
        const { category_id } = currentCategories.find((category) => category.name == activeCategory);
        await getProductsByCategory(cookies.token, category_id, activePage);

        router.replace({
          query: { page: 1 },
        });
      } else if (searchKeyword) {
        const fetchData = setTimeout(async () => {
          await getProducts(cookies.token, undefined, undefined, searchKeyword);
          router.replace({
            query: { page: 1, q: searchKeyword },
          });
        }, 500);
        return () => clearTimeout(fetchData);
      } else {
        setSearchKeyword("");
        await getProducts(cookies.token);
        router.replace({
          query: { page: 1 },
        });
      }
    })();
  }, [activeCategory, searchKeyword]);

  return (
    <Layout decodeToken={decodeToken}>
      <div className="container my-4">
        <h2 className="text-center mb-4">{activeCategory ?? "All Products"}</h2>
        <div className="row">
          <div className="col-3">
            <div className="card">
              <div className="card-header fw-bold">Category</div>
              <ul className="list-group list-group-flush">
                <li className={`list-group-item pointer ${!activeCategory ? "active" : ""}`} onClick={() => dispatch(setActiveCategory(undefined))}>
                  All Products
                </li>
                {currentCategories.length > 0 &&
                  currentCategories.map((category, index) => (
                    <li className={`list-group-item pointer ${activeCategory === category.name ? "active" : ""}`} key={index} onClick={() => dispatch(setActiveCategory(category.name))}>
                      {category.name}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="col-9">
            <div className="row">
              <div className="col-6">
                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Search..." value={searchKeyword} onChange={(e) => dispatch(setSearchKeyword(e.target.value))} />
                </div>
              </div>
              <div className="col-6">
                {decodeToken.userLevel === "admin" && (
                  <div className="mb-3 float-end">
                    <button type="button" className="btn btn-primary" onClick={() => dispatch(toggleCreateModal())}>
                      Create Product
                    </button>
                    <CreateProductModal />
                  </div>
                )}
              </div>
            </div>
            <div className="row g-2">
              <ProductBox decodeToken={decodeToken} currentCategories={currentCategories} currentCarts={currentCarts.data} />
              <DetailProductModal />
            </div>
            <div className="row mt-3">
              <div className="col-4 offset-4 d-flex justify-content-center">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withRouter(Home);

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const decodeToken = jwtDecode(cookies.token);

  if ((await isAuthorized(cookies.token)) === false) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await getCategories(cookies.token);
  const currentCategories = store.getState().product.currentCategories.data;

  await getCart(cookies.token, decodeToken.userId);
  const currentCarts = store.getState().cart.currentCarts;

  return { props: { decodeToken, currentCategories, currentCarts } };
}
