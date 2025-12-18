import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar({ items, titulo }) {
  return (
    <div className="sidebar bg-dark text-white p-3">
      <h4 className="mb-4 fw-bold">{titulo}</h4>

      <ul className="list-unstyled">
        {items.map((item, i) => (
          <li key={i} className="mb-3">
            <Link to={item.to} className="text-white text-decoration-none">
              {item.icon && <span className="me-2">{item.icon}</span>}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
