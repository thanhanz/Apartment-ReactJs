import { Outlet, Navigate } from "react-router-dom";


const ProtectedRoute = () => {

    const token = localStorage.getItem('access_token')
    console.log("Token is: ", token)
    return (
        token ? <Outlet/> : <Navigate to="/login" />
    )
}
export default ProtectedRoute;