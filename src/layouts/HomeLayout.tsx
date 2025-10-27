import { Outlet, Link } from "react-router-dom";
import "./HomeLayout.css";

const HomeLayout = () => {
  return (
    <div className="layout">
      <nav className="header">
        <div className="nav-content">
          <span className="logo">MuseAI</span>
          <div className="nav-links">
            <Link to="/about">MuseAI란</Link>
            <Link to="/guide">사용가이드</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        © 2025 MuseAI | 개발팀
      </footer>
    </div>
  );
};

export default HomeLayout;
