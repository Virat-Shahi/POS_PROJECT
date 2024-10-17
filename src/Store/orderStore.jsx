import axios from "axios";
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const orderStore = create(persist((set) => ({
    tableOrders: {},

    addToOrder: (tableId, item) => {
        set(state => {
            if (!state.tableOrders[tableId]) {
                state.tableOrders[tableId] = []
            }
            const existingItemIndex = state.tableOrders[tableId].findIndex(el => el.id === item.id)

            if (existingItemIndex === -1) {
                return {
                    tableOrders: {
                        ...state.tableOrders,
                        [tableId]: [...state.tableOrders[tableId], { ...item, quantity: 1 }]
                    }
                }
            } else {
                return {
                    tableOrders: {
                        ...state.tableOrders,
                        [tableId]: state.tableOrders[tableId].map((el, index) =>
                            index === existingItemIndex ? { ...el, quantity: el.quantity + 1 } : el
                        )
                    }
                }
            }
        })
    },


    increaseQuantity: (tableId, itemId) => {
        set(state => ({
            tableOrders: {
                ...state.tableOrders, [tableId]: state.tableOrders[tableId].map(el =>
                    el.id === itemId ? { ...el, quantity: el.quantity + 1 } : el
                )
            }
        }));
    },


    decreaseQuantity: (tableId, itemId) => {
        set(state => ({
            tableOrders: {
                ...state.tableOrders, [tableId]: state.tableOrders[tableId].map(el =>
                    el.id === itemId && el.quantity > 1 ? { ...el, quantity: el.quantity - 1 } : el
                ).filter(el => el.quantity > 0)
            }
        }));
    },

    actionCreateOrder: async (token, tableId, order) => {
        try {
            console.log(token)
            const data = JSON.stringify(order)
            const resp = await axios.post("http://localhost:3000/orders", { tableId, order: data }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(resp)
        } catch (error) {
            console.log(error)
        }
    },

    removeItem: (tableId, itemId) => {
        set(state => ({
            tableOrders: {
                ...state.tableOrders, [tableId]: state.tableOrders[tableId].filter(el => el.id !== itemId)
            }
        }))
    },
    resetOrder: () => {
        set({ orderItems: [] })
    },

    processPayment: async (tableId, orderId, paymentMethod, amount) => {
        try {
            const response = await axios.post("http://localhost:3000/payment", {
                orderId,
                paymentMethod,
                amount
            });
            console.log("Payment response:", response.data);
            // return response.data;
        } catch (error) {
            console.error("Error processing payment:", error);
            return { error: error.message };
        }
    },

}), {
    name: 'orderStore',
    storage: createJSONStorage(() => localStorage)
}))

export default orderStore



