import React from "react";
import Layout from "./layout";
import Dashboard from "./admin/dashboard/page";
import Clients from "./admin/clients/page";
import Abonnements from "./admin/abonnements/page";
import Parametres from "./admin/parametres/page";

const App = () => {
  // Determine which page is currently active
  const pathname = window.location.pathname;
  let activePage;
  switch (pathname) {
    case "/dashboard":
      activePage = "dashboard";
      break;
    case "/clients":
      activePage = "clients";
      break;
    case "/abonnements":
      activePage = "abonnements";
      break;
    case "/parametres":
      activePage = "parametres";
      break;
    default:
      activePage = "dashboard";
  }

  return (
    <Layout activePage={activePage}>
      {/* Render the corresponding page based on the activePage */}
      {pathname === "/dashboard" && <Dashboard />}
      {pathname === "/clients" && <Clients />}
      {pathname === "/abonnements" && <Abonnements />}
      {pathname === "/parametres" && <Parametres />}
    </Layout>
  );
}

export default App;
