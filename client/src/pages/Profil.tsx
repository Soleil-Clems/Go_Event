import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../hooks/authContext";
import {
  Edit3,
  User,
  Calendar,
  PlusCircle,
  MessageCircle,
  Users,
  Mail,
  TicketCheck,
  Trash2,
  LogOut,
  NotebookText
} from "lucide-react";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios"
import { Link } from "react-router-dom";

function Profile() {
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser, logout } = useContext(AuthContext);
  const [sortie, setSortie] = useState<any | []>([])
  const [desc, setDesc] = useState('');
  useEffect(() => {
    if (user) {
      fetchSortie()
    }
  }, [user]);

  useEffect(() => {
    if (sortie.length > 0) {

      // console.log(sortie)
    }
  }, [sortie])


  const handleLogout = () => {
    logout();
  };

  const fetchSortie: any = async () => {
    try {
      const response: any = await axios.get(`http://localhost:4242/api/sorties/me/${user?.user_id}`)

      if (response.data.message == "success") {

        setSortie(response.data.data)

      }

    } catch (error) {
      console.log(error)
      setSortie([])
    }

  }

  const handleDeleteSortie = async (id: number) => {
    try {
      const response: any = await axios.delete(`http://localhost:4242/api/sorties/${id}`)

      if (response.data.message == "success") {
        fetchSortie()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateUser = async (description: string) => {
    try {
      let info = {
        Pseudo: user.pseudo,
        Email: user.email,
        avatar: user.avatar,
        Description: description
      }

      const response: any = await axios.patch(`http://localhost:4242/api/users/${user.user_id}`, info, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })

      console.log(response)

      if (response.status == 200) {

        let info = {
          avatar: user.avatar,
          email: user.email,
          pseudo: user.pseudo,
          description: description,
          user_id:user.user_id
        }
        setUser(info);
        
        localStorage.setItem("user", JSON.stringify(info))
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (desc !== '') {
      handleUpdateUser(desc)
    }
    setIsEditing(false);
    setDesc("")
  };

  const handleChange = (event: any) => {
    setDesc(event.target.value);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-300">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">

          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatar || Logo}
                alt="Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#2a0e5e]">
                  {user?.pseudo || "Nom d'utilisateur"}
                </h2>
                <p className="text-gray-500">{user?.email || "Email utilisateur"}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="text-[#2a0e5e] flex items-center space-x-2 bg-gray-300 px-3 py-1 mt-2 rounded-lg shadow hover:bg-gray-200 sm:px-4 sm:py-2"
              >
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">
                  Modifier mon profil
                </span>
              </button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[#2a0e5e] mb-4">
              Modifier mes informations
            </h3>
            <form className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500"
                />
                <p className="text-gray-500 mt-1">
                  Vous pouvez utiliser la photo de votre profil Facebook ou
                  changer d'image.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Présentation (facultatif)
                </label>
                <textarea
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                  rows={3}
                  onChange={handleChange}
                  value={desc}
                  placeholder="Écrivez un petit texte de présentation"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveClick}
                  type="button"
                  className="bg-[#2a0e5e] text-white py-2 px-4 rounded-lg shadow-lg hover:bg-[#240b4b] transition duration-300"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="flex flex-wrap gap-4 mb-4 sm:mb-6 justify-center">
          <button
            onClick={() => setActiveSection("personalInfo")}
            className={`${activeSection === "personalInfo" ? "bg-[#c34242]" : "bg-[#c34242]"
              } text-white py-2 px-4 rounded-lg shadow-lg flex justify-center items-center space-x-2 hover:bg-[#ff5757] transition duration-300`}
          >
            <User className="w-5 h-5" />
            <span className="text-sm sm:text-base">Mes infos</span>
          </button>
          <button
            onClick={() => setActiveSection("events")}
            className={`${activeSection === "events" ? "bg-[#c34242]" : "bg-[#c34242]"
              } text-white py-2 px-4 rounded-lg shadow-lg flex justify-center items-center space-x-2 hover:bg-[#ff5757] transition duration-300`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm sm:text-base">Mes événements</span>
          </button>
          <button
            onClick={() => setActiveSection("inviteFriends")}
            className={`${activeSection === "inviteFriends"
              ? "bg-[#c34242]"
              : "bg-[#c34242]"
              } text-white py-2 px-4 rounded-lg shadow-lg flex justify-center items-center space-x-2 hover:bg-[#ff5757] transition duration-300`}
          >
            <Users className="w-5 h-5" />
            <span className="text-sm sm:text-base">Mes invitations</span>
          </button>

        </div>


        {activeSection === "personalInfo" && (
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[#2a0e5e] mb-4">
              Mes informations
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="text-[#2a0e5e] w-5 h-5 mr-2" />
                <p className="text-gray-500">Nom :  {user?.pseudo || "Nom d'utilisateur"}</p>
              </div>
              <div className="flex items-center">
                <Mail className="text-[#2a0e5e] w-5 h-5 mr-2" />
                <p className="text-gray-500">Email : {user?.email || "Email d'utilisateur"}</p>
              </div>
              <div className="flex items-center">
                <NotebookText className="text-[#2a0e5e] w-5 h-5 mr-2" />
                <p className="text-gray-500">Description : {user?.description || "Description d'utilisateur"}</p>
              </div>
              <div className="flex w-full justify-end">
                <button
                  onClick={handleLogout}
                  className="p-2 flex items-center text-sm rounded-md text-slate-500 bg-slate-200 hover:bg-slate-500 hover:text-white opacity-90"
                >
                  <span className="pr-2">
                    <LogOut size={20} />
                  </span>
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "events" && (
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[#2a0e5e] mb-4">
              Mes événements
            </h3>
            <ul className="space-y-2">
              {

                sortie.map((evt: any, index: number) => (
                  <li key={index} className="flex justify-between hover:bg-slate-200 p-2 rounded-sm"  >
                    <Link
                      to={`/messenger/${evt.ID}`}
                      className="flex gap-2 items-center">
                      <TicketCheck className="w-5 h-5 text-[#2a0e5e]" />
                      {evt?.title}
                    </Link>
                    <div>
                      <Trash2
                        className="w-5 h-5 text-[#2a0e5e]"
                        onClick={() => handleDeleteSortie(evt?.ID)}
                      />
                    </div>
                  </li>
                ))
              }

            </ul>
          </div>
        )
        }

        {
          activeSection === "inviteFriends" && (
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-[#2a0e5e] mb-4">
                Mes invitations
              </h3>
              <p className="text-gray-500">
                Partagez un lien d'invitation à vos amis pour les rejoindre sur
                notre plateforme.
              </p>
            </div>
          )
        }




      </main >
      <Footer />
    </div >
  );
}

export default Profile;
