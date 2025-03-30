import axios from "axios"
import api from "./JwtConfig"

const Base_URL='http://127.0.0.1:8000/'


// ======= Data For Navbar and Contact ====
const NavAndContactApi= async ()=>{
    try {
        const response = await axios.get(`${Base_URL}api/nav_contact/`)
        return response.data;
        
    } catch (error) {
        console.log("error in fetching data")
    }
}

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
        const refreshToken = localStorage.getItem("refresh")
        
const response= await api.post(`api/logout/`,
    {refresh:refreshToken}
);
        return response.data;
    }
    catch(error){

        console.log("error in logout",error)
    }
}


const ResgisterApi= async (fullname,phone)=>{
    const data = {
        full_name:fullname,
        phone:phone
    }
    try{
        const response = await api.post("api/send_otp/",
            data
        );
        return response.data

        
    }
    catch(error){
        return error.response.data
    }
}

const VerifyOtpApi= async (otp)=>{
    let data=  {"otp":otp}
    try {
        const response = await api.post("api/verify_otp/",
            data 
        );
        return response.data;
        
    } catch (error) {
        console.log("error in verifying otp")
    }
}


// ====== Confirm password ============
const UserConfirmPassword= async(password)=>{
    const data={
        "password":password
    }

    try{
    const response = await api.post('api/register_user/',
        data
    )
    return response.data
    }
    catch(error){
        console.log("error in craeting a password")
    }
}

// ========= Resert password =========
const ResetPasswordApi = async (data)=>{

try{
    const response = await api.post(`${Base_URL}api/reset_password`,
        data
    )

    return response.data
}

catch(error){

    console.log("error in reseting password ")
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


const AllBusesApi = async ()=>{
    try {
        const response = await axios.get(`${Base_URL}api/all_buses/`)
        return response.data
    } catch (error) {
        
        console.log("error in fetching all buses ", error.response.data)
    }
}


// ======= bus list api ===========
const  AllRoutesBusesListApi = async (id)=>{

    try {
        const response = await axios.get(`${Base_URL}api/routes_all_buses/${id}/`)
        return response.data;
        
    } catch (error) {
        console.log("error in fetching the data")
    }
}

// ======= Bus Reservation ===========
const AllVechicleTypeList= async ()=>{
    try {
        const response = await axios.get(`${Base_URL}api/all_vechicle_type/`)
        return response.data;
    } catch (error) {
        console.log("Error in fetching the reservation bus list ")
    }
}

const VechicleList= async (id)=>{
    try {
        const response = await axios.get(`${Base_URL}api/vechicle_reservation/${id}/`)
        return response.data;
    } catch (error) {
        console.log("Error in fetching the reservation bus list ")
    }
}



// ============
// BUs layout 
// ============

const BusLayoutApi = async (id)=>{
    try {
        const response = await axios.get(`${Base_URL}api/admin_buslayout/${id}/`)
        return response.data;
    } catch (error) {
        console.log("error in fetching bus layout")
    }
}


export  {

    // Nav and Contact
    NavAndContactApi,

    // landing page
    LoginAPi,
    LogoutApi,
    ResgisterApi,
    VerifyOtpApi,
    UserConfirmPassword,
    ResetPasswordApi,

    AllRoutesApi,
    FilterSchedule,
    AllScheduleApi,
    PopularRoutesApi,
    AllReviewsApi,
    AllBusesApi,

    //  One routes buses list
    AllRoutesBusesListApi,

    // Bus Reservation
    AllVechicleTypeList,

    // bus layout
    BusLayoutApi,
    VechicleList
};
    