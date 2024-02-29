import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './App.css';
import { useSelector } from 'react-redux';
import { Todo, TodoState, createTodo, deleteTodo, fetchTodos } from './store';
import { useDispatch } from 'react-redux';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const TodoListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const TodoItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TodoTitle = styled.span`
  margin-right: 10px;
`;

const TodoInput = styled.input`
  margin-right: 10px;
`;

const AddButton = styled.button`
  margin-right: 10px;
`;

function App() {
  const todos = useSelector((state: TodoState) => state.todos);
  const dispatch = useDispatch();
  const [todo, setTodo] = useState('');
  const isLoading = useSelector((state: TodoState) => state.loading);

  useEffect(() => {
    dispatch(fetchTodos()); // Explicitly specify the type of the action as AnyAction
  }, [dispatch]);

  const handleAddTodo = () => {
    dispatch(createTodo({ title: todo, completed: false }));
    setTodo('');
  };

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo(id));
  }

  if ( isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AppContainer>
      <h1>Todo List</h1>
      <TodoListContainer>
        <TodoInput type="text" placeholder="Add todo" value={todo} onChange={(e) => setTodo(e.target.value)} />
        <AddButton onClick={handleAddTodo}>Add</AddButton>
        <ul>
          {todos.map(({id, title}: Todo) => {
            if (id === undefined) {
              return null;
            }
            return (<TodoItem key={id}>
              <TodoTitle>{title}</TodoTitle>
              <button onClick={() => handleDeleteTodo(id)} >Delete</button>
            </TodoItem>) 
          })}
        </ul>
      </TodoListContainer>
    </AppContainer>
  );
}

export default App;
