import { useDispatch, useSelector } from "react-redux";
import { setCurrentCarts, getCarts } from "@/app/features/cart-slice.js";
import { useEffect } from "react";
import { updateCart, deleteCart } from "@/utils/api.js";
import { DOLLAR } from "@/utils/currency.js";
import { useState } from "react";

export default function CartTable({ decodeToken }) {
  const dispatch = useDispatch();
  const [runQty, setRunQty] = useState(false); // change when increaseQty or decreaseQty run

  const carts = useSelector((state) => state.cart.carts.data);
  const products = useSelector((state) => state.product.products.data);
  const totalItemInCart = useSelector((state) => state.cart.carts.count);

  useEffect(() => {
    const fetchData = setTimeout(async () => {
      for (const item of carts) {
        const data = {
          quantity: item.quantity,
        };
        await updateCart(data, item.cart_id);
      }
      dispatch(getCarts(decodeToken.userId));
    }, 2000);
    return () => clearTimeout(fetchData);
  }, [runQty]);

  const increaseQty = (cartId) => {
    const updatedItemCart = carts.map((cart) => {
      if (cart.cart_id === cartId) {
        return { ...cart, quantity: cart.quantity + 1 };
      }
      return cart;
    });
    dispatch(setCurrentCarts({ carts: updatedItemCart, count: totalItemInCart }));
    setRunQty(!runQty);
  };

  const decreaseQty = (cartId) => {
    const updatedItemCart = carts.map((cart) => {
      if (cart.cart_id === cartId) {
        return { ...cart, quantity: cart.quantity - 1 };
      }
      return cart;
    });
    dispatch(setCurrentCarts({ carts: updatedItemCart, count: totalItemInCart }));
    setRunQty(!runQty);
  };

  async function handleRemoveCart(cartId) {
    try {
      const isConfirm = confirm(`Are you sure remove this cart?`);
      if (isConfirm) {
        await deleteCart(cartId);
        dispatch(getCarts(decodeToken.userId));
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  if (carts.length === 0) {
    return (
      <table className="table mb-0">
        <thead>
          <tr>
            <th scope="col">Product Detail</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>You have not made any product to buy.</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="table mb-0">
      <thead>
        <tr>
          <th scope="col">Product Details</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {carts.map((cart, index) => {
          const isQuantityMoreThanStock = cart.product.stock_quantity === cart.quantity;
          const isQuantityLowerThanEqualOne = cart.quantity <= 1;

          return (
            <tr key={index} className="align-middle text-center">
              <td>
                <div className="card text-start">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img src={cart.product.thumbnail} className="img-fluid rounded-start" alt={cart.product.name} />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{cart.product.name}</h5>
                        <p className="card-text">
                          <span className="d-block">{cart.product.description}</span>
                          <span className="fw-bold h5">{DOLLAR(cart.product.price).format()}</span>
                        </p>
                        <p>
                          Available Stock <strong>{cart.product.stock_quantity}</strong>
                        </p>
                        <div className="input-group d-flex justify-content-end" style={{ width: "9rem" }}>
                          {isQuantityLowerThanEqualOne ? (
                            <button className="input-group-text" disabled={true}>
                              <i className="bi bi-dash-lg"></i>
                            </button>
                          ) : (
                            <button className="input-group-text" onClick={() => decreaseQty(cart.cart_id)}>
                              <i className="bi bi-dash-lg"></i>
                            </button>
                          )}
                          <input type="text" value={cart.quantity} disabled readOnly className="form-control text-center" style={{ width: "10px" }} />
                          {isQuantityMoreThanStock ? (
                            <button className="input-group-text" disabled={true}>
                              <i className="bi bi-plus-lg"></i>
                            </button>
                          ) : (
                            <button className="input-group-text" onClick={() => increaseQty(cart.cart_id)}>
                              <i className="bi bi-plus-lg"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <i className="bi bi-trash text-danger pointer" onClick={() => handleRemoveCart(cart.cart_id)}></i>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
