import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Sortie {
  id: number;
  idevent: number;
  title: string;
  description: string;
  date: string;
  image?: string;
  avatar?: string;
  pseudo?: string;
}

export default function SortieList() {
  const { evtid } = useParams();
  const [sorties, setSorties] = useState<Sortie[]>([]);

  // useEffect(() => {

  //     fetchData();
  // }, []);

  useEffect(() => {
    fetchData();
  }, [evtid]);

  const fetchData = async () => {
    try {
      const url = evtid
        ? `http://localhost:4242/api/sorties/search/${evtid}`
        : "http://localhost:4242/api/sorties";

      const response: any = await axios.get(url);

      if (response.data.message == "success") {
        const data = response.data.data;
        console.log(data);
        console.log(url, data);
        const evt = data.map((sortie: any) => ({
          id: sortie.ID,
          idevent: Number(sortie.idevent),
          title: sortie.title,
          description: sortie.description,
          date: sortie.date,
          image: sortie.image,
          avatar: sortie.participants[0].avatar,
          pseudo: sortie.participants[0].pseudo,
        }));
        setSorties(evt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <h2 className="flex m-6  mx-20 text-2xl font-bold text-black border-b-4 border-[#ff5757] pb-4 mb-12">
          Mes sorties{" "}
        </h2>

        <section className="relative container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorties.map((event) => (
              <div
                key={event.idevent}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={event.image || "https://via.placeholder.com/300x150"}
                  alt={event.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4 text-black">
                  <h3 className="font-semibold text-lg mb-2 border-b-2 border-[#ff5757] pb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs mb-2">
                    {new Date(event.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex mb-4 justify-end  gap-2 items-center">
                    <div className="rounded-full flex w-[20px] h-[20px] overflow-hidden">
                      <img src={event?.avatar} alt=" avatar" />
                    </div>
                    <p className="text-sm">{event.pseudo}</p>
                  </div>
                  <Link
                    to={`/sorties/${event.id}`}
                    className="px-4 py-2.5 bg-[#2a0e5e] text-white text-sm rounded hover:bg-[#4a2c83] transition-colors duration-300"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}