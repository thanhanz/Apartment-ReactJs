import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../config/Contexts";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/AxiosConfig";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {user, dispatch}  = useContext(AuthContext); // Dùng AuthContext
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://127.0.0.1:8000/o/token/", {
                username: username,
                password: password,
                client_id: "3xKC0lvyq2A5MwbyHBmwNwHPhy8NP2mzWU0ORkcD",
                client_secret: "VBqr4UUne4r2sFHeb5iUajUyMeLHwfVgi7F3F3Qrnv5hP2aDpLXGPw4eFQhWyixrbFMiFq5lYYtfh6cTKQ3tCZyojMuXHJVebIpZ813XvmOQCFWBjKDEgFgbAzg5VLoA",
                grant_type: "password",
            });

            // Lưu token vào localStorage
            await localStorage.setItem("access_token", res.data.access_token);

            // Gọi API để lấy thông tin user
            const user = await AxiosInstance.get("http://127.0.0.1:8000/users/current-user/");
            
            console.log("User: ", user.data)
            // Cập nhật Context
            dispatch({
                type: "LOGIN",
                payload: user.data, // user.data chứa thông tin người dùng
            });

            alert("Đăng nhập thành công!");
            navigate("/home"); // Điều hướng đến trang chủ
        } catch (e) {
            console.error("Lỗi đăng nhập:", e);
            alert("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản.");
        } finally {
            
        }
    };

return (

    <Container component="main" maxWidth="sm">
        <Box
            sx={{
                boxShadow: 3,
                borderRadius: 2,
                px: 4,
                py: 6,
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography component="h1" variant="h8">
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password} // ✅ Liên kết state
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
            </Box>
        </Box>
    </Container>




    // {/* {user ? (
    //     <>
    //         <h3>Xin chào, {user.username}!</h3>
    //         <button onClick={handleLogout}>Đăng xuất</button>
    //     </>
    // ) : (
    //     <>
    //         <h2>Đăng nhập</h2>
    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label>Tên đăng nhập:</label>
    //                 <input
    //                     type="text"
    //                     value={username}
    //                     onChange={(e) => setUsername(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Mật khẩu:</label>
    //                 <input
    //                     type="password"
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <button type="submit">Đăng nhập</button>
    //         </form>
    //     </>
    // )} */}

    );
};

export default Login;
