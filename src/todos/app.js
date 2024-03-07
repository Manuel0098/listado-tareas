import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw'
import { renderTodos, renderPending } from './use-cases';



const ElementIDs = {
    ClearCompletedButton: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

const { TodoList, NewTodoInput, ClearCompletedButton, TodoFilters, PendingCountLabel } = ElementIDs;
const {All, Completed, Pending, } = Filters;
/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {

    const displayTodo = ()=> {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( TodoList, todos );
        updatePendingCount();
    }

    const updatePendingCount = ()=> {
        renderPending( PendingCountLabel );
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
          clearCompletedButton = document.querySelector( ClearCompletedButton ),
          filterLIs = document.querySelectorAll( TodoFilters );

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

    clearCompletedButton.addEventListener('click', ( event )=>{

        todoStore.deleteCompleted();
        displayTodo();
    });

    // Recorro la referencia con un for Each porque retorna un array por el querySelectorAll
    filterLIs.forEach(element => {
        
        element.addEventListener('click', ( element )=> {
            filterLIs.forEach( e =>  e.classList.remove('selected') );
            element.target.classList.add('selected');

            switch( element.target.text ){
                case 'Todos':
                    todoStore.setFilter( All )
                break;

                case 'Pendientes':
                    todoStore.setFilter( Pending )
                break;

                case 'Completados':
                    todoStore.setFilter( Completed )
                break;
            }

            displayTodo();

        });
    });   
}