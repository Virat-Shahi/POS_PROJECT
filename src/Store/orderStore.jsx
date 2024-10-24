import axios from "axios";
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const orderStore = create(persist((set, get) => ({
    tableOrders: {},
    currentOrderId: null,

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
            console.log(resp.data)

            // Update the currentOrderId with the new order ID
            set({ currentOrderId: resp.data.id })

            return resp.data

        } catch (error) {
            console.log(error)
        }
    },
    SetCurrentOrderId: (currentOrderId) => {
        set(state => (currentOrderId ? { currentOrderId } : { currentOrderId: null }));
    },

    actionUpdateOrder: async (token, orderId, tableId, updatedItems) => {
        try {
            const resp = await axios.put(
                `http://localhost:3000/orders/${orderId}`,
                {
                    tableId,
                    order: JSON.stringify(updatedItems)  // Send everything and let backend handle it
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update local state if successful
            if (resp.data) {
                set(state => ({
                    tableOrders: {
                        ...state.tableOrders,
                        [tableId]: updatedItems
                    }
                }));
            }

            return resp.data;
        } catch (error) {
            console.log("error updating order:", error);
            throw error;
        }
    },

    actionDeleteOrder: async (token, orderId, tableId) => {
        try {
            const resp = await axios.delete(`http://localhost:3000/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("Delete Order Response", resp.data)

            // reset the table order
            get().resetTableOrder(tableId);
        } catch (error) {
            console.log("Error deleting order:", error)
            throw error
        }
    },
    removeItem: (tableId, itemId) => {
        set(state => ({
            tableOrders: {
                ...state.tableOrders, [tableId]: state.tableOrders[tableId].filter(el => el.id !== itemId)
            }
        }))
    },
    resetTableOrder: (tableId) => {
        set(state => ({
            tableOrders: {
                ...state.tableOrders,
                [tableId]: []
            },
            currentOrderId: null

        }));
    },
    getOrders: async (token) => {
        try {
            const resp = await axios.get("http://localhost:3000/orders", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return resp.data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    },
    initiatePayment: async (tableId, orderId, paymentMethod, amount) => {
        try {
            const resp = await axios.post("http://localhost:3000/payment/initiate", {
                orderId,
                paymentMethod,
                amount
            })
            console.log(resp.data)
            set(state => ({
                tableOrders: {
                    ...state.tableOrders, [tableId]: state.tableOrders[tableId].map(el =>
                        el.id === orderId ? { ...el, paymentStatus: "Processing" } : el
                    )
                }
            }));
            return resp.data.payment.id
        } catch (error) {
            console.log(error)
        }
    },

    processPayment: async (tableId, orderId, paymentId) => {
        console.log(paymentId)

        try {
            console.log("Processing Payment with IDs", paymentId)

            if (!paymentId) {
                console.log("Invalid payment ID")
            }
            const resp = await axios.post(`http://localhost:3000/payment/process/${paymentId}`);
            console.log(resp.data)

            if (resp.data.status === "Completed") {
                set(state => ({
                    tableOrders: {
                        ...state.tableOrders, [tableId]: state.tableOrders[tableId].map(el =>
                            el.id === orderId ? { ...el, paymentStatus: "Completed" } : el
                        )
                    },
                    currentOrderId: null
                }))
            }

            get().resetTableOrder(tableId)
            return true;



        } catch (error) {
            console.error("Error processing payment:", error);

            set(state => ({
                tableOrders: {
                    ...state.tableOrders, [tableId]: state.tableOrders[tableId].map(el =>
                        el.id === orderId ? { ...el, paymentStatus: "Failed" } : el
                    )
                }
            }))
        }
    },


}), {
    name: 'orderStore',
    storage: createJSONStorage(() => localStorage)
}))

export default orderStore



