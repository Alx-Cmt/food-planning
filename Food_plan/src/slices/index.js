import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    command: []
}

const dataSlice = createSlice ({
    name: "data",
    initialState,
    reducers: {
        add: (state, {payload}) => {
            state.command.push(payload)
        },
        
        clear: (state) => {
            state.command = []
        },

        remove: (state, {payload}) => {
            const index = state.command.findIndex(
                meal => meal.id === payload
            )

            if (index !== -1) {
                state.command.splice(index, 1)
            }
        }
    }
})

export const { add, clear, remove } = dataSlice.actions
export default dataSlice.reducer