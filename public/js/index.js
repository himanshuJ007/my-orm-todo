
// IEFE
(() => { 
    //host
    var host = window.location.host;
    
    // state variables
    let toDoListArray = [];
    // ui variables
    const form = document.querySelector(".form"); 
    const input = form.querySelector(".form__input");
    const ul = document.querySelector(".toDoList"); 


    (async ()=> {  
      
      let todos=await axios({
        method: 'get',     
        url: `http://${host}/todo`,
        //headers: {'Authorization': 'Bearer'+token},
      });
      todos.data.forEach(element => {
        addItemToDOM(element.id,element.Task_name)
      });
      
    })();
  
    // event listeners
    form.addEventListener('submit', async(e) => {
      // prevent default behaviour - Page reload
      e.preventDefault();
      
      // get/assign input value
      let toDoItem = input.value;
      // give item a unique ID
      let itemId = await addItemToDB(toDoItem);
      addItemToDOM(itemId , toDoItem);
      
      // clear the input box. (this is default behaviour but we got rid of that)
      input.value = '';
    });
    
    ul.addEventListener('click', e => {
      let id = e.target.getAttribute('data-id')
      if (!id) return // user clicked in something else      
      //pass id through to functions
      removeItemFromDOM(id);
      removeItemFromDB(id);
    });
    
    // functions 
    function addItemToDOM(itemId, toDoItem) {    
      // create an li
      const li = document.createElement('li')
      li.setAttribute("data-id", itemId);
      // add toDoItem text to li
      li.innerText = toDoItem
      // add li to the DOM
      ul.appendChild(li);
    }
    
    async function  addItemToDB( toDoItem) {
      

      let todo=await axios({
        method: 'post',     //put
        url: `http://${host}/todo`,
        //headers: {'Authorization': 'Bearer'+token}, 
        data: {
            "Task_name": toDoItem,
            "description": `I have to do ${toDoItem} task`,
            "isCompleted": false
        }
      });

      
      return todo.data.id;

    }
    
    function removeItemFromDOM(id) {
      // get the list item by data ID
      var li = document.querySelector('[data-id="' + id + '"]');
      // remove list item
      ul.removeChild(li);
    }
    
    function removeItemFromDB(id) {
        axios({
            method: 'delete',     //put
            url: `http://${host}/todo/${id}`,
            //headers: {'Authorization': 'Bearer'+token}, 
            data: {
                "id":id
            }
          });   
    }
  })();