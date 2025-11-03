import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NewTeam from "./pages/NewTeam";
import TeamPage from "./pages/TeamPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teams/new" element={<NewTeam />} />
        <Route path="/teams/:teamId" element={<TeamPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
