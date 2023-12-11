import axiosClient from "@/utils/axios-client";
import Link from "next/link";
import nookies from "nookies";
import { useRouter } from "next/router";

// bootstrap component
import NavDropdown from "react-bootstrap/NavDropdown";

export default function NavbarComponent({ decodeToken }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const cookies = nookies.get();
      await axiosClient.delete("/api/users/logout", {
        headers: { Authorization: cookies.token },
      });

      nookies.destroy(null, "token");
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm p-3 bg-body-tertiary rounded">
      <div className="container">
        <span className="navbar-brand fw-bold">Grocery</span>
        <ul className="navbar-nav me-auto"></ul>
        <div className="d-flex gap-3">
          <NavDropdown className="text-capitalize" title={`${decodeToken?.firstName} ${decodeToken?.lastName}`} id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} href="/profile">
              <button className="dropdown-item d-flex gap-1 p-0">
                <i className="bi bi-person-circle"></i>
                <span>Profile ({decodeToken?.userLevel})</span>
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
            <span className="position-absolute translate-middle badge rounded-pill bg-danger">1</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
