import { createContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });

    // Kiểm tra xem user đã đăng nhập chưa khi load trang
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            dispatch({ type: "LOGIN", payload: JSON.parse(userData) });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
