import { ConfigureStoreOptions, configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

export interface Todo {
    id?: number;
    title: string;
    completed: boolean;
}

interface TodosState {
    todos: Todo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | undefined;
}

const initialState: TodosState = {
    todos: [],
    status: 'idle',
    error: undefined,
};

const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await axios.get('/todos');
    return response.data;
})
  
const createTodo = createAsyncThunk<any, Todo>('todos/createTodo',
    async (initialTodo) => {
        const response = await axios.post('/todos', initialTodo);
        return response.data;
    }
)

const deleteTodo = createAsyncThunk<any, number>('todos/deleteTodo',
    async (id) => {
        await axios.delete(`todos/${id}`);
        return id;
    }
)

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    selectors: {
        selectTodos: state => state.todos,
        selectStatus: state => state.status,
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchTodos.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchTodos.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Add any fetched posts to the array
            state.todos = action.payload;
        })
        .addCase(fetchTodos.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(createTodo.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(createTodo.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.todos.push(action.payload)
        })
        .addCase(deleteTodo.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(deleteTodo.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        })
        .addCase(deleteTodo.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    }
});



export const createStore = (
    options?: ConfigureStoreOptions['preloadedState'] | undefined,
    ) =>
    configureStore({
        reducer: {
            "todos": todosSlice.reducer,
        }
    });

export const store = createStore();
    
export { fetchTodos, createTodo, deleteTodo };
export const { selectTodos, selectStatus } = todosSlice.selectors;

export type AppDispatch = typeof store.dispatch