import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { getTransaction, updateHistory } from "@/utils/api.js";
import { getHistories, getHistory } from "@/app/features/history-slice.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

// components
import Layout from "@/components/Layout";

export default function TransactionId({ decodeToken }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isCheckTrxLoading, setCheckTrxLoading] = useState(false);

  const transactionDetail = useSelector((state) => state.history.history.transaction_detail);
  const carts = useSelector((state) => state.cart.carts.data);

  useEffect(() => {
    dispatch(getHistory(router.query.transaction_id));
  }, []);

  async function checkTransactionStatus() {
    setCheckTrxLoading(true);
    const transactionId = router.query.transaction_id;
    const resultTransaction = await getTransaction(transactionId);
    const { transaction_id, transaction_status } = resultTransaction.data.data;

    if (transaction_status === "expire" || transaction_status === "settlement") {
      const cartItems = carts.map((cart) => {
        return {
          id: cart.product.product_id,
          name: cart.product.name,
          price: cart.product.price,
          quantity: cart.quantity,
          thumbnail: cart.product.thumbnail,
        };
      });

      await updateHistory({
        transaction_id,
        transaction_detail: resultTransaction.data.data,
        product_details: cartItems,
      });
      dispatch(getHistories(decodeToken.userId));
      setCheckTrxLoading(false);
      router.replace("/profile/billing");
    } else {
      setCheckTrxLoading(false);
    }
  }

  if (transactionDetail?.payment_type === "bank_transfer") {
    const vaNumber = transactionDetail.va_numbers?.[0].va_number || transactionDetail.permata_va_number;
    const bankName = transactionDetail.va_numbers?.[0].bank || "permata";

    return (
      <Layout decodeToken={decodeToken}>
        <div className="container mt-4">
          <div className="card" style={{ maxWidth: "20rem" }}>
            <div className="row g-0">
              <div className="card-body">
                <h5 className="card-title">Virtual Account: {vaNumber}</h5>
                <p className="card-text text-uppercase">{bankName}</p>
                <p className="card-text">
                  <span className="d-block">{transactionDetail.status_message}</span>
                  <small className="text-body-secondary">Expired time {moment(transactionDetail.expiry_time).format("D MMMM YYYY, h:mm:ss")}</small>
                </p>
                <button className="btn btn-success" onClick={checkTransactionStatus}>
                  {isCheckTrxLoading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : <span>Check Transaction</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (transactionDetail?.payment_type === "qris") {
    const qrisImage = transactionDetail.actions[0].url;

    return (
      <Layout decodeToken={decodeToken}>
        <div className="container mt-4">
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="row g-0">
              <img src={qrisImage} alt={transactionDetail.actions[0].name} className="card-img-top" />
              <div className="card-body pt-0">
                <p className="card-text">
                  <span className="d-block">{transactionDetail.status_message}</span>
                  <small className="text-body-secondary">Expired time {moment(transactionDetail.expiry_time).format("D MMMM YYYY, h:mm:ss")}</small>
                </p>
                <button className="btn btn-success" onClick={checkTransactionStatus}>
                  {isCheckTrxLoading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : <span>Check Transaction</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (transactionDetail?.payment_type === "cstore") {
    return (
      <Layout decodeToken={decodeToken}>
        <div className="container mt-4">
          <div className="card" style={{ maxWidth: "20rem" }}>
            <div className="row g-0">
              <div className="card-body">
                <h5 className="card-title">Payment Code: {transactionDetail.payment_code}</h5>
                <p className="card-text text-capitalize">{transactionDetail.store}</p>
                <p className="card-text">
                  <span className="d-block">{transactionDetail.status_message}</span>
                  <small className="text-body-secondary">Expired time {moment(transactionDetail.expiry_time).format("D MMMM YYYY, h:mm:ss")}</small>
                </p>
                <button className="btn btn-success" onClick={checkTransactionStatus}>
                  {isCheckTrxLoading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : <span>Check Transaction</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

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
