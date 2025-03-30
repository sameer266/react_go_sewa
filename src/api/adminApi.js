import axios from "axios"
import api from "./JwtConfig"

const Base_URL= process.env.REACT_APP_BASE_URL;
const refreshToken = localStorage.getItem("refresh_token")


// ===== Admin Dashboard data ======

const AdminDashboardApi=async ()=>{
    try {
        const response = await api.get(`api/admin_dashboard/`)
        return response.data
    } catch (error) {
        console.log("error in fetching data ", error.response.data)
        
    }
}


// ===== Admin Profile  ========
const AdminProfileApi= async ()=>{

    try {
        const response  = await api.get('api/admin_profile')
        return response.data
    } catch (error) {
        console.log("error in  fetching Admin profile data",error.response.data)
        
    }
}


const AdminUpdateProfile = async (data)=>{
    try {
        const response = await api.patch('api/admin_profile_update/',
            data
        )
        return response.data
    } catch (error) {
        console.log("error in  updating admin profile data",error.response.data)
        
    }
}

//========= Ticket Counter All data ===========

const AdminTicketCounterApi= async ()=>{

try {
    const response= await api.get('api/admin_ticketcounter/')
    return response.data;
} catch (error) {
    console.log("error in fetching conterTicket data",error.response.data)
}
}

const AdminTicketCounterAdd= async (data)=>{
    try {
        const response = await api.post('api/admin_ticketcounter_add/',
            data
        )
        return response.data;

        
    } catch (error) {
        console.log("error in fetching adding TicketCounter",error.response.data)
    }
}


const AdminTicketCounterUpdate = async (id,data)=>{
    try{
    const response = await api.patch(`api/admin_ticketcounter_update/${id}/ ` ,
        data
    )
    return response.data
}
catch(error){
    console.log("error in updating ticket counter data")
}
}

const AdminTicketCounterDelete= async (id)=>{
    try {
        const response = await api.delete(`api/admin_ticketcounter_delete/${id}/`)
        return response.data
    } catch (error) {
        console.log("error in Deleteing ticket counter data")
        
    }
}


// ==================
//  User Management 
// ==================

const AdminUserList= async ()=>{
    try {
        const response = await api.get('api/admin_userlist/')
        return response.data
        
    } catch (error) {
        console.log("Error in  fetching Users list",error.response.data)
    }
}
 


const AdminUserUpdate = async (id,data)=>{
    try {
        const response = await api.patch(`api/admin_userlist_update/${id}/`,
            data
        )
        return response.data;
        
    } catch (error) {
        console.log("error in updating user data ",error.response.data)
        
    }
}



const AdminUserDelete = async (id)=>{
    try {
        const response = await api.delete(`api/admin_userlist_delete/${id}/`)
        return response.data;

    } catch (error) {
        console.log("Error in deleting user", error.response.data)
    }
}


// ===============
// Driver Management 
// ===============

const  DriverListApi= async ()=>{
    try {

        const response = await api.get('api/admin_driverlist/')
        return response.data;
    }
    catch(error){
        console.log("error in fetching driver data",error.response.data)
        
    }
}


const DriverAddApi= async (data)=>{
    try {
        const response = await api.post('api/admin_driverlist_add/',data,
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
        )

        return response.data;
    }
    catch(error){
        console.log("error in adding driver data",error.response.data)
    }
}


const DriverUpdateApi= async (id,data)=>{
    try {
        const response = await api.patch(`api/admin_driverlist_update/${id}/`,data<
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
        )
        return response.data;
    }
    catch(error){
        console.log("error in updating driver data",error.response.data)
    }
}

const DriverDeleteApi= async (id)=>{
    try {
        const response = await api.delete(`api/admin_driverlist_delete/${id}/`)
        return response.data;
    }
    catch(error){
        console.log("error in deleting driver data",error.response.data)
    }
}


// ==============
// Staff Managment 
// ===============

const StaffListApi= async ()=>{
    try{

        const response = await api.get('api/admin_stafflist/')
        return response.data;
    }
catch(error){
    console.log("error in fetching staff data",error.response.data)

}
}

