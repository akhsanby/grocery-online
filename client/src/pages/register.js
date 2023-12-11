import axiosClient from "@/utils/axios-client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { useSelector, useDispatch } from "react-redux";
import { setAlert, setRegisterData } from "@/app/features/user-slice.js";

// components
import LayoutAuth from "@/components/LayoutAuth.jsx";

// bootstrap components
import Alert from "react-bootstrap/Alert";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.user.alert);
  const registerData = useSelector((state) => state.user.registerData);
  const [confirmPassword, setConfirmPassword] = useState("");

  const checkConfirmPassword = () => {
    if (registerData.password !== confirmPassword) {
      dispatch(
        setRegisterData({
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          email: registerData.email,
          password: "",
        })
      );
      setConfirmPassword("");
      dispatch(
        setAlert({
          isOpen: true,
          text: "Confirm password not match",
          color: "danger",
        })
      );
      return;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    checkConfirmPassword();
    try {
      await axiosClient.post("/api/users/register", registerData);
      dispatch(
        setAlert({
          isOpen: true,
          text: "New Account created, please login!",
          color: "success",
        })
      );
      router.replace("/");
    } catch (error) {
      const { errors } = error.response.data;
      dispatch(
        setRegisterData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        })
      );
      setConfirmPassword("");
      dispatch(
        setAlert({
          isOpen: true,
          text: errors,
          color: "danger",
        })
      );
      console.error(error);
    }
  };

  return (
    <LayoutAuth>
      <div className="card" style={{ width: "20rem" }}>
        <h5 className="card-header">Register</h5>
        <div className="card-body">
          {alert.isOpen && (
            <Alert key={alert.color} variant={alert.color}>
              {alert.text}
            </Alert>
          )}
          <form className="row g-3" onSubmit={(e) => handleRegister(e)}>
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" value={registerData.first_name} onChange={(e) => dispatch(setRegisterData({ ...registerData, first_name: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" value={registerData.last_name} onChange={(e) => dispatch(setRegisterData({ ...registerData, last_name: e.target.value }))} />
            </div>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={registerData.email} onChange={(e) => dispatch(setRegisterData({ ...registerData, email: e.target.value }))} />
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={registerData.password} onChange={(e) => dispatch(setRegisterData({ ...registerData, password: e.target.value }))} />
            </div>
            <div className="col-12">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <div className="col-12">
              <p>
                Already have an account?{" "}
                <Link href="/" className="text-underlinelink-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                  Login
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
    };
  }

  return { props: {} };
};
