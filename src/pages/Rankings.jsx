import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Rankings() {
  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="fw-bold mb-4">Rankings</h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Ranking de Clubes</h5>
                <a href="#" className="btn btn-primary mt-2">Ver ranking</a>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Ranking de Competidores</h5>
                <a href="#" className="btn btn-success mt-2">Ver ranking</a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Ranking de Robots</h5>
                <a href="#" className="btn btn-warning mt-2">Ver ranking</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
