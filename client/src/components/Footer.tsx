import React from "react"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import LogoFooter from "../assets/LogoFooter.png";
 
export default function Footer() {
  return (
    <footer className="bg-[#2a0e5e] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Logo and Description */}
          <div className="flex flex-col items-center">
            <img className="w-[90px] mb-4" src={LogoFooter} alt="logo events" />
            <p className="text-white">
              Découvrez les événements incontournables autour de vous. Concerts,
              expositions, festivals et plus encore, tout en un clic !
            </p>
          </div>
 
          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg text-[#ff5757] font-semibold mb-4">
              Liens rapides
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-white hover:text-[#ff5757] transition-colors duration-300"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  className="text-white hover:text-[#ff5757] transition-colors duration-300"
                >
                  Mon compte
                </a>
              </li>
              <li>
                <a
                  href="/authentification"
                  className="text-white hover:text-[#ff5757] transition-colors duration-300"
                >
                  Je m'inscrit
                </a>
              </li>
            </ul>
          </div>
 
          {/* Follow Us */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg text-[#ff5757] font-semibold mb-4">
              Suivez-nous
            </h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="#!"
                className="text-white hover:text-[#ff5757] transition-colors duration-300"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#!"
                className="text-white hover:text-[#ff5757] transition-colors duration-300"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#!"
                className="text-white hover:text-[#ff5757] transition-colors duration-300"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#!"
                className="text-white hover:text-[#ff5757] transition-colors duration-300"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
            <p className="text-white">contact@events.com</p>
          </div>
        </div>
 
        {/* Copyright */}
        <div className="border-t border-white mt-8 pt-4 text-center text-white text-sm">
          &copy; 2024 Events. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}