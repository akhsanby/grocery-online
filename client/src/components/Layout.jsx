// components
import Navbar from "@/components/Navbar";

export default function Layout({ children, decodeToken, totalItemCart }) {
  return (
    <div style={{ width: "100vw" }}>
      <Navbar decodeToken={decodeToken} totalItemCart={totalItemCart} />
      {children}
    </div>
  );
}
