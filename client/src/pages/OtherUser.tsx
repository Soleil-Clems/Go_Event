import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../hooks/authContext";
import {
    User,
    Calendar,
    Mail,
    TicketCheck,
    NotebookText
} from "lucide-react";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios"
import {Link, useParams } from "react-router-dom";

function OtherUser() {
    const { id } = useParams<{ id:string }>();
    const [activeSection, setActiveSection] = useState("personalInfo");

    const { user } = useContext(AuthContext);
    const [other, setOther]= useState<any>(null)
    const [sortie, setSortie] = useState<any | []>([])
    const [desc, setDesc] = useState('');
    useEffect(() => {
        if (other) {
            fetchSortie()
        }
    }, [other]);

    useEffect(() => {
        if (sortie.length > 0) {

            // console.log(sortie)
        }
    }, [sortie])


    useEffect(() => {
        const fetchUserInfo: any = async () => {
            let url=`http://localhost:4242/api/users/${id}`
            try {
                const response: any = await axios.get(url,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':`Bearer ${user.token}`
                      },
                })
              
                if (response.status == 200) {

                    setOther(response.data)

                }

            } catch (error) {
                console.log(error, url)
                
            }

        }
        fetchUserInfo()
    }, [id])

    useEffect(()=>{
        if(other){
            // console.log(other)
        }
    },[other])


  
    const fetchSortie: any = async () => {
        try {
            const response: any = await axios.get(`http://localhost:4242/api/sorties/me/${other?.ID}`)

            if (response.data.message == "success") {

                setSortie(response.data.data)
                console.log(response.data.data)

            }

        } catch (error) {
            console.log(error)
            setSortie([])
        }

    }


   



    return (
        <div className="min-h-screen flex flex-col bg-gray-300">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">

                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img
                                src={other?.avatar || Logo}
                                alt="Avatar"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-[#2a0e5e]">
                                    {other?.pseudo || "Nom d'utilisateur"}
                                </h2>
                                <p className="text-gray-500">{other?.email || "Email utilisateur"}</p>
                            </div>
                        </div>
                       
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 sm:mb-6 justify-center">
                    <button
                        onClick={() => setActiveSection("personalInfo")}
                        className={`${activeSection === "personalInfo" ? "bg-[#c34242]" : "bg-[#c34242]"
                            } text-white py-2 px-4 rounded-lg shadow-lg flex justify-center items-center space-x-2 hover:bg-[#ff5757] transition duration-300`}
                    >
                        <User className="w-5 h-5" />
                        <span className="text-sm sm:text-base">Ses infos</span>
                    </button>
                    <button
                        onClick={() => setActiveSection("events")}
                        className={`${activeSection === "events" ? "bg-[#c34242]" : "bg-[#c34242]"
                            } text-white py-2 px-4 rounded-lg shadow-lg flex justify-center items-center space-x-2 hover:bg-[#ff5757] transition duration-300`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm sm:text-base">Ses événements</span>
                    </button>
                  
                </div>


                {activeSection === "personalInfo" && (
                    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#2a0e5e] mb-4">
                            Ses informations
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <User className="text-[#2a0e5e] w-5 h-5 mr-2" />
                                <p className="text-gray-500">Nom :  {other?.pseudo || "Nom d'utilisateur"}</p>
                            </div>
                            <div className="flex items-center">
                                <Mail className="text-[#2a0e5e] w-5 h-5 mr-2" />
                                <p className="text-gray-500">Email : {other?.email || "Email d'utilisateur"}</p>
                            </div>
                            <div className="flex items-center">
                                <NotebookText className="text-[#2a0e5e] w-5 h-5 mr-2" />
                                <p className="text-gray-500">Description : {other?.description || "Description d'utilisateur"}</p>
                            </div>
                           
                        </div>
                    </div>
                )}

                {activeSection === "events" && (
                    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#2a0e5e] mb-4">
                            Ses événements
                        </h3>
                        <ul className="space-y-2">
                            {

                                sortie.map((evt: any, index: number) => (
                                    <li key={index} className="flex justify-between hover:bg-slate-200 p-2 rounded-sm"  >
                                        <Link
                                           to={`/sorties/${evt?.ID}`}
                                            className="flex gap-2 items-center">
                                            <TicketCheck className="w-5 h-5 text-[#2a0e5e]" />
                                            {evt?.title}
                                        </Link>
                                       
                                    </li>
                                ))
                            }

                        </ul>
                    </div>
                )
                }

              




            </main >
            <Footer />
        </div >
    );
}

export default OtherUser;
