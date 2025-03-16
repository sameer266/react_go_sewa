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

const FilterSchedule = async (source, destination, date) => {
    try {
        const response = await axios.get(`${Base_URL}api/filter_schedule/`, {
            params: {
                source: source,
                destination: destination,
                departure_time: date
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error in Filtering schedule:", error.response?.data || error.message);
        return { success: false, error: error.response?.data?.error || "Unknown error" };
    }
};

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

const AllReviewsApi = async ()=>{
    try {
        const response = await axios.get(`${Base_URL}api/all_reviews/`)
        return response.data
    } catch (error) {
        console.log("error in fetching revews data ",error.response.data)
        
    }
}



export   {

    // landing page
    LoginAPi,
    LogoutApi,
    ResgisterApi,
    AllRoutesApi,
    FilterSchedule,
    AllScheduleApi,
    PopularRoutesApi,
    AllReviewsApi,

    };