import axiosClient from "@/utils/axios-client";
import Link from "next/link";
import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { useRouter } from "next/router";
import { setCredential } from "@/app/features/user-slice";
import { useSelector, useDispatch } from "react-redux";

// components
import LayoutAuth from "@/components/LayoutAuth.jsx";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const credential = useSelector((state) => state.user.credential);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resultUser = await axiosClient.post("/api/users/login", credential);
      const { token } = resultUser.data.data;
      nookies.set(null, "token", token);
      router.replace("/home?page=1&q=");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LayoutAuth>
      <div className="card" style={{ width: "20rem" }}>
        <h5 className="card-header">Login</h5>
        <div className="card-body">
          <form className="row g-3" onSubmit={(e) => handleLogin(e)}>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={credential.email} onChange={(e) => dispatch(setCredential({ ...credential, email: e.target.value }))} />
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={credential.password} onChange={(e) => dispatch(setCredential({ ...credential, password: e.target.value }))} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <div className="col-12">
              <p>
                Not have an account?{" "}
                <Link href="/register" className="text-underlinelink-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </LayoutAuth>
  );
}

export const getServerSideProps = async (context) => {
  const cookies = nookies.get(context);

  if ((await isAuthorized(cookies.token)) === true) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
