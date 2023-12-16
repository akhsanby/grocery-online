"use client";
import Link from "next/link";

// bootstrap component
import NavDropdown from "react-bootstrap/NavDropdown";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg shadow-sm bg-body-tertiary sticky-top">
      <div className="container">
        <span className="navbar-brand fw-bold">Grocery</span>
        <ul className="navbar-nav me-auto"></ul>
        <div className="d-flex gap-3">
          <NavDropdown className="text-capitalize" title="Test" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} href="/profile">
              <button className="dropdown-item d-flex gap-2 p-0">
                <i className="bi bi-person-circle"></i>
                <span className="d-block">Profile</span>
              </button>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <button className="dropdown-item p-0">Logout</button>
            </NavDropdown.Item>
          </NavDropdown>
          <Link className="position-relative" href="/cart">
            <i className="bi bi-cart" style={{ color: "black" }}></i>
            <span className="position-absolute translate-middle badge rounded-pill bg-danger">0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
