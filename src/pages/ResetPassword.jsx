import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import './ResetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (!token) {
            setError('Token de restablecimiento no encontrado. Por favor, utiliza el enlace enviado a tu correo.');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await resetPassword(token, password);
            setMessage(response.data || 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al restablecer la contraseña. El token puede ser inválido o haber expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#00b3b3" }}>
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src="/img/logo.jpg" alt="Logo" height="50" />
                    </Link>
                </div>
            </nav>

            <div className="container my-5 reset-password-page">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-4 d-flex justify-content-center mb-4 mb-md-0">
                        <img
                            src="/img/logo.jpg"
                            alt="Logo Robotech"
                            className="img-fluid"
                            style={{ maxWidth: "240px" }}
                        />
                    </div>

                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow p-4">
                            <h3 className="fw-bold text-primary mb-2">Restablecer contraseña</h3>
                            <p className="text-muted mb-4">
                                Ingresa tu nueva contraseña. Te recomendamos usar al menos 8 caracteres.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Nueva contraseña</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength="8"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
                                </button>
                            </form>

                            {message && <div className="alert alert-success mt-3 mb-0">{message}</div>}
                            {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}

                            <div className="text-center mt-3">
                                <Link to="/login" className="small text-muted">
                                    Volver a iniciar sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
