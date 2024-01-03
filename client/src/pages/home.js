import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import { withRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword, getProducts, toggleCreateModal } from "@/app/features/product-slice.js";
import { useEffect } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

// components
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import CreateProductModal from "@/components/modals/CreateProduct";
import DetailProductModal from "@/components/modals/DetailProduct";
import ProductBox from "@/components/ProductBox";
import CategoryBox from "@/components/CategoryBox";

function Home({ router, decodeToken }) {
  const dispatch = useDispatch();
  const screenSize = useWindowSize();
  const searchKeyword = useSelector((state) => state.product.searchKeyword);
  const activeCategory = useSelector((state) => state.product.activeCategory);

  function handleSearchByKeyword(e) {
    const keyword = e.target.value;
    dispatch(setSearchKeyword(keyword));

    router.push({ query: { page: 1, q: keyword } }, undefined, { shallow: true });

    if (keyword !== "") {
      const queryParams = {
        page: 1,
        name: keyword,
      };
      dispatch(getProducts(queryParams));
    } else {
      const queryParams = {};
      dispatch(getProducts(queryParams));
    }
  }

  useEffect(() => {
    if (router.query.page) {
      const queryParams = {
        page: router.query.page,
      };
      dispatch(getProducts(queryParams));
    }
  }, []);

  return (
    <Layout decodeToken={decodeToken}>
      <div className="container my-4">
        <h2 className="text-center mb-4">{activeCategory.name || "All Products"}</h2>
        <div className="row">
          <CategoryBox />
          <div className={`${screenSize.width >= 768 ? "col-9" : "col-8"}`}>
            <div className="row">
              <div className="col-6">
                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Search..." value={searchKeyword} onChange={(e) => handleSearchByKeyword(e)} />
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
              <ProductBox decodeToken={decodeToken} />
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
  const { token } = nookies.get(context);
  const decodeToken = jwtDecode(token);

  if ((await isAuthorized(token)) === false) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { decodeToken } };
}
