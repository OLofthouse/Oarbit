import { Routes, Route, Link } from 'react-router-dom';
import "@fontsource/inter";
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import AthleteDashboard from './pages/Dashboards/AthleteDashboard';
import CoachDashboard from './pages/Dashboards/CoachDashboard';
import LogActivity from './pages/AthletePages/LogActivity';
import ProgressView from './pages/AthletePages/ProgressView';
import ViewActivities from './pages/CoachPages/ViewActivities';
import CreateActivity from './pages/CoachPages/CreateActivity';

function App() {
  return (
    <>
      <nav>
        <Link to="/">Login </Link>
        <Link to="/Register">Register </Link>
        <Link to="/AthleteDashboard">A.Dash </Link>
        <Link to="/CoachDashboard">C.Dash </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/AthleteDashboard" element={<AthleteDashboard/>} />
        <Route path="/CoachDashboard" element={<CoachDashboard />}/>
        <Route path="/LogActivity" element={<LogActivity />} />
        <Route path="/ViewActivities" element={<ViewActivities />} />
        <Route path="/ProgressView" element={<ProgressView />} />
        <Route path="/CreateActivity" element={<CreateActivity />} />
      </Routes>
    </>
  );
}

export default App;
