export default function Teams() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4 fw-bold">Equipos en acción</h2>

        <div className="row justify-content-center gy-4">
          <div className="col-12 col-md-8 text-center">
            <img 
              src="/img/equipo1.jpg" 
              className="img-fluid rounded shadow"
              alt="Equipo 1" 
            />
          </div>

          <div className="col-12 col-md-8 text-center">
            <img 
              src="/img/equipo2.jpg" 
              className="img-fluid rounded shadow"
              alt="Equipo 2" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
