export default function AdminDashboard() {
  return (
    <>
      <h2 className="fw-bold mb-3">Panel de Administración</h2>
      <p className="text-muted">
        Bienvenido. Desde aquí puedes gestionar los módulos principales del sistema.
      </p>

      <div className="row mt-4">

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Usuarios</h5>
              <p className="card-text">Gestión de cuentas del sistema</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Clubes</h5>
              <p className="card-text">Administrar clubes registrados</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Torneos</h5>
              <p className="card-text">Crear y gestionar torneos</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Jueces</h5>
              <p className="card-text">Asignar y administrar jueces</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
