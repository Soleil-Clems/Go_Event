import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../hooks/authContext";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faInfoCircle,
  faWheelchair,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@chakra-ui/react";
import Map from "../components/Map";

interface Event {
  uid: string;
  title_fr: string;
  description_fr: string;
  firstdate_begin: string;
  image?: string;
  keywords_fr?: string;
  daterange_fr?: string;
  conditions_fr?: string;
  accessibility_label_fr?: string;
  longdescription_fr?: string;
  age_min?: string;
  age_max?: string;
  location_coordinates?: {
    lat: number;
    lon: number;
  };
  location_name?: string;
  location_address?: string;
  location_postalcode?: string;
  location_city?: string;
  location_department?: string;
  location_region?: string;
}

const Event: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<[number, number] | any>([]);
  const { user } = useContext(AuthContext);
  const [enable, setEnable] = useState<boolean>(true);
  const toast = useToast();



  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&refine.uid=${id}`
        );
        const records = response.data.records;
        if (records.length > 0) {
          setEvent(records[0].fields);
          if (records[0].fields.location_coordinates) {
            setLocation(records[0].fields.location_coordinates);
          }
        } else {
          setError("Événement non trouvé.");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des données de l'événement.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleCreateSortie = async () => {
    if (user) {
      const sortie = {
        title: event?.title_fr,
        idevent: event?.uid,
        description: event?.description_fr,
        location: event?.location_address,
        date: event?.firstdate_begin,
        createurid: user.user_id,
        image: event?.image,
        visibility: "private",
      };
      console.log("create sortie", sortie);

      try {
        if (enable) {
          const response: any = await axios.post(
            `http://localhost:4242/api/sorties`,
            sortie,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.message == "success") {
            toast({
              title: `Sortie ${event?.title_fr} cree`,
              description: "Vous avez cree une sortie pour cet evenement",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          } else {
            toast({
              title: `Impossible de cree une sortie`,
              description: "Une erreur est survenue",
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          }
          setEnable((prevEnable) => false);
        }
      } catch (error) {
        console.error("Error creating sortie:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        <section className="relative w-full h-auto sm:h-80 md:h-[500px]">
          <img
            src={event?.image || "https://via.placeholder.com/1200x600"}
            alt={event?.title_fr || "Image de l'événement"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="absolute inset-0 flex flex-col-reverse lg:flex-row justify-between p-4 md:p-8 lg:max-w-[1200px] mx-auto">
            <div className="text-white w-full lg:w-1/2 pt-12 md:px-12 lg:pt-20 lg:px-24">
              <h1 className="text-2xl md:text-4xl font-bold text-[#ff5757] mb-8">
                {event?.title_fr || "Titre non disponible"}
              </h1>
              <p className="text-sm md:text-lg mb-4">
                {event?.description_fr || "Description non disponible"}
              </p>
              {event?.keywords_fr && (
                <p className="text-sm text-gray-300">
                  <span className="text-white">Catégorie : </span>
                  {event?.keywords_fr}
                </p>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 mt-6 lg:mt-0 lg:ml-8 hidden lg:block">
              <h2 className="text-xl text-[#2a0e5e] border-b-2 border-[#ff5757] font-bold mb-8">
                Informations
              </h2>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="mr-2 text-2xl p-2 text-[#2a0e5e]"
                />{" "}
                {event?.daterange_fr || "Date non disponible"}
              </p>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="mr-2 text-2xl p-2 text-[#2a0e5e]"
                />{" "}
                {event?.conditions_fr || "Conditions non disponibles"}
              </p>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faWheelchair}
                  className="mr-2 text-2xl p-2 text-[#2a0e5e]"
                />{" "}
                {event?.accessibility_label_fr ||
                  "Accessibilité non disponible"}
              </p>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faUser}
                  className="mr-2 text-2xl p-2 text-[#2a0e5e]"
                />{" "}
                {event?.age_min || "Ages non disponibles"} ans -{" "}
                {event?.age_max || "Ages non disponibles"} ans
              </p>
              {user ?
                <button
                  className={`w-full py-2 rounded mt-4 transition duration-300 ${enable
                    ? "bg-[#2a0e5e] text-white hover:bg-[#4a2c83]"
                    : "bg-gray-400 text-gray-700"
                    }`}
                  onClick={enable ? handleCreateSortie : undefined}
                  disabled={!enable}
                >
                  {enable ? "Créer une sortie" : "Sortie créée"}
                </button>
                :
                ""

              }
              <div className=" w-full flex">
                <Link
                  to={`/sorties/search/${id}`}
                  className="w-full bg-[#ff5757] flex justify-center text-white py-2 rounded mt-4 hover:bg-[#c34242] transition duration-300"
                >
                  Voir les sorties
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col lg:flex-row lg:justify-between p-4 md:px-8 mx-auto my-6 lg:my-12">
          <div className="w-full lg:w-[70%] lg:order-first mb-6 lg:mb-0">
            <div className="bg-white p-8 rounded-lg shadow-md w-full lg:hidden mb-6">
              <h2 className="text-xl text-[#2a0e5e] border-b-2 border-[#ff5757] font-bold mb-8">
                Informations
              </h2>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="mr-2 text-2xl p-2 text-[#2a0e5e]"
                />{" "}
                {event?.daterange_fr || "Date non disponible"}
              </p>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="mr-2 text-2xl p-2 text-[#2a0e5e]"
                />{" "}
                {event?.conditions_fr || "Conditions non disponibles"}
              </p>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faWheelchair}
                  className="mr-2 text-2xl p-2 text-[#2a0e5e]"
                />{" "}
                {event?.accessibility_label_fr ||
                  "Accessibilité non disponible"}
              </p>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faUser}
                  className="mr-2 text-2xl p-2 text-[#2a0e5e]"
                />{" "}
                {event?.age_min || "Ages non disponibles"} ans -{" "}
                {event?.age_max || "Ages non disponibles"} ans
              </p>
              {user ?
                <button
                  className={`w-full py-2 rounded mt-4 transition duration-300 ${enable
                    ? "bg-[#2a0e5e] text-white hover:bg-[#4a2c83]"
                    : "bg-gray-400 text-gray-700"
                    }`}
                  onClick={enable ? handleCreateSortie : undefined}
                  disabled={!enable}
                >
                  {enable ? "Créer une sortie" : "Sortie créée"}
                </button>
                :
                ""
              }
              <div className=" w-full flex">
                <Link
                  to={`/sorties/search/${id}`}
                  className="w-full bg-[#ff5757] flex justify-center text-white py-2 rounded mt-4 hover:bg-[#c34242] transition duration-300"
                >
                  Voir les sorties
                </Link>
              </div>
            </div>

            <h2 className="text-xl text-[#2a0e5e] font-bold border-b-2 border-[#ff5757] font-bold mb-8 ">
              Description
            </h2>
            <p
              className="text-sm md:text-base text-gray-600 mb-6"
              dangerouslySetInnerHTML={{
                __html:
                  event?.longdescription_fr || "Description non disponible.",
              }}
            ></p>
            <h2 className="text-xl text-[#2a0e5e] font-bold border-b-2 border-[#ff5757] font-bold mb-8">
              Contactez-nous
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Pour toute question, veuillez contacter l'organisme responsable
              via leur site web.
            </p>
          </div>
          <div className="w-full lg:w-[30%] mt-6 lg:mt-0 lg:ml-8">
            <h2 className="text-xl text-[#2a0e5e] border-b-2 border-[#ff5757] font-bold mb-8">
              Localisation de l'événement
            </h2>
            <div className="w-full h-64 md:h-80 border-2 border-gray-300 shadow-lg rounded-lg">
              {location.length > 0 ? (
                <Map position={location} />
              ) : (
                <div>Aucune localisation donnée</div>
              )}
            </div>
            <div className="mt-4 p-6 bg-white text-gray-700 shadow-lg rounded-lg border border-gray-200">
              <h3 className="text-xl text-[#2a0e5e] border-b-2 border-[#ff5757] font-bold mb-8">
                Adresse
              </h3>
              <div className="flex flex-col space-y-2">
                {event?.location_name && (
                  <p className="text-base font-medium text-gray-600">
                    <span className="font-bold text-black">Nom :</span>{" "}
                    {event?.location_name}
                  </p>
                )}
                {event?.location_address && (
                  <p className="text-base font-medium text-gray-600">
                    <span className="font-bold text-black">Adresse :</span>{" "}
                    {event?.location_address}
                  </p>
                )}
                {event?.location_postalcode && (
                  <p className="text-base font-medium text-gray-600">
                    <span className="font-bold text-black">Code Postal :</span>{" "}
                    {event?.location_postalcode}
                  </p>
                )}
                {event?.location_city && (
                  <p className="text-base font-medium text-gray-600">
                    <span className="font-bold text-black">Ville :</span>{" "}
                    {event?.location_city}
                  </p>
                )}
                {event?.location_department && (
                  <p className="text-base font-medium text-gray-600">
                    <span className="font-bold text-black">Département :</span>{" "}
                    {event?.location_department}
                  </p>
                )}
                {event?.location_region && (
                  <p className="text-base font-medium text-gray-800">
                    <span className="font-bold text-gray-600">Région :</span>{" "}
                    {event?.location_region}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Event;