import "../styles/hero.css";

export default function Hero() {
  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      
      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
      </div>

      {/* Slides */}
      <div className="carousel-inner">

        {/* SLIDE 1 */}
        <div className="carousel-item active hero-slide" style={{ backgroundImage: `url('/img/coliseos.jpg')` }}>
          <div className="carousel-caption d-flex flex-column justify-content-center align-items-center">
            <h1 className="display-4 fw-bold text-shadow">Próximos Torneos</h1>
            <p className="fs-4 mt-3 text-shadow">Las batallas de robots más intensas… ¡Pronto!</p>
            <a href="/torneos" className="btn btn-warning btn-lg mt-4 px-4">Ver Torneos</a>
          </div>
        </div>

        {/* SLIDE 2 */}
        <div className="carousel-item hero-slide" style={{ backgroundImage: `url('/img/equipos.webp')` }}>
          <div className="carousel-caption d-flex flex-column justify-content-center align-items-center">
            <h1 className="display-4 fw-bold text-shadow">Equipos de Alto Nivel</h1>
            <p className="fs-4 mt-3 text-shadow">Conoce a los competidores más destacados.</p>
            <a href="/competidores" className="btn btn-light btn-lg mt-4 px-4">Ver Competidores</a>
          </div>
        </div>

        {/* SLIDE 3 */}
        <div className="carousel-item hero-slide" style={{ backgroundImage: `url('/img/robots.jpg')` }}>
          <div className="carousel-caption d-flex flex-column justify-content-center align-items-center">
            <h1 className="display-4 fw-bold text-shadow">Robots de Competencia</h1>
            <p className="fs-4 mt-3 text-shadow">Tecnología, potencia y estrategia.</p>
            <a href="/coliseo" className="btn btn-primary btn-lg mt-4 px-4">Explorar</a>
          </div>
        </div>

      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}