const StaffAddApi= async (data)=>{
    try {
        const response = await api.post('api/admin_stafflist_add/',data,
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
        )
        return response.data;
    }
    catch(error){
        console.log("error in adding staff data",error.response.data)
    }
}

const StaffUpdateApi= async (id,data)=>{
    try {
        const response = await api.patch(`api/admin_stafflist_update/${id}/`,data,
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
        )
        return response.data;
    }
    catch(error){
        console.log("error in updating staff data",error.response.data)
    }
}   

const StaffDeleteApi= async (id)=>{
    try {
        const response = await api.delete(`api/admin_stafflist_delete/${id}/`)
        return response.data;
    }
    catch(error){
        console.log("error in deleting staff data",error.response.data)
    }}


// =============== 
// Bus Managemnet 
// ================

const AdminBusListApi =async ()=>{

    try {
        const response = await api.get('api/admin_buslist/')
        return response.data
        
    } catch (error) {
        console.log("error in fetching bus data ", error.response.data)
        
    }
}


const AdminBusAddApi= async (data)=>{
    console.log('data',data)

    try {
        const response = await api.post('api/admin_buslist_add/',
            data,
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
                
            }
        )
        return response.data;
        
    } catch (error) {
        console.log("error in fetching admin bus ",error.response.data)
        return error.response.data
    }
}

const AdminBusUpdateApi = async (id,data)=>{

    try {
        const response  = await api.patch(`api/admin_buslist_update/${id}/`,
            data
        )
        return response.data
        
    } catch (error) {
        console.log("error in  updating bus data ",error.response.data)
    }
}


const AdminBusDeleteApi = async (id)=>{

    try {
        const response = await api.delete(`api/admin_buslist_delete/${id}/`)
        return response.data
    } catch (error) {
        console.log("error in deleting bus data ",error.response.data)
    }
}


// =============== 
// Schedule Management 
// ================

const AdminScheduleListApi = async () => {
    try {
        const response = await api.get('api/admin_schedulelist/')
        return response.data
    } catch (error) {
        console.log("error in fetching schedule data", error.response.data)
    }
}

const AdminScheduleAddApi = async (data) => {
    try {
        const response = await api.post('api/admin_schedulelist_add/', data)
        return response.data
    } catch (error) {
        console.log("error in adding schedule", error.response.data)
    }
}

const AdminScheduleUpdateApi = async (id, data) => {
    try {
        const response = await api.patch(`api/admin_schedulelist_update/${id}/`, data)
        return response.data
    } catch (error) {
        console.log("error in updating schedule", error.response.data)
    }
}

const AdminScheduleDeleteApi = async (id) => {
    try {
        const response = await api.delete(`api/admin_schedulelist_delete/${id}/`)
        return response.data
    } catch (error) {
        console.log("error in deleting schedule", error.response.data)
    }
}


// ======== Route Managemnet ==========

const AdminRouteListAPi= async ()=>{
    try {
        const response = await api.get('api/admin_routelist/')
        return response.data
    } catch (error) {
        console.log("error in fetching route data")

        
    }
}

const AdminRouteAddApi= async (data)=>{
    try {
        const response = await api.post('api/admin_routelist_add/',
            data
        )
        return response.data
        
    } catch (error) {
        console.log("error in Adding admin route ",error.response.data)
    }
}


const AdminRouteUpdateApi = async (id,data)=>{

    try {
        const response = await api.patch(`api/admin_routelist_update/${id}/`,
            data
        )
        return response.data
        
    } catch (error) {
        console.log("error in updating route ", error.response.data)
    }
}


const AdminRouteDeleteApi = async (id)=>{
    try {
        const response = await api.delete( `api/admin_routelist_delete/${id}/`)
        return response.data
    } catch (error) {
        console.log("error in deleting route data", error.response.data)
        
    }
}

// =============== 
// Booking Management 
// ================

const AdminBookingListApi = async () => {
    try {
        const response = await api.get('api/admin_bookinglist/')
        return response.data
    } catch (error) {
        console.log("error in fetching booking data", error.response.data)
    }
}

