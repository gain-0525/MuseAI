import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import MainPage from "./pages/MainPage";
import Guide from './pages/Guide';
import AboutPage from "./pages/AboutPage";
import DetailPage from './pages/DetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

