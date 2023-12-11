import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import { getProducts, getCategories, getProductsByCategory } from "@/utils/api.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setActiveCategory, toggleCreateModal } from "@/app/features/product-slice.js";

// components
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import CreateProductModal from "@/components/modals/CreateProduct";
import DetailProductModal from "@/components/modals/DetailProduct";
import ProductBox from "@/components/ProductBox";

export default function Home({ decodeToken }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");

  const activePage = useSelector((state) => state.product.activePage);
  const activeCategory = useSelector((state) => state.product.activeCategory);
  const currentCategories = useSelector((state) => state.product.currentCategories.data);

  async function handleSearchByName(e) {
    e.preventDefault();
    try {
      const cookies = nookies.get();
      await getProducts(cookies.token, undefined, undefined, keyword);

      router.replace({
        query: { ...router.query, page: 1, q: keyword },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      const cookies = nookies.get();
      if (activeCategory && keyword) {
        const cookies = nookies.get();
        const { category_id } = currentCategories.find((category) => category.name == activeCategory);
        await getProductsByCategory(cookies.token, category_id, undefined, undefined, keyword);

        router.replace({
          query: { page: 1, q: keyword },
        });
      } else if (activeCategory) {
        setKeyword("");
        const { category_id } = currentCategories.find((category) => category.name == activeCategory);
        await getProductsByCategory(cookies.token, category_id, activePage);

        router.replace({
          query: { page: 1 },
        });
      } else if (keyword) {
        await getProducts(cookies.token, undefined, undefined, keyword);
        router.replace({
          query: { page: 1, q: keyword },
        });
      } else {
        setKeyword("");
        await getProducts(cookies.token);
        router.replace({
          query: { page: 1 },
        });
      }
      await getCategories(cookies.token);
    })();
  }, [activeCategory]);

  return (
    <Layout>
      <Navbar decodeToken={decodeToken} />
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
                <form onSubmit={(e) => handleSearchByName(e)}>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Search..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <button className="input-group-text btn btn-primary">Find</button>
                  </div>
                </form>
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

  return { props: { decodeToken } };
}
