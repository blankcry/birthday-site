import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Guest from "./pages/Guest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guest" element={<Guest />} />
      </Routes>
    </Router>
  );
}

export default App;
