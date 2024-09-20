import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Event from "./pages/Event";
import Authentification from "./pages/Authentication";
import UserExit from "./pages/UserExit";
import Profil from "./pages/Profil";
import Home from "./pages/Home";
import { ChakraProvider } from '@chakra-ui/react';
import NoPage from "./pages/NoPage";
import AuthProvider from "./hooks/authContext";
import SortieList from "./pages/SortieList";
import Sortie from "./pages/Sortie";
import ProtectedRoute from "./hooks/protectedRoute";
import DeniedRoute from "./hooks/deniedRoute";
import OtherUser from "./pages/OtherUser";


function App() {
 

  return (
    <ChakraProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_AUTH_ID}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/event/:id" element={<Event />} />
              <Route path="/sorties/:id" element={<Sortie />} />

              <Route path="/authentification" element={
                <DeniedRoute>
                  <Authentification />
                </DeniedRoute>
              } />

              <Route path="/messenger/:id" element={
                <ProtectedRoute>
                  <UserExit />
                </ProtectedRoute>
              } />
              <Route path="/sorties" element={
                <ProtectedRoute>
                  <SortieList />
                </ProtectedRoute>
              } />
              <Route path="/sorties/search/:evtid" element={
                <ProtectedRoute>
                  <SortieList />
                </ProtectedRoute>
              } />

              <Route path="/profil" element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
              } />
              <Route path="/user/:id" element={
                <ProtectedRoute>
                  <OtherUser />
                </ProtectedRoute>
              } />

              {/* Catch all route */}
              <Route path="*" element={<NoPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ChakraProvider>
  );
}

export default App;
