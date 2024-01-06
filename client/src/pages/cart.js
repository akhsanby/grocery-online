import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import { withRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { DOLLAR } from "@/utils/currency.js";
import { getCurrentUser } from "@/app/features/user-slice.js";
import { useState, useEffect } from "react";
import { createTransaction, createHistory } from "@/utils/api.js";
import getPaymentType from "@/utils/payment.js";

// components
import Layout from "@/components/Layout";
import CartTable from "@/components/CartTable";

function Cart({ router, decodeToken }) {
  const coupons = [
    {
      code: "new2024",
      discount: 0.1, // 10%
    },
    {
      code: "newuser",
      discount: 0.2, //20%
    },
  ];
  const dispatch = useDispatch();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(undefined);
  const [totalPrice, setTotalPrice] = useState(undefined);
  const [paymentType, setPaymentType] = useState(undefined);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const carts = useSelector((state) => state.cart.carts.data);

  const { first_name: currentUserFirstName, last_name: currentUserLastName, email: currentUserEmail, address: currentUserAddress, phone_number: currentUserPhoneNumber } = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  useEffect(() => {
    handlePrice();
  }, [carts]);

  function handlePrice() {
    const priceBeforeDiscount = carts.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.product.price * currentItem.quantity;
    }, 0);

    const isCouponMatch = coupons.find((coupon) => coupon.code === promoCode);
    if (isCouponMatch) {
      const discountToString = `${(isCouponMatch.discount * 100).toFixed(0)}%`;
      setDiscount(discountToString);

      const priceAfterDiscount = priceBeforeDiscount - priceBeforeDiscount * isCouponMatch.discount;
      setTotalPrice(priceAfterDiscount);

      return priceAfterDiscount;
    } else {
      setDiscount(undefined);
      setTotalPrice(priceBeforeDiscount);

      return priceBeforeDiscount;
    }
  }

  async function handleCheckout() {
    if (!currentUserAddress || !currentUserPhoneNumber) {
      alert("Please update your address or phone number to continue checkout!");
      return false;
    } else if (carts.length === 0) {
      alert("You have not made any product to buy.");
      return false;
    } else if (!paymentType) {
      alert("You have not set payment type");
      return false;
    }

    setLoadingCheckout(true);

    const price = handlePrice();

    const cartItems = carts.map((cart) => {
      return {
        id: cart.product.product_id,
        name: cart.product.name,
        price: cart.product.price,
        quantity: cart.quantity,
        thumbnail: cart.product.thumbnail,
      };
    });

    const resultTransaction = await createTransaction({
      user_id: decodeToken.userId,
      transaction_type: paymentType,
      total_price: price,
      product_details: cartItems,
    });

    if (resultTransaction.data.status === "OK") {
      const resultHistory = await createHistory({
        user_id: decodeToken.userId,
        transaction_id: resultTransaction.data.data.transaction_id,
        transaction_detail: resultTransaction.data.data,
        product_details: cartItems,
      });
      if (resultHistory.data.status === "OK") {
        setLoadingCheckout(false);
        const { transaction_id, transaction_status } = resultTransaction.data.data;
        router.replace(`/profile/billing/${transaction_id}?status=${transaction_status}`);
      } else {
        setLoadingCheckout(false);
        console.log(resultHistory);
      }
    }
  }

  return (
    <Layout decodeToken={decodeToken}>
      <div className="container pt-4 pb-5">
        <div className="row g-3">
          <div className="card col-lg-8 col-md-6 px-0" style={{ height: "100%" }}>
            <div className="card-body p-0">
              <CartTable decodeToken={decodeToken} />
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Full Name</div>
                  {currentUserFirstName} {currentUserLastName}
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Email</div>
                  {currentUserEmail}
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Address</div>
                  {currentUserAddress}
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Phone</div>
                  {currentUserPhoneNumber}
                </div>
              </li>
            </ul>
            <ul className="list-group mb-3">
              {carts &&
                carts.map((cart, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 className="my-0">{cart.product.name}</h6>
                      <small className="text-body-secondary">{cart.product.description}</small>
                    </div>
                    <span className="text-body-secondary">
                      {cart.quantity} x {DOLLAR(cart.product.price).format()}
                    </span>
                  </li>
                ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total</span>
                <strong>{DOLLAR(totalPrice).format()}</strong>
              </li>
            </ul>
            <div className="card p-2 mb-3">
              <label className="form-label mb-1">Payment Type</label>
              <select className="form-select" defaultValue="default" onChange={(e) => setPaymentType(getPaymentType(e.target.value))}>
                <option disabled value="default">
                  Choose Payment
                </option>
                <option value="qris">QRIS</option>
                <option value="bca_va">BCA VA</option>
                <option value="bri_va">BRI VA</option>
                <option value="bni_va">BNI VA</option>
                <option value="cimb_va">CIMB VA</option>
                <option value="permata_va">Permata VA</option>
                <option value="indomaret">Indomaret</option>
                <option value="alfamart">Alfamart</option>
              </select>
            </div>
            <div className="mt-2">
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={() => router.replace("/home")}>
                  Back to Shopping
                </button>
                <button disabled={carts.length === 0} className="btn btn-primary" onClick={handleCheckout}>
                  {loadingCheckout ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : <span>Checkout</span>}
                </button>
              </div>
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

  return { props: { decodeToken } };
}
