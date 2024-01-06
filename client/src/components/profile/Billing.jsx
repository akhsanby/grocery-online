import { DOLLAR } from "@/utils/currency.js";
import Link from "next/link";

export default function Billing({ histories }) {
  function StatusBadgeComponent({ transaction_status }) {
    if (transaction_status === "settlement") return <span className="badge text-bg-success">Success</span>;
    if (transaction_status === "pending") return <span className="badge text-bg-warning">Pending</span>;
    if (transaction_status === "expire") return <span className="badge text-bg-danger">Expired</span>;
  }

  function TransactionIdComponent({ transactionDetail }) {
    const { transaction_id, transaction_status } = transactionDetail;
    if (transaction_status === "settlement" || transaction_status === "expire") {
      return <span>{transaction_id}</span>;
    }
    return <Link href={`/profile/billing/${transaction_id}?status=${transaction_status}`}>{transaction_id}</Link>;
  }

  if (histories.length === 0) {
    return (
      <div className="form-group">
        <label className="d-block mb-1">Payment History</label>
        <div className="border border-gray-500 bg-gray-200 text-center font-size-sm p-3">You have not made any payment.</div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label className="d-block mb-1">Payment History</label>
      <div className="border border-gray-500 bg-gray-200 text-center font-size-sm">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Transaction ID</th>
              <th scope="col">Payment Type</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((history, index) => {
              const transactionDetail = JSON.parse(history.transaction_detail);
              return (
                <tr key={index}>
                  <td>
                    <TransactionIdComponent transactionDetail={transactionDetail} />
                  </td>
                  <td>{transactionDetail.payment_type}</td>
                  <td>{DOLLAR(transactionDetail.gross_amount).format()}</td>
                  <td>
                    <StatusBadgeComponent transaction_status={transactionDetail.transaction_status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
