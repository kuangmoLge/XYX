import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameLayout } from "@/components/Layout/GameLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
