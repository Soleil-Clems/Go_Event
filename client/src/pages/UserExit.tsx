import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../hooks/authContext";
import { Link, useParams } from "react-router-dom";
import { useToast } from '@chakra-ui/react'
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Send,
  LockKeyhole,
  LockKeyholeOpen,
  BadgeCheck,
  Trash,
  Users,
  Search,
  MapPin,
  ChevronDown,
  ChevronUp,
  View
} from "lucide-react";
import axios from "axios";
import Map from "../components/Map";

interface Detail {
  visibility: string;
  organisateur: string;
  avatar: string;
  id: number;
  createurid: number;
  idevent: string;
  title: string;
  participants: any[];
}

interface User {
  ID: number;
  pseudo: string;
  avatar: string;
}

interface Message {
  content: string;
  createdAt: string;
  sender_id: number;
  sender: {
    avatar: string;
  };
}

function UserExit() {
  const { id } = useParams<{ id: string }>();
  const [idEvent, setIdEvent] = useState<number | null>(null);
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [location, setLocation] = useState<[number, number] | any>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showSection, setShowSection] = useState(true);
  const [title, setTitle] = useState<string>('');
  const [interests, setInterests] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast()

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (id) {
      fetchData();
      fetchAllUser();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const intervalId = setInterval(fetchData, 2000);
      
      return () => clearInterval(intervalId);
    }
  }, []);


  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchAllUser = async () => {
    try {
      const response = await axios.get("http://localhost:4242/api/users");

      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4242/api/sorties/${id}`
      );

      if (response.data.message === "success") {
        setIdEvent(response.data.data.idevent);
        const data = response.data.data;

        const detailInfo: Detail = {
          visibility: data.visibility,
          organisateur: data.participants[0].pseudo,
          avatar: data.participants[0].avatar,
          id: data.ID,
          idevent: data.idevent,
          createurid: data.createurid,
          participants: data.participants,
          title: data.title,
        };

        setDetail(detailInfo);
        setMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&refine.uid=${Number(
            detail?.idevent
          )}`
        );
        const records = response.data.records;
        if (records.length > 0) {
          if (records[0].fields.location_coordinates) {
            setLocation(records[0].fields.location_coordinates);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (detail) {
      fetchEvent();
    }
  }, [detail]);

  const filterUsers = () => {
    const filtered = users.filter((user) =>
      user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleChangeVisibility = async () => {
    try {
      if (detail) {
        let newVisibility =
          detail.visibility === "private" ? "public" : "private";
        const sortieId = detail.id;
        const response = await axios.patch(
          `http://localhost:4242/api/sorties/${sortieId}/${newVisibility}`
        );
        if (response.data.message === "success") {
          fetchData();
        }
      }
    } catch (error) {
      console.log("Erreur lors du changement de visibilité :", error);
    }
  };

  const handleAddParticipant = async (user: User) => {
    try {
      if (detail && idEvent) {
        const response = await axios.post(
          `http://localhost:4242/api/add_participant/${id}/${user.ID}`
        );

        if (response.status === 200) {
          fetchData();
        }
      }
    } catch (error) {
      console.log("Erreur lors de l'ajout du participant :", error);
    }
    setSearchTerm("");
  };

  const handleSendMsg = async (content: string) => {
    try {
      const msg = {
        Content: content,
        SenderID: user.user_id,
        SortieID: Number(id),
      };
      const response: any = await axios.post(
        "http://localhost:4242/api/send",
        msg
      );

      if (response.status == 201) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };


  const handleInterestsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInterests(event.target.value);
  };

  const handleRemoveParticipant = async (userid: number) => {
    try {
      if (detail && idEvent) {
        const response = await axios.delete(
          `http://localhost:4242/api/remove_participant/${id}/${userid}`
        );

        if (response.status === 200) {
          fetchData();
        }
      }
    } catch (error) {
      console.log("Erreur lors de la suppression du participant :", error);
    }
    setSearchTerm("");
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && user && user.avatar) {
      setMessages([
        ...messages,
        {
          content: newMessage,
          createdAt: new Date().toISOString(),
          sender_id: user.user_id,
          sender: {
            avatar: user.avatar,
          },
        },
      ]);
      handleSendMsg(newMessage);
      setNewMessage("");
    }
  };


  const handleInteret = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Titre:', title);
    console.log('Centres d\'intérêt:', interests);
    setTitle("")
    setInterests("")
    toggleModal()
    toast({
      title: 'Felicitations',
      description: `Vous avec creer le centre d'interets ${title}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position:"top"
    })

  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <div className="space-y-4">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setShowSection(!showSection)}
              className="text-white font-bold p-2 rounded bg-[#ff5757] hover:bg-[#c34242] transition-all flex items-center space-x-2"
              aria-label={
                showSection ? "Cacher les détails" : "Afficher les détails"
              }
            >
              {showSection ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  <span>Cacher les détails</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  <span>Afficher les détails</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="text-white font-bold p-2 rounded bg-[#ff5757] hover:bg-[#c34242] transition-all flex items-center space-x-2"
              aria-label="Rechercher un ami"
            >
              <Search className="w-6 h-6" />
              <span>Rechercher un ami</span>
            </button>

            <button
              onClick={handleChangeVisibility}
              className="flex items-center bg-[#ff5757] hover:bg-[#c34242] text-white font-bold py-2 px-4 rounded"
              aria-label={
                detail?.visibility === "private"
                  ? "Passer en public"
                  : "Passer en privé"
              }
            >
              {detail?.visibility === "private" ? (
                <LockKeyhole className="mr-2" />
              ) : (
                <LockKeyholeOpen className="mr-2" />
              )}
              {detail?.visibility === "private" ? "Privé" : "Public"}
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center bg-[#ff5757] hover:bg-[#c34242] text-white font-bold py-2 px-4 rounded"
            >
              <MapPin className="mr-2" />
              {showMap ? "Cacher la carte" : "Afficher la carte"}
            </button>
            <button
              onClick={toggleModal}
              className="flex items-center bg-[#ff5757] hover:bg-[#c34242] text-white font-bold py-2 px-4 rounded"
            >
              Créer une description de sortie
            </button>
          </div>
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Ajouter des centres d'interets</h2>
                <form onSubmit={handleInteret}>
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={handleTitleChange}
                      className="border rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                      placeholder="Ex: Cinéma, Musique, Sport"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">
                      Centres d'intérêt
                    </label>
                    <input
                      type="text"
                      value={interests}
                      onChange={handleInterestsChange}
                      className="border rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                      placeholder="value"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="mr-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      
                      className="bg-[#2a0e5e] text-white py-2 px-4 rounded hover:bg-[#2a0e5e]/90 transition"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showSearchInput && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black w-full p-2 border border-[#ff5757] border-[#ff5757] rounded focus:outline-none focus:ring-2 focus:ring-[#ff5757] transition-all duration-500"
              placeholder="Rechercher un utilisateur..."
              style={{
                transform: showSearchInput
                  ? "translateY(0)"
                  : "translateY(-20px)",
                opacity: showSearchInput ? 1 : 0,
              }}
            />
          )}
          <div className="relative">
            {searchTerm && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded max-h-60 overflow-y-auto">
                {filteredUsers.map((user, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                    onClick={() => handleAddParticipant(user)}
                  >
                    {user.pseudo}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {showSection && (
          <section className="bg-[#2a0e5e] mt-6 p-6 text-white">
            {detail && (
              <div className="mt-4 pb-6">
                <h2 className="text-2xl font-bold">{detail.title}</h2>
                <p className="font-bold">Organisateur: {detail.organisateur}</p>
              </div>
            )}
          </section>
        )}
        {showMap && location.length > 0 && (
          <div className="w-full h-[400px] py-4 bg-white rounded-lg shadow-lg flex items-center justify-center">
            <Map position={location} />
          </div>
        )}
        {/* Section Participants et Messagerie */}
        <section className="flex flex-col lg:flex-row justify-between p-6 space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Participants */}
          <div className="flex-1 bg-gray-00 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-[#2a0e5e] border-b-2 border-[#ff5757] font-bold mb-8">
              Participants
            </h3>

            <h2 className="text-[#ff5757] font-normal pb-2 flex items-center">
              <Users className="w-6 h-6 text-[#ff5757] mr-2" />
              <span className="text-[#ff5757]">
                {detail ? detail.participants.length : 0}
              </span>
            </h2>

            <div className="grid grid-cols-2 text-[12px] md:grid-cols-4 gap-4">
              {detail
                ? detail.participants.map((participant: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col relative rounded-sm overflow-hidden w-32 h-32 bg-gray-100 rounded-lg shadow-lg"
                  >
                    <div className="relative flex h-full w-full">
                      <p className="absolute right-1 top-1 text-black">
                        {participant.ID === detail.createurid ? (
                          <div className="bg-blue-500 rounded-full">
                            <BadgeCheck className="w-4 h-4 text-white" />
                          </div>
                        ) : participant.ID === user.user_id ? (
                          <div
                            onClick={() =>
                              handleRemoveParticipant(participant.ID)
                            }
                            className="bg-slate-500 rounded-full flex p-1 gap-2"
                          >
                            <Trash
                              onClick={() =>
                                handleRemoveParticipant(participant.ID)
                              }
                              className="w-4 h-4 text-white hover:text-red-500" />
                            <Link to={`/user/${participant.ID}`}>
                              <View className="w-4 h-4 text-white hover:text-blue-300" />
                            </Link>
                          </div>
                        ) : (
                          <div

                            className="bg-slate-500 rounded-full flex flex-col gap-2 p-1"
                          >
                            <Link to={`/user/${participant.ID}`}>
                              <View className="w-4 h-4 text-white hover:text-blue-300" />
                            </Link>
                            {
                              user.user_id === detail.createurid ?
                                <Trash
                                  onClick={() =>
                                    handleRemoveParticipant(participant.ID)
                                  }
                                  className="w-4 h-4 text-white hover:text-red-500" />
                                : ''
                            }
                          </div>
                        )}
                      </p>

                      <img src={participant.avatar} alt="" />
                    </div>

                    <p className="absolute bottom-0 bg-slate-800 text-white flex w-full text-center justify-center">
                      {participant.pseudo}
                    </p>
                  </div>
                ))
                : ""}
            </div>
          </div>

          {/* Messagerie */}

          <div className="flex-1 bg-gray-00 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl  text-[#2a0e5e] border-b-2 border-[#ff5757] font-bold mb-8">
              Messagerie
            </h3>

            <div className="flex flex-col scrollbar-thin h-64 overflow-y-auto p-4 border border-gray-300 rounded-lg bg-white">
              {messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex py-1 ${message.sender_id == user.user_id
                    ? "justify-end"
                    : "justify-start"
                    }`}
                >
                  <div
                    className={`flex flex-col max-w-xs ${message.sender_id == user.user_id
                      ? "items-end"
                      : "items-start"
                      }`}
                  >
                    <div
                      className={`flex ${message.sender_id != user.user_id ? "gap-4" : ""} items-center ${message.sender_id == user.user_id
                        ? "flex-row-reverse"
                        : "flex-row"
                        }`}
                    >
                      <Link to={`/user/${message.sender_id}`} className="flex w-8 h-8 ">
                        <img
                          src={message.sender.avatar}
                          alt="Avatar"
                          className="h-full w-full rounded-full mx-2 mr-2"
                        />
                      </Link>
                      <div
                        className={`px-3 py-2  rounded-lg ${message.sender_id == user.user_id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                          }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs ${message.sender_id == user.user_id
                        ? "text-blue-300"
                        : "text-gray-500"
                        }`}
                    >
                      {/* {message?.CreatedAt} */}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center mt-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="text-black w-full p-2 rounded focus:outline-none border focus:ring-2 focus:ring-[#ff5757]"
                placeholder="Tapez votre message..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-[#ff5757] hover:bg-[#c34242] text-white font-bold py-2 px-4 rounded"
              >
                <Send />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default UserExit;



