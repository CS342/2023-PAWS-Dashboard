import './App.css';
import Dashboard from './components/Dashboard';
import { Container } from 'react-bootstrap';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
   return (
      <div className="App">
         <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: '100vh' }}
         >
            <div className="w-100" style={{ maxWidth: '400px' }}>
               <Router>
                  <AuthProvider>
                     <Routes>
                        <Route exact path="/" element={<PrivateRoute />}>
                           <Route exact path="/" element={<Dashboard />} />
                        </Route>
                        <Route exact path="/login" element={<Login />} />
                     </Routes>
                  </AuthProvider>
               </Router>
            </div>
         </Container>
      </div>
   );
}

export default App;
