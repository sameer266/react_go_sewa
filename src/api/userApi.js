
import api from "./JwtConfig"

const Base_URL= process.env.REACT_APP_BASE_URL;
const refreshToken = localStorage.getItem("refresh_token")



// ======= User Dashboard Api =============
const UserDashboardAPi = async()=>{

    try{

        const response = await api.get("api/user_dashboard/");
        return response.data;
    }
    catch(error){
        console.log("Error in user dashboard",error.response.data)
    }
}

// ======== User Profile Api ============
const UserProfileApi= async()=>{

    try{
        const response = await api.get("api/user_profile/");
        return response.data;

    }
    catch(error){
        console.log("Error in user profile",error.response.data)
    }
}

// ======== User Profile Update Api ============
const UserProfileUpdateApi= async(data)=>{

    try{
        const response = await api.patch("api/user_profile_update/",data);
        return response.data;

    }
    catch(error){
        console.log("Error in user profile update",error.response.data)
    }
}


// ========= User Bookings  ============
const UserBookingsApi = async ()=>{
    try {
        const response = await api.get('api/user_booking_list/')
        return response.data;
        
    } catch (error) {
        console.log("error in fetching User bookings")
    }
}


// =========== Users Payment History =========
const UserPaymentHistoryApi = async ()=>{
    try {
        const response = await api.get('api/payment_history/')
        return response.data;
    } catch (error) {
        console.log("error in fetching the payment hsitory")

        
    }
}



export 
{
    UserDashboardAPi,

    // User Profile
    UserProfileApi,
    UserProfileUpdateApi,

    // Schedule or Tickets
    UserBookingsApi,

    // Payment
    UserPaymentHistoryApi,
}