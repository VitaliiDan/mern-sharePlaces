import {useCallback, useEffect, useState} from "react";

let logOutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDay = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDay);
        localStorage.setItem('userData', JSON.stringify({
            token: token,
            userId: uid,
            expiration: tokenExpirationDay.toISOString()
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData')
    }, [])

    useEffect(()=>{
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
            logOutTimer = setTimeout(logout, remainingTime)
        } else {
            clearTimeout(logOutTimer)
        }
    },[token, logout, tokenExpirationDate])

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'))
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login])

    return {token, login, logout, userId}
}