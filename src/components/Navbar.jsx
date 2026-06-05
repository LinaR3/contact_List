import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        People<span>Base</span>
      </Link>
    </nav>
  );
};