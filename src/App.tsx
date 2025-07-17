import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Guest from "./pages/Guest";
import Birthday from "./pages/Birthday";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="/birthday" element={<Birthday />} />
      </Routes>
    </Router>
  );
}

export default App;
