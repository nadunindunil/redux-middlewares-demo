import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './App.css';
import { Todo, selectTodos, useCreateTodoMutation, useDeleteTodoMutation, useGetTodosQuery  } from './store';
import { useDispatch, useSelector } from 'react-redux';


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

  const [todo, setTodo] = useState('');
  const { isError, isLoading, isSuccess } = useGetTodosQuery();

  const todos = useSelector(selectTodos);

  const [createTodo] = useCreateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleAddTodo = () => {
    createTodo({ title: todo, completed: false });
    setTodo('');
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
  }

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <AppContainer>
      <h1>Todo List</h1>
      <TodoListContainer>
        <TodoInput type="text" placeholder="Add todo" value={todo} onChange={(e) => setTodo(e.target.value)}/>
        <AddButton onClick={handleAddTodo}>Add</AddButton>
        <ul>
          {todos?.map(({id, title}: Todo) => {
            if (id === undefined) {
              return null;
            }
            return (<TodoItem key={id}>
              <TodoTitle>{title}</TodoTitle>
              <button onClick={() => handleDeleteTodo(id)}>Delete</button>
            </TodoItem>) 
          })}
        </ul>
      </TodoListContainer>
    </AppContainer>
  );
}

export default App;
