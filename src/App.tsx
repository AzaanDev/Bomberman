import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
const App = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="layout">
        <Header />
        <main className="main">
          <Outlet />
        </main>
        <footer className="footer">Footer</footer>
      </div>
    </div>
  );
};

export default App;