const AdminBookingUpdateApi = async (id, data) => {
    try {
        const response = await api.patch(`api/admin_bookinglist_update/${id}/`, data)
        return response.data
    } catch (error) {
        console.log("error in updating booking", error.response.data)
    }
}


// =============
// Reservation
// =============

const AdminVehicleReservationListApi = async ()=>{

    try {
        const response = await api.get('api/admin_vehiclereservationlist/')
        return response.data
    } catch (error) {
        console.log("error in fetching Reservation data")
    }
}


const AdminVehicleReservationAddApi = async (data)=>{
    console.log("form data",data)
    try {
        const response =await api.post('api/admin_vehiclereserve_add/',
            data
        )
        return response.data
    } catch (error) {
        console.log("error in addming reservation data")
    }
}


const AdminVehicleReservationUpdateApi = async (id,data)=>{
    try {
        const response =await api.patch(`api/admin_vehiclereserve_update/${id}/`,
            data
        )
        return response.data
    } catch (error) {
        console.log("error in updating the reservation data")
        
    }
}

const AdminVehicleReservationDeleteApi = async (id)=>{
    try {
        const response = await api.delete(`api/admin_vehiclereserve_delete/${id}/`)
        return response.data
    } catch (error) {
        console.log("error in deleting the reservation data")
        
    }
}


// ==================
// Payment
// ==================

const AdminPaymentListApi=async ()=>{

    try {
        const response = await api.get(`api/admin_paymentlist/`)
        return response.data;
        
    } catch (error) {
        console.log("error in fetching paymnet data", error.response.data)
    }
}

// ===========
// Rate
// ===========

const AdminRateUpdateApi= async (id,data)=>{
    try {
        const response = await api.patch(`api/admin_rate_add/${id}/`,
            data
        )
        return response.data;
        
    } catch (error) {
        console.log('error in Updating Admin Rate ')
    }
}


// ============
//Report
// =============

const AdminReportlist= async ()=>{
    try {
        const response = await api.get('api/admin_reportlist/')
        return response.data;
        
    } catch (error) {
        console.log("error in fetching admin report data")
    }
}

// ===========
// Settings 
// ===========

const AdminSettingsLists = async()=>{
    try {
        const response = await api.get('api/admin_settings/')
        return response.data;
    } catch (error) {
        console.log("error in fetching Settings")

    }

}

const AdminSettingsUpdate = async (id,data)=>{

    try {
        const response = await api.patch(`api/admin_settings_update/${id}/`,
        data,
        {
            headers:{
            'Content-Type':'multipart/format-data'

        }
    });
        return response.data;
    } catch (error) {
        console.log("Error in updating the Settigs data")
        
    }
}





export { AdminDashboardApi,

        // Profile
        AdminProfileApi,
        AdminUpdateProfile,

        // counter
        AdminTicketCounterApi,
        AdminTicketCounterAdd,
        AdminTicketCounterUpdate,
        AdminTicketCounterDelete,

        // User
        AdminUserList,
        AdminUserUpdate,
        AdminUserDelete,

        // Staff 
        StaffListApi,
        StaffAddApi,
        StaffUpdateApi
        ,StaffDeleteApi,

        // Driver
        DriverListApi,
        DriverAddApi,
        DriverUpdateApi,
        DriverDeleteApi,


        // Bus
        AdminBusListApi,
        AdminBusAddApi,
        AdminBusUpdateApi,
        AdminBusDeleteApi,

        // Schedule
        AdminScheduleListApi,
        AdminScheduleAddApi,
        AdminScheduleDeleteApi,
        AdminScheduleUpdateApi,

        // Route
        AdminRouteListAPi,
        AdminRouteAddApi,
        AdminRouteUpdateApi,
        AdminRouteDeleteApi,

        // Booking
        AdminBookingListApi,
        AdminBookingUpdateApi,

        // Reservation
        AdminVehicleReservationListApi,
        AdminVehicleReservationAddApi,
        AdminVehicleReservationUpdateApi,
        AdminVehicleReservationDeleteApi,

        // Payment 
        AdminPaymentListApi,

        // Rate
        AdminRateUpdateApi,

        // Report
        AdminReportlist,

        // Settings
        AdminSettingsLists,
        AdminSettingsUpdate,
 } ;
