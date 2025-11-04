import { Routes, Route, Navigate } from "react-router";
import Login from "./Login.jsx";
import Athletes from "./Athletes.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Athletes />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
