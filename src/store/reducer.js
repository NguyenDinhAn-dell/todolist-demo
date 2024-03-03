
import { ADD_TODO, DELETE_TODO, SET_TODO_INPUT, EDIT_TODO } from "./constants"

const storeTodos = JSON.parse(localStorage.getItem('todos'))

const initState = {
    todos: storeTodos ?? [],
    todoInput: '',
}

function reducer(state, action) {
    switch (action.type) {
        case SET_TODO_INPUT:
            return {
                ...state,
                todoInput: action.payload
            }
       
        case ADD_TODO:
            const newTodo = [...state.todos, action.payload];

            localStorage.setItem('todos', JSON.stringify(newTodo))
            return {
                ...state,
                todos: newTodo
            }
        case EDIT_TODO:
            const { index, updatedTodo } = action.payload;
            const updatedTodos = [...state.todos];
            updatedTodos[index] = updatedTodo;

            localStorage.setItem('todos', JSON.stringify(updatedTodos));

            return {
                ...state,
                todos: updatedTodos,
            };
        case DELETE_TODO:
            const newState = [...state.todos];
            newState.splice(action.payload, 1);
            localStorage.setItem('todos', JSON.stringify(newState))
            return {
                ...state,
                todos: newState
            }
        default:
            throw new Error('Invalid action')
    }
}

export { initState }
export default reducer