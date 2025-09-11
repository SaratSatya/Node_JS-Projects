const fs = require("fs");
const filepath = "tasks.json";

const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync(filepath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

const addTask = (task) => {
  const tasks = loadTasks();
  tasks.push({ task });
  saveTasks(tasks);
  console.log("Task added", task);
};

const saveTasks = (tasks) => {
  const dataJSON = JSON.stringify(tasks);
  fs.writeFileSync(filepath, dataJSON);
};

const listTasks = () => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log("No tasks found.");
    }   else {  
        console.log("Your tasks:");
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.task}`);
        });                 
    }
}

// const removeTask=(index)=>{
//     const tasks=loadTasks();
//     const newTasks=tasks.filter((task,i)=>i!==index-1)
//     saveTasks(newTasks)
//     console.log("Task removed") 
// }

const removeTask = (index) => {
    const tasks = loadTasks();
    if (index > 0 && index <= tasks.length) {
        tasks.splice(index - 1, 1);
        saveTasks(tasks);
        console.log("Task removed");
    } else {
        console.log("Invalid task index");
    }           
}

const command = process.argv[2];
const argument = process.argv[3];

if (command === "add") {
  addTask(argument);
} else if (command === "list") {
  listTasks();
} else if (command === "remove") {
  removeTask(parseInt(argument));
} else {
  console.log("Command not found !");
}
