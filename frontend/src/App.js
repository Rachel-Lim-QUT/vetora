import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patientprofile/:id" element={<PatientProfile />} />
      </Routes>
    </Router>
  );
}

export default App;