import axios from "axios";
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const orderStore = create(persist((set, get) => ({
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
            console.log(resp.data)

            //store the new orderId

            return resp.data

        } catch (error) {
            console.log(error)
        }
    },
    actionUpdateOrder: async (token, orderId, tableId, updatedItems) => {
        try {
            console.log("Updating order:", { orderId, tableId, updatedItems });
            const orderItemsForBackend = updatedItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const data = JSON.stringify(orderItemsForBackend);
            console.log("Sending data to backend:", data);

            const resp = await axios.put(`http://localhost:3000/orders/${orderId}`,
                { tableId, order: data },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Update response:", resp.data);

            set(state => ({
                tableOrders: {
                    ...state.tableOrders,
                    [tableId]: updatedItems
                }
            }));

            return resp.data;
        } catch (error) {
            console.error("Error updating order:", error.response ? error.response.data : error.message);
            throw error;
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

        }));
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
                    }
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



