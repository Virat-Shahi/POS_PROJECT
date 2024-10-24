import axios from "axios";
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

const menuStore = create(persist((set) => ({
    menuItems : [],
    categories : [],
    actionMenu : async () => {
        try {
            const resp = await axios.get("http://localhost:3000/menu")
            set({menuItems:resp.data})
        } catch (error) {
            console.log("Error fetching menu items",error)
        }
    },
    actionDeleteMenu : async (id) => {
        try {
            const resp = await axios.delete(`http://localhost:3000/menu/${id}`)
            set(state => ({menuItems:state.menuItems.filter(item => item.id !== id)}))
            console.log(resp)
        } catch (error) {
            console.log("Error deleting menu item",error)
        }
    },
    actionAddmenu : async (input) => {
        try {
            const resp = await axios.post('http://localhost:3000/menu',input)
            set(state => ({menuItems:[...state.menuItems,resp.data]}))
// this line is creating a new state where the menuItems array contains all the previous menu items plus the newly added item at the end.
        } catch (error) {
            console.log("Error adding menu item",error)
        }
    },
    actionUpdateMenu: async (id, input) => {
        try {
            const resp = await axios.put(`http://localhost:3000/menu/${id}`, input)
            set(state => ({
                menuItems: state.menuItems.map(item => 
                    item.id === id ? resp.data : item
                )
            }))
        } catch (error) {
            console.log("Error updating menu item", error)
        }
    },
    getCategories : async () => {
        try {
            const resp = await axios.get(" http://localhost:3000/category")
            set({categories:resp.data})
        } catch (error) {
            console.log("Error fetching category items",error)
        }
    },
})))

export default menuStore