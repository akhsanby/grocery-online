import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import { getCart, updateCart } from "@/utils/api.js";
import { store } from "@/app/store";
import { withRouter } from "next/router";
import { useEffect, useState } from "react";

// components
import Layout from "@/components/Layout";

function Cart({ router, decodeToken, currentCarts }) {
  const [carts, setCarts] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (carts.length === 0) {
      setCarts(currentCarts.data);
    } else {
      setTotalPrice(calculateTotalPrice());

      const fetchData = setTimeout(async () => {
        const cookies = nookies.get();
        for (const item of carts) {
          const data = {
            quantity: item.quantity,
          };
          await updateCart(cookies.token, data, item.cart_id);
        }
        await getCart(cookies.token, decodeToken.userId);
      }, 4000);
      return () => clearTimeout(fetchData);
    }
  }, [carts]);

  const increaseQty = (cartId) => {
    const updateCart = carts.map((cart) => {
      if (cart.cart_id === cartId) {
        return { ...cart, quantity: cart.quantity + 1 };
      }
      return cart;
    });
    setCarts(updateCart);
  };

  const decreaseQty = (cartId) => {
    const updateCart = carts.map((cart) => {
      if (cart.cart_id === cartId) {
        return { ...cart, quantity: cart.quantity - 1 };
      }
      return cart;
    });
    setCarts(updateCart);
  };

  const calculateTotalPrice = () => {
    return carts.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.product.price * currentItem.quantity;
    }, 0);
  };

  return (
    <Layout>
      <div className="container pt-4">
        <div className="card">
          <div className="card-header fw-bold h5">Shopping Cart</div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr className="text-center">
                  <th scope="col">Product Details</th>
                  <th scope="col">Quantity</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {carts &&
                  carts.map((cart, index) => (
                    <tr key={index} className="align-middle text-center">
                      <td>
                        <div className="card text-start" style={{ maxWidth: "540px" }}>
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img src={cart.product.thumbnail} className="img-fluid rounded-start" alt={cart.product.name} />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">{cart.product.name}</h5>
                                <p className="card-text">
                                  <span className="d-block">{cart.product.description}</span>
                                  <span>Rp. {cart.product.price}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="input-group">
                          <button className="input-group-text d-none d-md-block" onClick={() => decreaseQty(cart.cart_id)}>
                            <i className="bi bi-dash-lg"></i>
                          </button>
                          <input type="text" value={cart.quantity} disabled readOnly className="form-control text-center" style={{ width: "10px" }} />
                          <button className="input-group-text d-none d-md-block" onClick={() => increaseQty(cart.cart_id)}>
                            <i className="bi bi-plus-lg"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <i className="bi bi-trash text-danger pointer"></i>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="row g-1 d-flex align-items-center">
              <div className="col-2 ">
                <label className="form-label">Promo code</label>
                <input type="text" className="form-control" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              </div>
              <div className="col-2 offset-6">
                <div className="mx-auto text-center">
                  <span className="d-block fw-bold">Discount</span>
                  <span>{discount}%</span>
                </div>
              </div>
              <div className="col-2">
                <div className="mx-auto text-center">
                  <span className="d-block fw-bold">Total Price</span>
                  <span>Rp. {totalPrice}</span>
                </div>
              </div>
            </div>
            <div className="btn-group float-end">
              <button className="btn btn-secondary" onClick={() => router.replace("/home")}>
                Back to Shopping
              </button>
              <button className="btn btn-primary">Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withRouter(Cart);

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

  await getCart(cookies.token, decodeToken.userId);
  const currentCarts = store.getState().cart.currentCarts;

  return { props: { decodeToken, currentCarts } };
}
