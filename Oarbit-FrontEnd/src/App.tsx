import { Routes, Route, Link } from 'react-router-dom';
import "@fontsource/inter";
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';

function App() {
  return (
    <>
      <nav>
        <Link to="/">Login</Link>
        <Link to="/Register">Register</Link>
        <Link to="/AthleteDashboard">Dashboard</Link>
        <Link to="/LogActivity">Log</Link>
        <Link to="/ProgressView">Progress</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="Register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
