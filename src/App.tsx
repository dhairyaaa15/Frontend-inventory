import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Main from "./pages/Main";
import Maintenance from "./pages/Maintenance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Home />} /> {/* Alias for login */}
        <Route path="/main" element={<Main />} />
        <Route path="/maintenance" element={<Maintenance/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
