import React, { useState, useContext } from "react";
import { User, LogIn, Menu, X, TicketCheck } from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../hooks/authContext"; 

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <header className="bg-white text-black shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6">
        <Link to="/">
          <img className="w-[100px]" src={Logo} alt="logo de my event" />
        </Link>

        <button
          className="md:hidden flex items-center text-[#2a0e5e]"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center text-[#2a0e5e] gap-4">
          <Link
            to="/sorties"
            className="p-3 flex text-[14px] items-center border-r-2 border-gray-400"
          >
            <span className="pr-2">
              <TicketCheck size={20} />
            </span>
            <span>Sorties</span>
          </Link>
          {user ? (
            <>
              <Link
                to="/profil"
                className="p-3 flex text-[14px] items-center border-r-2 border-gray-400"
              >
                <span className="pr-2">
                  <User size={20} />
                </span>
                <span>Mon compte</span>
              </Link>
            
            </>
          ) : (
            <Link
              to="/authentification"
              className="p-2 flex items-center text-[14px] rounded-md text-white bg-[#ff5757] hover:bg-[#c34242] opacity-90"
            >
              <span className="pr-2">
                <LogIn size={20} />
              </span>
              <span>Je m'inscris</span>
            </Link>
          )}
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <Link
            to="/sorties"
            className="flex items-center p-4 text-white bg-teal-700 hover:bg-teal-600"
            onClick={toggleMenu}
          >
            <span className="pr-2">
              <TicketCheck size={20} />
            </span>
            Sorties
          </Link>
          {user ? (
            <>
              <Link
                to="/profil"
                className="flex items-center p-4 text-white bg-[#2a0e5e] hover:bg-[#4a2c83]"
                onClick={toggleMenu}
              >
                <span className="pr-2">
                  <User size={20} />
                </span>
                Mon compte
              </Link>
             
            </>
          ) : (
            <Link
              to="/authentification"
              className="flex items-center p-4 text-white bg-[#ff5757] hover:bg-[#c34242]"
              onClick={toggleMenu}
            >
              <span className="pr-2">
                <LogIn size={20} />
              </span>
              Je m'inscris
            </Link>
          )}
        </div>
      )}
    </header>
  );
}