import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
      this.state={
        todoList:[],
        activeItem:{
          id:null,
          title:'',
          compleated:false,
        },
        editing:false,
      }
      this.fetchTasks=this.fetchTasks.bind(this)
      this.handleChange=this.handleChange.bind(this)
      this.handleSubmit=this.handleSubmit.bind(this)
      this.getCookie=this.getCookie.bind(this)
      this.startEdit=this.startEdit.bind(this)
      this.deleteItem=this.deleteItem.bind(this)
      this.strikeUnstrike=this.strikeUnstrike.bind(this)




  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTasks()

  }
  fetchTasks(){
    console.log("fetching....");
    fetch("http://127.0.0.1:8000/api/tasks")
    .then(response=>response.json())
    .then(data=>
      this.setState({
        todoList:data
      })
      )
  }
  handleChange(e){
    var name=e.target.name;
    var value=e.target.value;

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })

  }

  handleSubmit(e){
    e.preventDefault();
    console.log('item,',this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')
    var url="http://127.0.0.1:8000/api/create"
    if(this.state.editing===true){
      url=`http://127.0.0.1:8000/api/update/${ this.state.activeItem.id }/`
      this.setState({
        editing:false
      })
    }
    fetch(url,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,

      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response) =>{
      this.fetchTasks()
      this.setState({
        activeItem:{
          id:null,
          title:'',
          compleated:false,
        }
      })
      }).catch(function(error){
        console.log("error",error)
    })
  }

  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true
    })
  }

  deleteItem(task){
    var csrftoken = this.getCookie('csrftoken')
    if(window.confirm("Are You sure , You want to delete")){
      fetch(`http://127.0.0.1:8000/api/delete/${task.id}/`,{
        method:'DELETE',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        }
      }).then((response)=>{
        this.fetchTasks()
      })
    }
  }

  strikeUnstrike(task){
    task.compleated = !task.compleated
    var csrftoken = this.getCookie('csrftoken')
    var url=`http://127.0.0.1:8000/api/update/${ task.id }/`
    console.log(task.compleated);
    fetch(url,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify({'compleated':task.compleated,'title':task.title })
    }).then(()=> {
      this.fetchTasks();
    })
  }

  render() {
    var tasks=this.state.todoList
    var self=this
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex:6}}>
                  <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task..."/>
                </div>
                <div style={{ flex:1}}>
                  <input className="btn btn-warning" id="submit" type="submit" name="Add"/>
                </div>
                
              </div>
            </form>

          </div>
          <div id="list-wrapper">
            {tasks.map(function(task,index){
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div onClick={()=>self.strikeUnstrike(task)} style={{ flex:7}}>
                    {task.compleated==false ? (
                      <span>{task.title}</span>
                    ): (
                      <strike>{task.title}</strike>
                    )}
                    
                  </div>
                  <div style={{ flex:1}}>
                    <button onClick={()=>self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                  </div>
                  <div style={{ flex:1}}>
                    <button onClick={()=>self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                  </div>
                </div>
              )
            })}

          </div>
        </div>

      </div>
    )
  }
}

export default App;
