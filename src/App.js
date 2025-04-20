import React from "react";
import Sider from "./layout/Sider";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import About from "./components/About";
import Login from "./components/APIs/Login";
import MonthlyFee from "./components/APIs/MonthlyFeePayment";
import Packages from "./components/APIs/Package";
import Surveys from "./components/APIs/Survey";
import Feedback from "./components/APIs/Feedback";
import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {

  const location = useLocation()
  const noNavBar = location.pathname === "/login"

  return (

    <>

      {
        noNavBar ?
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>

          :

          <Sider
            content={
              <Routes>
                <Route element={<ProtectedRoute/>}>              
                  <Route path="/feedbacks" element={<Feedback />} />
                  <Route path="/locker/packages" element={<Packages />} />
                  <Route path="/monthly-fee" element={<MonthlyFee />} />
                  <Route path="/surveys" element={<Surveys />} />
                </Route>
              </Routes>
            }
          />



      }

    </>
  )
};

export default App;
