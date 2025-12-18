import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClubCompetidores from "./pages/ClubCompetidores";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";

import AdminPanel from "./pages/AdminPanel";
import SubAdminPanel from "./pages/SubAdminPanel";
import ClubPanel from "./pages/ClubPanel";
import ClubTorneos from "./pages/club/ClubTorneos.jsx";
import ClubCategoriasTorneo from "./pages/club/ClubInscribirEquipo.jsx";
import ClubInscribirEquipo from "./pages/club/ClubInscribirEquipo.jsx";
import CompetidorPanel from "./pages/CompetidorPanel";
import CompetidorRobots from "./pages/CompetidorRobots.jsx";
import JuezPanel from "./pages/JuezPanel";
import Register from "./pages/Register.jsx";
import Clubes from "./pages/Clubes";
import Competidores from "./pages/Competidores";
import Robots from "./pages/Robots";
import Rankings from "./pages/Rankings";
import Torneos from "./pages/Torneos";
import AdminClubes from "./pages/admin/AdminClubes";
import AdminJueces from "./pages/admin/AdminJueces";
import AdminTorneos from "./pages/admin/AdminTorneos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminCategoriasTorneo from "./pages/admin/AdminCategoriasTorneo";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas básicas */}
        <Route path="/" element={<Home />} />
        // público
        <Route path="/login" element={<Login />} />               
        <Route path="/admin/login" element={<AdminLogin />} />   
         // exclusivo admin
         <Route path="/admin/jueces" element={<AdminJueces/>}/>
         <Route path="/admin/usuarios" element={<AdminUsuarios/>}/>
        <Route path="/admin/clubes" element={<AdminClubes/>} />
        <Route path="/admin/torneos" element={<AdminTorneos />} />
        <Route path="/admin/torneos/:idTorneo/categorias" element={<AdminCategoriasTorneo />} />
        <Route path="/register" element={<Register />} />

        {/* Nuevas secciones públicas */}
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/competidores" element={<Competidores />} />
        <Route path="/robots" element={<Robots />} />
        <Route path="/rankings" element={<Rankings />} />

        {/* Paneles */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/subadmin" element={<SubAdminPanel />} />
        <Route path="/club" element={<ClubPanel />} />
        <Route path="/competidor" element={<CompetidorPanel />} />
        <Route path="/competidor/robots" element={<CompetidorRobots />} />
        <Route path="/juez" element={<JuezPanel />} />

        <Route path="/club/torneos" element={<ClubTorneos />} />
        <Route path="/club/torneos/:idTorneo/categorias" element={<ClubCategoriasTorneo />} />
        <Route path="/club/categorias/:idCategoria/inscribir" element={<ClubInscribirEquipo />} />


        {/* 👇 ESTA ES LA RUTA QUE FALTABA CORRECTAMENTE DEFINIDA */}
        <Route path="/club/competidores" element={<ClubCompetidores />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
