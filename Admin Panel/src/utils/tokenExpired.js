import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";

const tokenExpired = (token) => {
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    secureLocalStorage.removeItem("roleid");
    secureLocalStorage.removeItem("userId");
    secureLocalStorage.removeItem("accessToken");
    secureLocalStorage.removeItem("refreshToken");

    return true;
  }
  return false;
};

export default tokenExpired;
