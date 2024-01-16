import axiosClient from "@/utils/axios-client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import nookies from "nookies";
import isAuthorized from "@/utils/is-auth.js";
import { useSelector, useDispatch } from "react-redux";
import { toggleAlert, setRegisterData } from "@/app/features/user-slice.js";
import validate, { registerUserValidation } from "@/utils/validation/validate";

// components
import LayoutAuth from "@/components/LayoutAuth.jsx";
import CustomAlert from "@/components/CustomAlert.jsx";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const registerData = useSelector((state) => state.user.registerData);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [invalidFirstName, setInvalidFirstName] = useState(undefined);
  const [invalidLastName, setInvalidLastName] = useState(undefined);
  const [invalidEmail, setInvalidEmail] = useState(undefined);
  const [invalidPassword, setInvalidPassword] = useState(undefined);

  const checkValidation = () => {
    const resultInvalidFirstName = validate(registerUserValidation.first_name, registerData.first_name);
    const resultInvalidLastName = validate(registerUserValidation.last_name, registerData.last_name);
    const resultInvalidEmail = validate(registerUserValidation.email, registerData.email);
    const resultInvalidPassword = validate(registerUserValidation.password, registerData.password);

    if (resultInvalidFirstName || resultInvalidLastName || resultInvalidEmail || resultInvalidPassword) {
      setInvalidFirstName(resultInvalidFirstName);
      setInvalidLastName(resultInvalidLastName);
      setInvalidEmail(resultInvalidEmail);
      setInvalidPassword(resultInvalidPassword);
      return false;
    }

    if (registerData.password !== confirmPassword) {
      dispatch(toggleAlert({ isShow: "show", variant: "danger", message: "Confirm password doesn't match" }));
      dispatch(setRegisterData({ ...registerData, password: "" }));
      setConfirmPassword("");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    try {
      const isValid = checkValidation();
      if (isValid) {
        await axiosClient.post("/api/users/register", registerData);
        dispatch(toggleAlert({ isShow: "hide", variant: "success", message: "New account created!, please login" }));
        router.push("/login?success=true");
      }
    } catch (error) {
      const { errors } = error.response.data;
      dispatch(toggleAlert({ isShow: "show", variant: "danger", message: errors }));
      dispatch(setRegisterData({ ...registerData, password: "" }));
      setConfirmPassword("");
      console.error(error);
    }
  };

  return (
    <LayoutAuth>
      <div className="card" style={{ width: "28rem" }}>
        <h5 className="card-header">Register</h5>
        <div className="card-body">
          <CustomAlert />
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input type="text" className={`form-control ${invalidFirstName ? "is-invalid" : ""}`} value={registerData.first_name} onChange={(e) => dispatch(setRegisterData({ ...registerData, first_name: e.target.value }))} />
              <div className="invalid-feedback">{invalidFirstName && invalidFirstName[0].message}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input type="text" className={`form-control ${invalidLastName ? "is-invalid" : ""}`} value={registerData.last_name} onChange={(e) => dispatch(setRegisterData({ ...registerData, last_name: e.target.value }))} />
              <div className="invalid-feedback">{invalidLastName && invalidLastName[0].message}</div>
            </div>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" className={`form-control ${invalidEmail ? "is-invalid" : ""}`} value={registerData.email} onChange={(e) => dispatch(setRegisterData({ ...registerData, email: e.target.value }))} />
              <div className="invalid-feedback">{invalidEmail && invalidEmail[0].message}</div>
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input type="password" className={`form-control ${invalidPassword ? "is-invalid" : ""}`} value={registerData.password} onChange={(e) => dispatch(setRegisterData({ ...registerData, password: e.target.value }))} />
              <div className="invalid-feedback">{invalidPassword && invalidPassword[0].message}</div>
            </div>
            <div className="col-12">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="col-12">
              <button type="button" className="btn btn-primary" onClick={handleRegister}>
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
