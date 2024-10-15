/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

export const contextProvider = createContext()

export const ContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('user'))
    const [user, setUser] = useState(null)  // Start with null
    const [isLoading, setIsLoading] = useState(true)  // Track loading state
    const authorizationToken = `Bearer ${token}`
    const USER_URL = 'https://registration-process-yce2.vercel.app/api/user'
    // const USER_URL='http://localhost:8080/api/user'
    let isLoggedIn = !!token

    const userAuthentication = async () => {
        if (!token) return; 

        try {
            setIsLoading(true)
            const response = await axios.get(`${USER_URL}/user`, {
                headers: {
                    Authorization: authorizationToken
                }
            })
            if (response.status === 200) {
                const userdata = response.data.userData
                setUser(userdata)  // Set user data
            } else {
                console.log("Error fetching user data")
            }
            
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)  // Set loading to false after fetching
        }
    }

    useEffect(() => {
        userAuthentication()
    }, [token])

    return (
        <contextProvider.Provider value={{ USER_URL, isLoggedIn, token, setToken, authorizationToken, user, setUser,isLoading, setIsLoading }} >
            {props.children}
        </contextProvider.Provider>
    )
}

export const useAuth = () => {
    const authValue = useContext(contextProvider)
    if (!authValue) {
        throw new Error('useAuth must be used within the ContextProvider')
    }
    return authValue
}
