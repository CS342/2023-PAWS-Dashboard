import './App.css';
import Patients from './components/Patients';
import ECGList from './components/ECGList';
import { Container } from 'react-bootstrap';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
   return (
      <div className="App">
         <Container>
            <Router>
               <AuthProvider>
                  <Routes>
                     <Route exact path="/" element={<PrivateRoute />}>
                        <Route exact path="/" element={<Patients />} />
                     </Route>
                     <Route exact path="/ecglist/:patient" element={<PrivateRoute />}>
                        <Route exact path="/ecglist/:patient" element={<ECGList />} />
                     </Route>
                     <Route exact path="/login" element={<Login />} />
                  </Routes>
               </AuthProvider>
            </Router>
         </Container>
      </div>
   );
}

export default App;
