// Import necessary dependencies
import axios, { AxiosResponse } from 'axios';
import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

axios.defaults.baseURL = 'http://localhost:3000';

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

// Define action creators
const createTodo = (todo: Todo) => ({ type: ActionTypes.CREATE_TODO_REQUEST, payload: todo });
const updateTodo = (todo: Todo) => ({ type: ActionTypes.UPDATE_TODO_REQUEST, payload: todo });
const deleteTodo = (id: number) => ({ type: ActionTypes.DELETE_TODO_REQUEST, payload: id });
const fetchTodos = () => ({ type: ActionTypes.FETCH_TODOS_REQUEST });
// const fetchTodos = (todos: Todo[]) => ({ type: ActionTypes.FETCH_TODOS_REQUEST, payload: todos });

// Define initial state
export interface Todo {
    id?: number;
    title: string;
    completed: boolean;
}

export interface TodoState {
    todos: Todo[];
    loading: boolean;
    error: string | null;
}

const initialState: TodoState = {
    todos: [],
    loading: false,
    error: null,
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

// Define reducers
const todosReducer = (state = initialState.todos, action: any) => {
    switch (action.type) {
        case ActionTypes.FETCH_TODOS_SUCCESS:
            return [...action.payload]; // Update the reducer to return a new array instead of mutating the state directly
        case ActionTypes.CREATE_TODO_SUCCESS:
            return [...state, action.payload]; // Add a new case to handle creating a new todo
        case ActionTypes.UPDATE_TODO_SUCCESS:
            return state.map((todo: Todo) => {
                if (todo.id === action.payload.id) {
                    return { ...todo, ...action.payload }; // Update the specific todo
                }
                return todo;
            });
        case ActionTypes.DELETE_TODO_SUCCESS:
            return state.filter((todo: Todo) => todo.id !== action.payload); // Remove the specific todo
        default:
            return state;
    }
};


const rootReducer = combineReducers({
    todos: todosReducer,
    loading: loadingReducer,
    error: errorReducer,
});

// Define sagas
function* createTodoSaga(action: any) {
    try {
        // Perform API call to create a new todo
       const todo: AxiosResponse = yield call(axios.post, '/api/todos', action.payload);

        // Dispatch success action
        yield put({ type: 'CREATE_TODO_SUCCESS', payload: todo.data })
    } catch (error: any) {
        // Dispatch error action
        yield put({ type: 'CREATE_TODO_ERROR', payload: error.message });
    }
}

function* updateTodoSaga(action: any) {
    try {
        // Perform API call to update the todo
        const todo: AxiosResponse = yield call(axios.put,'/api/todos', action.payload);

        // Dispatch success action
        yield put({ type: 'UPDATE_TODO_SUCCESS', payload: todo.data });
    } catch (error: any) {
        // Dispatch error action
        yield put({ type: 'UPDATE_TODO_ERROR', payload: error.message });
    }
}

function* deleteTodoSaga(action: any) {
    try {
        // Perform API call to delete the todo
        yield call(axios.delete,`/api/todos/${action.payload}`);

        // Dispatch success action
        yield put({ type: 'DELETE_TODO_SUCCESS', payload: action.payload });
    } catch (error: any) {
        // Dispatch error action
        yield put({ type: 'DELETE_TODO_ERROR', payload: error.message });
    }
}

function* fetchTodosSaga(): Generator<any, void, any> {
    try {
        // Perform API call to fetch todos
        const todos: AxiosResponse = yield call(axios.get, '/api/todos');

        // Dispatch success action
        yield put({ type: 'FETCH_TODOS_SUCCESS', payload: todos.data });
    } catch (error: any) {
        // Dispatch error action
        yield put({ type: 'FETCH_TODOS_ERROR', payload: error.message });
    }
}

// Watcher saga
function* watchTodos() {
    yield takeEvery(ActionTypes.CREATE_TODO_REQUEST, createTodoSaga);
    yield takeEvery(ActionTypes.UPDATE_TODO_REQUEST, updateTodoSaga);
    yield takeEvery(ActionTypes.DELETE_TODO_REQUEST, deleteTodoSaga);
    yield takeEvery(ActionTypes.FETCH_TODOS_REQUEST, fetchTodosSaga);
}

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create store
const store = createStore(rootReducer, undefined, applyMiddleware(sagaMiddleware));

// Run the watcher saga
sagaMiddleware.run(watchTodos);

// Export necessary variables
export { store, createTodo, updateTodo, deleteTodo, fetchTodos };