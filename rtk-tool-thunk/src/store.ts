import { ConfigureStoreOptions, configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Todo {
    id?: number;
    title: string;
    completed: boolean;
}

// Define your API endpoints
const api = createApi({
    reducerPath: 'todosapi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
    endpoints: (builder) => ({
        getTodos: builder.query<Todo[], void>({
            query: () => 'todos',
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // `onStart` side-effect
                // dispatch(messageCreated('Fetching post...'))
                try {
                  const { data } = await queryFulfilled
                  // `onSuccess` side-effect
                  dispatch(setTodos(data))
                } catch (err) {
                  // `onError` side-effect
                //   dispatch(messageCreated('Error fetching post!'))
                }
              },
        }),
        createTodo: builder.mutation<Todo, Partial<Todo>>({
            query: (todo) => ({
                url: 'todos',
                method: 'POST',
                body: todo,
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // `onStart` side-effect
                // dispatch(messageCreated('Fetching post...'))
                try {
                  const { data } = await queryFulfilled
                  // `onSuccess` side-effect
                  dispatch(addTodo(data))
                } catch (err) {
                  // `onError` side-effect
                //   dispatch(messageCreated('Error fetching post!'))
                }
              },
        }),
        updateTodo: builder.mutation<Todo, Partial<Todo>>({
            query: (todo) => ({
                url: `todos/${todo.id}`,
                method: 'PUT',
                body: todo,
            }),
        }),
        deleteTodo: builder.mutation<void, number>({
            query: (id) => ({
                url: `todos/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // `onStart` side-effect
                // dispatch(messageCreated('Fetching post...'))
                if (!id) {
                    return;
                }
                try {
                    await queryFulfilled;
                  // `onSuccess` side-effect
                  dispatch(deleteTodo(id))
                } catch (err) {
                  // `onError` side-effect
                //   dispatch(messageCreated('Error fetching post!'))
                }
              },
        }),
    }),
});

interface TodosState {
    todos: Todo[];
}

const initialState: TodosState = {
    todos: [],
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setTodos: (state, action: PayloadAction<Todo[]>) => {
            state.todos = action.payload;
        },
        addTodo: (state, action: PayloadAction<Todo>) => {
            state.todos.push(action.payload);
        },
        updateTodo: (state, action: PayloadAction<Todo>) => {
            const updatedTodo = action.payload;
            const index = state.todos.findIndex((todo) => todo.id === updatedTodo.id);
            if (index !== -1) {
                state.todos[index] = updatedTodo;
            }
        },
        deleteTodo: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            state.todos = state.todos.filter((todo) => todo.id !== id);
        },
    },
    selectors: {
        selectTodos: state => state.todos,
    },
});


export default todosSlice.reducer;

export const createStore = (
    options?: ConfigureStoreOptions['preloadedState'] | undefined,
    ) =>
    configureStore({
        reducer: {
            // Add the generated reducer as a specific top-level slice
            [api.reducerPath]: api.reducer,
            "todos": todosSlice.reducer,
        },
        // Adding the api middleware enables caching, invalidation, polling,
        // and other useful features of `rtk-query`.
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    });
    
export const { setTodos, addTodo, updateTodo, deleteTodo } = todosSlice.actions;
export const { selectTodos } = todosSlice.selectors;
// Export hooks for easy usage
export const { useGetTodosQuery, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } = api;