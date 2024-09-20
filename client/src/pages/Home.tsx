import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReactPaginate from "react-paginate";
import { Search, MapPin, MapPinned } from "lucide-react";
import Map from "../components/Map";

interface Event {
  uid: string;
  title_fr: string;
  description_fr: string;
  firstdate_begin: string;
  image?: string;
  location_city: string;
}

interface EvtLocation {
  id: any;
  title: string;
  img: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [location, setLocation] = useState<[] | any>([]);
  const [evtLocation, setEvtLocation] = useState<EvtLocation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchCity, setSearchCity] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // New state for keyword search

  const eventsPerPage = 12;
  const [openMap, setOpenMap] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("La géolocalisation n'est pas supportée par ce navigateur.");
      return;
    }

    const successCallback = (position: any) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
    };

    const errorCallback = (error: any) => {
      console.log(`Erreur de géolocalisation: ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  const fetchData = async (city: string = "", keyword: string = "") => {
    const datasetId = "evenements-publics-openagenda";

    try {
      let queryParams = [];
      if (city) {
        queryParams.push(`location_city LIKE '%${city}%'`);
      }
      if (keyword) {
        queryParams.push(
          `(title_fr LIKE '%${keyword}%' OR description_fr LIKE '%${keyword}%')`
        );
      }
      queryParams.push("firstdate_begin > NOW()");

      const whereClause = queryParams.join(" AND ");

      const params = {
        where: whereClause,
        limit: 100,
      };

      const response = await axios.get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/${datasetId}/records`,
        { params }
      );

      setEvents(response.data.results);
      setFilteredEvents(response.data.results);

      let results: EvtLocation[] = [];

      response.data.results.forEach((data: any) => {
        if (data.location_coordinates) {
          results.push({
            title: data?.title_fr,
            id: data?.uid,
            img: data?.image,
            longitude: data.location_coordinates.lon,
            latitude: data.location_coordinates.lat,
          });
        }
      });

      setEvtLocation(results);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(e.target.value);
  };

  const handleKeywordSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData(searchCity, searchKeyword);
    setCurrentPage(0);
  };

  const offset = currentPage * eventsPerPage;
  const currentEvents = filteredEvents.slice(offset, offset + eventsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <section className="relative w-full min-h-[500px] text-center background-image">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 pt-12 px-4 sm:pt-24 sm:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Bienvenue sur Events !
            </h1>
            <p className="mt-4 text-sm sm:text-lg max-w-full sm:max-w-[600px] mx-auto text-white">
              Soyez au premier rang des événements qui font bouger votre ville !
              Du concert intime aux festivals grandioses, explorez toutes les
              opportunités pour enrichir vos sorties et créer des souvenirs
              mémorables.
            </p>
          </div>
          <div className="relative z-10 mt-8 sm:mt-12 flex justify-center px-4 sm:px-8">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row items-center gap-2 bg-white p-4 rounded-lg w-full sm:w-auto"
            >
              <div className="relative flex-grow">
                <input
                  type="search"
                  className="w-full sm:w-64 py-2 pl-10 pr-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757]"
                  placeholder="Rechercher une ville..."
                  value={searchCity}
                  onChange={handleCitySearch}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ff5757]" />
              </div>

              <div className="relative flex-grow">
                <input
                  type="search"
                  className="w-full sm:w-64 py-2 pl-10 pr-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757]"
                  placeholder="Rechercher par mot-clé..."
                  value={searchKeyword}
                  onChange={handleKeywordSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ff5757]" />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-[#2a0e5e] text-white rounded-md hover:bg-[#4a2c83] focus:outline-none"
              >
                Rechercher
              </button>
              <div
                onClick={() => setOpenMap(!openMap)}
                className="flex gap-2 px-2 cursor-pointer py-2 bg-[#2a0e5e] text-white rounded-md hover:bg-[#4a2c83] focus:outline-none"
              >
                <MapPinned />
              </div>
            </form>
          </div>
        </section>
        <section className="relative container mx-auto px-4 py-12">
          {location.length > 0 && openMap ? (
            <div
              className="flex w-full bg-white shadow-md rounded-lg"
              style={{ height: "400px" }}
            >
              <Map
                position={location}
                locations={evtLocation.length > 0 ? evtLocation : []}
              />
            </div>
          ) : null}

          <h2 className="text-2xl font-bold text-[#2a0e5e] border-b-4 border-[#ff5757] mt-12 pb-4 mb-12">
            Événements à venir
          </h2>

          <div className="flex gap-2">
            <div
              className={`${
                (location.length > 0 && openMap, "w-full")
              } grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}
            >
              {currentEvents.map((event) => (
                <div
                  key={event.uid}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={event.image || "https://via.placeholder.com/300x150"}
                    alt={event.title_fr}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4 text-black">
                    <h3 className="font-semibold text-lg mb-2 border-b-2 border-[#ff5757] pb-1 line-clamp-1">
                      {event.title_fr}
                    </h3>
                    <p className="text-xs mb-2">
                      {new Date(event.firstdate_begin).toLocaleDateString(
                        "fr-FR",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm mb-2">
                      <MapPin className="inline-block mr-1" size={16} />
                      {event.location_city}
                    </p>
                    <p className="text-sm mb-3 line-clamp-1">
                      {event.description_fr}
                    </p>
                    <div className="flex justify-center w-full">
                      <Link
                        to={`/event/${event.uid}`}
                        className="px-4 py-2.5 w-full text-center bg-[#2a0e5e] text-white text-sm rounded hover:bg-[#4a2c83] transition-colors duration-300"
                      >
                        En savoir plus
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <ReactPaginate
              previousLabel={"Précédent"}
              nextLabel={"Suivant"}
              breakLabel={"..."}
              pageCount={Math.ceil(filteredEvents.length / eventsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              forcePage={currentPage}
              containerClassName="pagination flex flex-wrap justify-center gap-1 sm:gap-2"
              pageClassName="page-item"
              pageLinkClassName="page-link text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-gray-200 text-black rounded-md hover:bg-[#4a2c83] transition-colors duration-300"
              previousClassName="page-item"
              previousLinkClassName="page-link text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-[#ff5757] text-white rounded-md hover:bg-[#c34242] transition-colors duration-300"
              nextClassName="page-item"
              nextLinkClassName="page-link text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-[#ff5757] text-white rounded-md hover:bg-[#c34242] transition-colors duration-300"
              breakClassName="page-item"
              breakLinkClassName="page-link text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-[#2a0e5e] text-white rounded-md hover:bg-[#4a2c83] transition-colors duration-300"
              activeClassName="active"
              activeLinkClassName="page-link text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-gray-500 text-white rounded-md hover:bg-[#4a2c83] transition-colors duration-300"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}