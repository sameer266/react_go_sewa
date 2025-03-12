import axios from "axios"
import api from "./JwtConfig"

const Base_URL='http://127.0.0.1:8000/'
const refreshToken = localStorage.getItem("refresh_token")



// ======= Authentication APi =============
const LoginAPi= async(phone , password)=>{

    try{
        const response = await api.post("api/login/",
            {
                phone,
                password
            }
        );
        return response.data;

    }
    catch(error){
        console.log("Error in login",error.response.data)
    }
}

const LogoutApi= async ()=>{

    try{

const response= await api.post("api/logout/",
    {refresh:refreshToken}
);
        return response.data;
    }
    catch(error){

        console.log("error in logout",error)
    }
}


const ResgisterApi= async (data)=>{

    try{
        const response = await api.post("api/register/",
            {data}
        );
        return response.data

        
    }
    catch(error){

        console.log("Error in registering user ", error.response.data)
    }
}


// ===== Home Page  Api ============
const AllRoutesApi=async ()=>{
    try {
        const response=  await axios.get(`${Base_URL}api/all_routes/`
            
        )
        return response.data;

    } catch (error) {
        
        console.log("error in  fetching all routes data ", error.response.data)
    }
}

const AllScheduleApi= async ()=>{
    try {
        const response = await axios.get(`${Base_URL}api/all_schedule/`)
        return response.data
    } catch (error) {
        console.log("Error in fetching  all schedule data ",error.response.data)
        
    }
}

const PopularRoutesApi= async ()=>{

    try {
        const response= await axios.get(`${Base_URL}api/popular_routes/`)
        return response.data
    } catch (error) {
        
    }
}

export   {

    // landing page
    LoginAPi,
    LogoutApi,
    ResgisterApi,
    AllRoutesApi,
    AllScheduleApi,
    PopularRoutesApi

    };