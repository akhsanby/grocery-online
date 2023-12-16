"use client";
import Link from "next/link";
import { useState } from "react";
import { handleLogin } from "@/lib/user.js";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="card" style={{ width: "20rem" }}>
      <h5 className="card-header">Login</h5>
      <div className="card-body">
        <form className="row g-3">
          <div className="col-12">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={credential.email} onChange={(e) => setCredential({ ...credential, email: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={credential.password} onChange={(e) => setCredential({ ...credential, password: e.target.value })} />
          </div>
          <div className="col-12">
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                if (await handleLogin(credential)) {
                  router.replace("/home");
                } else {
                  router.replace("/login");
                }
              }}
            >
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
  );
}
