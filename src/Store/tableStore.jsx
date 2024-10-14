import axios from "axios";
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'


const tableStore = create(persist((set) => ({
    tables: [],
    actionGetTables: async () => {
        try {
            const resp = await axios.get("http://localhost:3000/table")
            set({ tables: resp.data })
        } catch (error) {
            console.log("Error fetching tables", error)
        }
    },
    actionUpdateTable: async (tableId, isOccupied) => {
        try {
            const updateResponse = await axios.put(`http://localhost:3000/table/${tableId}`, { isOccupied });
            console.log("Update response:", updateResponse.data);
            
            // After updating, fetch all tables again
            const fetchResponse = await axios.get("http://localhost:3000/table");
            console.log("Fetched tables after update:", fetchResponse.data);
            set({ tables: fetchResponse.data });
        } catch (error) {
            console.log("Error updating table", error)
        }
    }
})))

export default tableStore