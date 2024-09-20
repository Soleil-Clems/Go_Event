import { useState, useEffect, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { AuthContext } from "../hooks/authContext";

type User = {
  email: string;
  pseudo: string;
  avatar: string;
  description?: string;
  token?: string
};

const Auth = () => {

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // console.log(user)


    }
  }, [user])

  const fetchUser = async (user: User) => {
    try {
      const response: any = await axios.post("http://localhost:4242/api/login", user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: User = response.data
      // console.log(data);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data))
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };



  const handleLoginSuccess = (credentialResponse: any) => {
    try {
      const decodedToken: any = jwtDecode(credentialResponse.credential);
      const data = {
        email: decodedToken.email,
        pseudo: decodedToken.name,
        avatar: decodedToken.picture,
        description: '',
      };
      fetchUser(data)
    } catch (error) {
      console.error("Error decoding token", error);
    }
  };

  const handleLoginError = () => {
    console.log("Connexion au compte google échouée");
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-2xl font-semibold mb-6">Connectez-vous</h2>

      <div className="w-full max-w-sm space-y-4">
        <div className="w-full flex justify-center gap-2">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        
        </div>
      </div>
    </div>
  );
};

export default Auth;
