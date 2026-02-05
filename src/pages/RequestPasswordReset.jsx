import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/authService';
import './RequestPasswordReset.css';

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await requestPasswordReset(email);
            setMessage(response.data || 'Si el correo electrónico está registrado, se ha enviado un enlace de restablecimiento de contraseña.');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al solicitar el restablecimiento de contraseña. Por favor, intente de nuevo.');
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

            <div className="container my-5 request-reset-page">
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
                                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Enviando...' : 'Enviar enlace'}
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

export default RequestPasswordReset;
