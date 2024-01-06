import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import { getCurrentUser } from "@/app/features/user-slice";
import { getHistories } from "@/app/features/history-slice";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { store } from "@/app/store";

// components
import Layout from "@/components/Layout";
import Billing from "@/components/profile/Billing.jsx";

function ProfileBilling({ decodeToken }) {
  const histories = useSelector((state) => state.history.histories);

  useEffect(() => {
    store.dispatch(getCurrentUser());
    store.dispatch(getHistories(decodeToken.userId));
  }, []);

  return (
    <Layout decodeToken={decodeToken}>
      <div className="container my-4">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <Link href="/profile" className="nav-link text-black">
                      Profile Information
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/profile/account" className="nav-link text-black">
                      Account Settings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/profile/billing" className="nav-link text-primary active">
                      Billing
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <Billing histories={histories} decodeToken={decodeToken} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfileBilling;

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
