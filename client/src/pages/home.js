import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import { withRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword, getProducts, toggleCreateModal } from "@/app/features/product-slice.js";
import { useEffect } from "react";
// components
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import CreateProductModal from "@/components/modals/CreateProduct";
import DetailProductModal from "@/components/modals/DetailProduct";
import ProductBox from "@/components/ProductBox";
import CategoryBox from "@/components/CategoryBox";

function Home({ router, decodeToken }) {
  const dispatch = useDispatch();
  const searchKeyword = useSelector((state) => state.product.searchKeyword);

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
        <div className="row">
          <div className="col-9">
            <div className="input-group mb-3">
              <span className="input-group-text bg-white" style={{ borderRight: "none" }}>
                <i className="bi bi-search"></i>
              </span>
              <input type="text" className="form-control" style={{ borderLeft: "none" }} placeholder="Search..." value={searchKeyword} onChange={(e) => handleSearchByKeyword(e)} />
            </div>
          </div>
          <div className="col-3">
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
        <CategoryBox />
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
