import axiosClient from "@/utils/axios-client";
import Link from "next/link";
import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { useRouter } from "next/router";
import { toggleAlert, setCredential } from "@/app/features/user-slice";
import { useSelector, useDispatch } from "react-redux";
import validate, { loginUserValidation } from "@/utils/validation/validate";
import { useState } from "react";

// components
import LayoutAuth from "@/components/LayoutAuth.jsx";
import CustomAlert from "@/components/CustomAlert.jsx";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const credential = useSelector((state) => state.user.credential);
  const [invalidEmail, setInvalidEmail] = useState(undefined);
  const [invalidPassword, setInvalidPassword] = useState(undefined);

  function checkValidation() {
    const resultInvalidEmail = validate(loginUserValidation.email, credential.email);
    const resultInvalidPassword = validate(loginUserValidation.password, credential.password);

    if (resultInvalidEmail || resultInvalidPassword) {
      setInvalidEmail(resultInvalidEmail);
      setInvalidPassword(resultInvalidPassword);
      return false;
    }

    return true;
  }

  const handleLogin = async () => {
    try {
      const isValid = checkValidation();
      if (isValid) {
        const resultUser = await axiosClient.post("/api/users/login", credential);
        const { token } = resultUser.data.data;
        nookies.set(null, "token", token);
        router.replace("/home");
      }
    } catch (error) {
      const { errors } = error.response.data;
      dispatch(toggleAlert({ isShow: "show", variant: "danger", message: errors }));
      console.error(error);
    }
  };

  return (
    <LayoutAuth>
      <div className="card" style={{ width: "20rem" }}>
        <h5 className="card-header">Login</h5>
        <div className="card-body">
          <CustomAlert />
          <form className="row g-3">
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" className={`form-control ${invalidEmail ? "is-invalid" : ""}`} value={credential.email} onChange={(e) => dispatch(setCredential({ ...credential, email: e.target.value }))} />
              <div className="invalid-feedback">{invalidEmail && invalidEmail[0].message}</div>
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input type="password" className={`form-control ${invalidPassword ? "is-invalid" : ""}`} value={credential.password} onChange={(e) => dispatch(setCredential({ ...credential, password: e.target.value }))} />
              <div className="invalid-feedback">{invalidPassword && invalidPassword[0].message}</div>
            </div>
            <div className="col-12">
              <button type="button" className="btn btn-primary" onClick={handleLogin}>
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
