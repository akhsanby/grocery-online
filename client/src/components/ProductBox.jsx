import { useDispatch, useSelector } from "react-redux";
import { toggleDetailModal, setSelectedProduct, getProducts } from "@/app/features/product-slice.js";
import { getCarts } from "@/app/features/cart-slice.js";
import { createCart } from "@/utils/api.js";
import { useEffect } from "react";
import { DOLLAR } from "@/utils/currency.js";
import Image from "next/image";

export default function ProductBox({ decodeToken }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products.data);
  const categories = useSelector((state) => state.category.categories.data);
  const carts = useSelector((state) => state.cart.carts.data);

  useEffect(() => {
    const queryParams = {};
    dispatch(getProducts(queryParams));
  }, []);

  const handleDetailBtn = (selectedProduct) => {
    dispatch(toggleDetailModal());
    dispatch(setSelectedProduct(selectedProduct));
  };

  const handleAddToCart = async (productId) => {
    console.log(productId);
    try {
      const data = {
        user_id: decodeToken.userId,
        product_id: productId,
        quantity: 1,
      };
      await createCart(data);
      dispatch(getCarts(decodeToken.userId));
    } catch (error) {
      console.error(error);
    }
  };

  const GenerateCategory = ({ categoryId }) => {
    const category = categories.find((category) => categoryId === category.category_id);
    return <span className="badge text-bg-info">{category.name || "Loading..."}</span>;
  };

  const AddToCartBtn = ({ productId }) => {
    const isItemExist = carts.find((cart) => cart.product.product_id === productId);
    if (isItemExist) {
      return (
        <button className="btn btn-secondary">
          <i className="bi bi-cart-check"></i>
        </button>
      );
    }
    return (
      <button className="btn btn-outline-secondary" onClick={() => handleAddToCart(productId)}>
        <i className="bi bi-cart-check"></i>
      </button>
    );
  };

  if (!products)
    return (
      <div>
        <h4>Product not found</h4>
      </div>
    );

  return products.map((product, index) => (
    <div className="col-sm-10 col-md-6 col-lg-4" key={index}>
      <div className="card">
        <div className="position-absolute" style={{ right: "5px", top: "2px" }}>
          <GenerateCategory categoryId={product.category_id} />
        </div>
        <img src={product.thumbnail} className="card-img-top" />
        <div className="card-body">
          <div>
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text text-truncate" style={{ maxWidth: "250px" }}>
              {product.description}
            </p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="my-3">{DOLLAR(product.price).format()}</h5>
            <p className="my-3">Stock {product.stock_quantity}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="btn-group" role="group">
              <button className="btn btn-success">Buy Now</button>
              <AddToCartBtn productId={product.product_id} />
            </div>
            {decodeToken?.userLevel === "admin" && (
              <div className="btn-group" role="group">
                <button className="btn btn-outline-secondary" onClick={() => handleDetailBtn(product)}>
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ));
}
