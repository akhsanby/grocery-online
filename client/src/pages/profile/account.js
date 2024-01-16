import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@/app/features/user-slice";
import Link from "next/link";

// components
import Layout from "@/components/Layout";
import AccountSettings from "@/components/profile/AccountSettings.jsx";

function Profile({ decodeToken }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
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
                    <Link href="/profile/account" className="nav-link text-primary active">
                      Account Settings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/profile/billing" className="nav-link text-black">
                      Billing
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <AccountSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;

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
