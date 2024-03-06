import todoStore from '../store/todo.store';
import html from './app.html?raw'
import { renderTodos } from './use-cases/render-todos';


const ElementIDs = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
}

const { TodoList, NewTodoInput } = ElementIDs;

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId) => {

    const displayTodo = ()=> {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( TodoList, todos );
    }

    // Cuando la funcion App() se llama
    (()=>{
        const app = document.createElement('div');
              app.innerHTML = html;
              document.querySelector( elementId ).append( app );
              displayTodo();
    })();

    // Referencia HHTML
    const newDescriptionInput = document.querySelector( NewTodoInput ),
          todoListUL = document.querySelector( TodoList ),
          clearCompletedButton = document.querySelector( ClearCompleted );

    // Listeners
    newDescriptionInput.addEventListener('keyup', ( event )=>{
        if(event.keyCode !== 13) return;
        if(event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value );
        displayTodo();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', ( event )=>{
        //closest para buscar el elemento padre mas cercano
        const element = event.target.closest('[data-id]'),
              getAttribute = element.getAttribute('data-id');
        
        todoStore.toggleTodo( getAttribute );
        displayTodo();
    });

    todoListUL.addEventListener('click', ( event )=> {

       const isDestroyElement = event.target.className === 'destroy', 
             element = event.target.closest('[data-id]'),
             getAttribute = element.getAttribute('data-id')
        
        if(!element || !isDestroyElement ) return;

        todoStore.deleteTodo ( getAttribute );
        displayTodo();

    });

    
}