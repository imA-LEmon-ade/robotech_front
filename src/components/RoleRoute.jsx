import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({ children, allowed }) {
    const { rol } = useContext(AuthContext);

    return allowed.includes(rol) ? children : <Navigate to="/" />;
}
