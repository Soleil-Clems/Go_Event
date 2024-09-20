import { useState, createContext, ReactNode, useEffect, useCallback } from "react";
   import { Dispatch, SetStateAction } from "react";

   type AuthContextType = {
     user: any | null;
     setUser: Dispatch<SetStateAction<any | null>>;
     logout: () => void;
     isLoading: boolean;
   };

   export const AuthContext = createContext<AuthContextType>({
     user: null,
     setUser: () => null,
     logout: () => {},
     isLoading: true,
   });

   export default function AuthProvider({ children }: { children: ReactNode }) {
     const [user, setUser] = useState<any | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       const loadUser = async () => {
         try {
           const userJson = localStorage.getItem("user");
           if (userJson) {
             const storedUser = JSON.parse(userJson);
             setUser(storedUser);
           }
         } catch (error) {
           console.error("Erreur lors du chargement de l'utilisateur :", error);
         } finally {
           setIsLoading(false);
         }
       };

       loadUser();
     }, []);

     const logout = useCallback(() => {
       localStorage.removeItem("user");
       setUser(null);
     }, []);  

     return (
       <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
         {children}
       </AuthContext.Provider>
     );
   }