import axios from "axios"
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

const useUserStore = create(persist((set) => ({
    user : '',
    token: '', 
    actionRegister : async (input) => {
        try {
            const resp = await axios.post("http://localhost:3000/auth/register",input)
            console.log(resp)
        } catch (error) {
            console.log(error)
        }
        
    },


    actionLogin : async (input) => {
            const resp = await axios.post("http://localhost:3000/auth/login",input)
            set({token:resp.data.token , user:resp.data.user})
            console.log(resp.data.user)
    },
    actionLogout: () => {
        set({ user: null, token: '' })
    }
}),{
    name: 'userStore',
    storage: createJSONStorage(() => localStorage)
}))

const token = useUserStore.getState().token

if(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default useUserStore