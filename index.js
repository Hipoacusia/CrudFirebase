const db = firebase.firestore();

const taskform = document.querySelector('#task-form');
const taskContainer = document.querySelector('#task-container');

let editStatus = false;
let id = '';

// Guardamos los datos en una coleccion
const saveTask = (title, description) => 
 db.collection('tasks').doc().set({
	 title,
	 description
  });

// Opteniendo datos para editar eliminar o insertar
const getTasks = () => db.collection('tasks').get();
const getTask = (id) => db.collection('tasks').doc(id).get();
const onGetTask = (callback) => db.collection('tasks').onSnapshot(callback);
const deleteTask = id => db.collection('tasks').doc(id).delete();
const updateTask = (id,updateTask) => db.collection('tasks').doc(id).update(updateTask);

//Cundo Carga la ventana muestra toda la informacion
window.addEventListener('DOMContentLoaded', async (e) =>{
  onGetTask((querySnapshot) =>{
		taskContainer.innerHTML = '';
	 querySnapshot.forEach(doc => {
	 
	 const task = doc.data();
	 task.id = doc.id;

	 taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary"> 
		  <h3>${task.title}</h3>
		  <p>${task.description}</p>
		  <div>
			 <button class="btn btn-danger btn-delete" data-id="${task.id}">Delete</button>
			 <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
		  </div>
		  </div>`
	
	 // Seleciona los botones de manera independiente para eliminar	
	 const btnsDelete = document.querySelectorAll('.btn-delete')
	 btnsDelete.forEach(btn =>{
		btn.addEventListener('click', async (e) =>{
		  await deleteTask(e.target.dataset.id);
		});
	 });

	// Seleciona los botones de manera independiente para editar
  const btnsEdit = document.querySelectorAll('.btn-edit')
  btnsEdit.forEach(btn =>{
	 btn.addEventListener('click', async (e) =>{
		const doc = await getTask(e.target.dataset.id);
		const task = doc.data();

		editStatus = true;
		id = doc.id; 

		taskform['task-title'].value = task.title;
		taskform['task-description'].value = task.description;
		taskform['btn-task-form'].innerText = 'update'
		
	 });
  });

	 });

  });

});

// Enviamos o subimos los datos a la base de firestore
taskform.addEventListener('submit', async (e) =>{
  e.preventDefault();
  
  const title = taskform['task-title'];
  const description = taskform['task-description'];

  if(!editStatus){
	 await saveTask(title.value, description.value);
  }else{
	 await updateTask(id,{
		title: title.value,
		description: description.value
	 });

	 editStatus = false;
	 id = '';
	 taskform['btn-task-form'].innerText = 'save';
  }

  taskform.reset();
  title.focus();

});


