import {  legacy_createStore as createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { ThunkAction, thunk } from 'redux-thunk';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

// Define the todo interface
export interface Todo {
    id?: number;
    title: string;
    completed: boolean;
}

// Define the state shape
export interface TodoState {
    todos: Todo[];
    loading: boolean;
    error: string | null;
}

// Define action types
enum ActionTypes {
    FETCH_TODOS_REQUEST = 'FETCH_TODOS_REQUEST',
    FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS',
    FETCH_TODOS_FAILURE = 'FETCH_TODOS_FAILURE',
    CREATE_TODO_REQUEST = 'CREATE_TODO_REQUEST',
    CREATE_TODO_SUCCESS = 'CREATE_TODO_SUCCESS',
    CREATE_TODO_FAILURE = 'CREATE_TODO_FAILURE',
    UPDATE_TODO_REQUEST = 'UPDATE_TODO_REQUEST',
    UPDATE_TODO_SUCCESS = 'UPDATE_TODO_SUCCESS',
    UPDATE_TODO_FAILURE = 'UPDATE_TODO_FAILURE',
    DELETE_TODO_REQUEST = 'DELETE_TODO_REQUEST',
    DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS',
    DELETE_TODO_FAILURE = 'DELETE_TODO_FAILURE',
}

// Define action interfaces
export interface FetchTodosRequestAction {
    type: ActionTypes.FETCH_TODOS_REQUEST;
}

interface FetchTodosSuccessAction {
    type: ActionTypes.FETCH_TODOS_SUCCESS;
    payload: Todo[];
}

interface FetchTodosFailureAction {
    type: ActionTypes.FETCH_TODOS_FAILURE;
    payload: string;
}

interface CreateTodoRequestAction {
    type: ActionTypes.CREATE_TODO_REQUEST;
}

interface CreateTodoSuccessAction {
    type: ActionTypes.CREATE_TODO_SUCCESS;
    payload: Todo;
}

interface CreateTodoFailureAction {
    type: ActionTypes.CREATE_TODO_FAILURE;
    payload: string;
}

interface UpdateTodoRequestAction {
    type: ActionTypes.UPDATE_TODO_REQUEST;
}

interface UpdateTodoSuccessAction {
    type: ActionTypes.UPDATE_TODO_SUCCESS;
    payload: Todo;
}

interface UpdateTodoFailureAction {
    type: ActionTypes.UPDATE_TODO_FAILURE;
    payload: string;
}

interface DeleteTodoRequestAction {
    type: ActionTypes.DELETE_TODO_REQUEST;
}

interface DeleteTodoSuccessAction {
    type: ActionTypes.DELETE_TODO_SUCCESS;
    payload: number;
}

interface DeleteTodoFailureAction {
    type: ActionTypes.DELETE_TODO_FAILURE;
    payload: string;
}

// Define action creators
const fetchTodosRequest = (): FetchTodosRequestAction => ({
    type: ActionTypes.FETCH_TODOS_REQUEST,
});

const fetchTodosSuccess = (todos: Todo[]): FetchTodosSuccessAction => ({
    type: ActionTypes.FETCH_TODOS_SUCCESS,
    payload: todos,
});

const fetchTodosFailure = (error: string): FetchTodosFailureAction => ({
    type: ActionTypes.FETCH_TODOS_FAILURE,
    payload: error,
});

const createTodoRequest = (): CreateTodoRequestAction => ({
    type: ActionTypes.CREATE_TODO_REQUEST,
});

const createTodoSuccess = (todo: Todo): CreateTodoSuccessAction => ({
    type: ActionTypes.CREATE_TODO_SUCCESS,
    payload: todo,
});

const createTodoFailure = (error: string): CreateTodoFailureAction => ({
    type: ActionTypes.CREATE_TODO_FAILURE,
    payload: error,
});

const updateTodoRequest = (): UpdateTodoRequestAction => ({
    type: ActionTypes.UPDATE_TODO_REQUEST,
});

const updateTodoSuccess = (todo: Todo): UpdateTodoSuccessAction => ({
    type: ActionTypes.UPDATE_TODO_SUCCESS,
    payload: todo,
});

const updateTodoFailure = (error: string): UpdateTodoFailureAction => ({
    type: ActionTypes.UPDATE_TODO_FAILURE,
    payload: error,
});

const deleteTodoRequest = (): DeleteTodoRequestAction => ({
    type: ActionTypes.DELETE_TODO_REQUEST,
});

const deleteTodoSuccess = (id: number): DeleteTodoSuccessAction => ({
    type: ActionTypes.DELETE_TODO_SUCCESS,
    payload: id,
});

const deleteTodoFailure = (error: string): DeleteTodoFailureAction => ({
    type: ActionTypes.DELETE_TODO_FAILURE,
    payload: error,
});

// Define the todos reducer
const todosReducer = (state: TodoState['todos'] = [], action: any): TodoState['todos'] => {
    switch (action.type) {
        case ActionTypes.FETCH_TODOS_SUCCESS:
            return action.payload;
        case ActionTypes.CREATE_TODO_SUCCESS:
            return [...state, action.payload];
        case ActionTypes.UPDATE_TODO_SUCCESS:
            return state.map(todo => (todo.id === action.payload.id ? action.payload : todo));
        case ActionTypes.DELETE_TODO_SUCCESS:
            return state.filter(todo => todo.id !== action.payload);
        default:
            return state;
    }
};

// Define the loading reducer
const loadingReducer = (state: TodoState['loading'] = false, action: any): TodoState['loading'] => {
    switch (action.type) {
        case ActionTypes.FETCH_TODOS_REQUEST:
        case ActionTypes.CREATE_TODO_REQUEST:
        case ActionTypes.UPDATE_TODO_REQUEST:
        case ActionTypes.DELETE_TODO_REQUEST:
            return true;
        case ActionTypes.FETCH_TODOS_SUCCESS:
        case ActionTypes.FETCH_TODOS_FAILURE:
        case ActionTypes.CREATE_TODO_SUCCESS:
        case ActionTypes.CREATE_TODO_FAILURE:
        case ActionTypes.UPDATE_TODO_SUCCESS:
        case ActionTypes.UPDATE_TODO_FAILURE:
        case ActionTypes.DELETE_TODO_SUCCESS:
        case ActionTypes.DELETE_TODO_FAILURE:
            return false;
        default:
            return state;
    }
};

// Define the error reducer
const errorReducer = (state: TodoState['error'] = null, action: any): TodoState['error'] => {
    switch (action.type) {
        case ActionTypes.FETCH_TODOS_FAILURE:
        case ActionTypes.CREATE_TODO_FAILURE:
        case ActionTypes.UPDATE_TODO_FAILURE:
        case ActionTypes.DELETE_TODO_FAILURE:
            return action.payload;
        case ActionTypes.FETCH_TODOS_REQUEST:
        case ActionTypes.CREATE_TODO_REQUEST:
        case ActionTypes.UPDATE_TODO_REQUEST:
        case ActionTypes.DELETE_TODO_REQUEST:
        case ActionTypes.FETCH_TODOS_SUCCESS:
        case ActionTypes.CREATE_TODO_SUCCESS:
        case ActionTypes.UPDATE_TODO_SUCCESS:
        case ActionTypes.DELETE_TODO_SUCCESS:
            return null;
        default:
            return state;
    }
};

// Combine the reducers
const rootReducer = combineReducers({
    todos: todosReducer,
    loading: loadingReducer,
    error: errorReducer,
});

// Define the root state type
type RootState = ReturnType<typeof rootReducer>;

// Define the thunk async function to fetch todos
const fetchTodos = (): ThunkAction<void, RootState, unknown, FetchTodosRequestAction | FetchTodosSuccessAction | FetchTodosFailureAction> => {
    return async dispatch => {
        dispatch(fetchTodosRequest());
        try {
            const response = await axios.get('/api/todos');
            dispatch(fetchTodosSuccess(response.data));
        } catch (error: any) {
            dispatch(fetchTodosFailure(error.message));
        }
    };
};

// Define the thunk async function to create a todo
const createTodo = (todo: Todo): ThunkAction<void, RootState, unknown, CreateTodoRequestAction | CreateTodoSuccessAction | CreateTodoFailureAction> => {
    return async dispatch => {
        dispatch(createTodoRequest());
        try {
            const response = await axios.post('/api/todos', todo);
            dispatch(createTodoSuccess(response.data));
        } catch (error:any) {
            dispatch(createTodoFailure(error.message));
        }
    };
};

// Define the thunk async function to update a todo
const updateTodo = (todo: Todo): ThunkAction<void, RootState, unknown, UpdateTodoRequestAction | UpdateTodoSuccessAction | UpdateTodoFailureAction> => {
    return async dispatch => {
        dispatch(updateTodoRequest());
        try {
            const response = await axios.put(`/api/todos/${todo.id}`, todo);
            dispatch(updateTodoSuccess(response.data));
        } catch (error: any) {
            dispatch(updateTodoFailure(error.message));
        }
    };
};

// Define the thunk async function to delete a todo
const deleteTodo = (id: number): ThunkAction<void, RootState, unknown, DeleteTodoRequestAction | DeleteTodoSuccessAction | DeleteTodoFailureAction> => {
    return async dispatch => {
        dispatch(deleteTodoRequest());
        try {
            await axios.delete(`/api/todos/${id}`);
            dispatch(deleteTodoSuccess(id));
        } catch (error: any) {
            dispatch(deleteTodoFailure(error.message));
        }
    };
};

// Create the Redux store
// const store = createStore(rootReducer, undefined ,applyMiddleware(thunk)); // Apply the 'thunk' middleware to the store creation

export default function configureStore(preloadedState?: any) {
    const middlewares: any = [thunk]
    const middlewareEnhancer = applyMiddleware(...middlewares)
  
    const enhancers = [middlewareEnhancer]
    const composedEnhancers: any = compose(...enhancers)
  
    const store = createStore(rootReducer, preloadedState, composedEnhancers)
    return store
}

export {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
};
