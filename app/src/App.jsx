import { Routes, Route, Navigate } from "react-router";
import Login from "./Login.jsx";
import Athletes from "./Athletes.jsx";
import Athlete from "./Athlete.jsx";
import AthleteEdit from "./AthleteEdit.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Athletes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/athlete/:id" element={<Athlete />} />
      <Route path="/athlete/:id/edit" element={<AthleteEdit />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
