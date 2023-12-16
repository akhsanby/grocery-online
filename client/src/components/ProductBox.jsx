import nookies from "nookies";
import { useDispatch, useSelector } from "react-redux";
import { toggleDetailModal, setSelectedProduct } from "@/app/features/product-slice.js";
import { createCart, updateCart, getCart } from "@/utils/api.js";

export default function ProductBox({ decodeToken, currentCategories, currentCarts }) {
  const dispatch = useDispatch();
  const currentProducts = useSelector((state) => state.product.currentProducts.data);

  const handleDetailBtn = (selectedProduct) => {
    dispatch(toggleDetailModal());
    dispatch(setSelectedProduct(selectedProduct));
  };

  const handleAddToCart = async (productId) => {
    try {
      const cookies = nookies.get();
      const cart = currentCarts.find((cart) => cart.product.product_id === productId);
      if (cart) {
        console.log("update");
        const data = {
          quantity: cart.quantity + 1,
        };
        await updateCart(cookies.token, data, cart.cart_id);
        await getCart(cookies.token, decodeToken.userId);
      } else {
        console.log("create");
        const data = {
          user_id: decodeToken.userId,
          product_id: productId,
          quantity: 1,
        };
        await createCart(cookies.token, data);
        await getCart(cookies.token, decodeToken.userId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GenerateCategory = ({ categoryId }) => {
    const category = currentCategories.find((category) => categoryId === category.category_id);
    return <span className="badge text-bg-info">{category.name}</span>;
  };

  if (currentProducts.length > 0) {
    return currentProducts.map((product, index) => (
      <div className="col-sm-10 col-md-6 col-lg-4" key={index}>
        <div className="card">
          <div className="position-absolute" style={{ right: "5px", top: "2px" }}>
            <GenerateCategory categoryId={product.category_id} />
          </div>
          <img src={product.thumbnail} className="card-img-top" />
          <div className="card-body">
            <div>
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="my-3">Rp. {product.price}</h5>
              <p className="my-3">Stock {product.stock_quantity}</p>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="btn-group" role="group">
                <button className="btn btn-success">Buy Now</button>
                <button className="btn btn-outline-secondary" onClick={() => handleAddToCart(product.product_id)}>
                  <i className="bi bi-cart-check"></i>
                </button>
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
  } else {
    return (
      <div>
        <h4>Product not found</h4>
      </div>
    );
  }
}
