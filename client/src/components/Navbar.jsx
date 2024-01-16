import axiosClient from "@/utils/axios-client";
import Link from "next/link";
import nookies from "nookies";
import { withRouter } from "next/router";
import { getCarts } from "@/app/features/cart-slice.js";
import { useDispatch, useSelector } from "react-redux";

// bootstrap component
import NavDropdown from "react-bootstrap/NavDropdown";
import { useEffect } from "react";

function Navbar({ router, decodeToken }) {
  const dispatch = useDispatch();
  const totalItemCart = useSelector((state) => state.cart.carts.count);

  useEffect(() => {
    dispatch(getCarts(decodeToken.userId));
  }, []);

  const handleLogout = async () => {
    try {
      const { token } = nookies.get();
      await axiosClient.delete("/api/users/logout", {
        headers: { Authorization: token },
      });

      nookies.destroy(null, "token");
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm bg-body-tertiary sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold pointer" href="/home">
          Grocery
        </Link>
        <ul className="navbar-nav me-auto"></ul>
        <div className="d-flex gap-3">
          <NavDropdown title={`${decodeToken.firstName} ${decodeToken.lastName}`} id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} href="/profile">
              <button className="dropdown-item d-flex gap-2 p-0">
                <i className="bi bi-person-circle"></i>
                <span>Profile</span>
              </button>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <button onClick={handleLogout} className="dropdown-item p-0">
                Logout
              </button>
            </NavDropdown.Item>
          </NavDropdown>
          <Link className="position-relative" href="/cart">
            <i className="bi bi-cart" style={{ color: "black" }}></i>
            <span className="position-absolute translate-middle badge rounded-pill bg-danger">{totalItemCart}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default withRouter(Navbar);
