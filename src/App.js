import './App.css';
import Container from 'react-bootstrap/Container';
import Patients from './components/Patients';
import ECGList from './components/ECGList';
import Login from './components/Login';
import Header from './components/Header';
import ForgotPassword from './components/ForgotPassword'
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
   return (
      <div className="App">
         <AuthProvider>
            <Header />
            <Container>
               <Router>
                  <Routes>
                     <Route exact path="/" element={<PrivateRoute />}>
                        <Route exact path="/" element={<Patients />} />
                     </Route>
                     <Route exact path="/ecglist/:patient" element={<PrivateRoute />}>
                        <Route exact path="/ecglist/:patient" element={<ECGList />} />
                     </Route>
                     <Route exact path="/login" element={<Login />} />
                     <Route exact path="/forgot-password" element={<ForgotPassword />} />
                  </Routes>
               </Router>
            </Container>
         </AuthProvider>
      </div>
   );
}

export default App;
