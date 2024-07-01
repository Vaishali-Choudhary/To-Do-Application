let label = Array.from(document.getElementsByTagName("label"));
let maxId = 0;
let DarkMode = false;

function left(){
    let remaining = document.querySelectorAll('.incomplete').length || 0;
    document.querySelector('.left').textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
}

function mark(){
    label.forEach(element => {
        element.addEventListener("click",e=>{
            let task = element.getElementsByTagName("input")[0];
            let clicked = e.target;
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            if(clicked.classList.value != 'cross'){
                if(task.classList.contains("incomplete")){
                    task.classList.remove("incomplete");
                    task.classList.add("completed");
                    tasks.find(t=>t.id == task.id).completed = true;
                    let p = element.getElementsByTagName("p")[0];
                    if(DarkMode){
                        p.setAttribute("class","pCompletedDark")
                    }
                    else{
                        p.setAttribute("class",'pCompleted');
                    }
                    let image = document.createElement("img");
                    image.src = "./images/icon-check.svg";
                    image.setAttribute('class','check');
                    task.insertAdjacentElement('afterend',image);
                }
                else{
                    task.classList.remove("completed");
                    task.classList.add("incomplete");
                    tasks.find(t=>t.id == task.id).completed = false;
                    let p = element.getElementsByTagName("p")[0];
                    p.removeAttribute('class');
                    let image = element.getElementsByClassName("check")[0];
                    image.remove(); 
                }
                localStorage.setItem('tasks',JSON.stringify(tasks));
                left();
            }
        })
        let task = element.getElementsByTagName("input")[0];
        task.addEventListener("click",e=>{
            e.stopPropagation();
        })
    });
}

function remove(){
    let tasks = Array.from(document.getElementsByClassName("cross"));
    tasks.forEach(element=>{
        element.addEventListener('click',e=>{
            let task = element.closest('label');
            let taskId = task.querySelector('input').id;
            const answer = confirm('Are you sure you want to delete this task?');
            if(answer){
                let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                tasks = tasks.filter(t=> t.id != taskId);
                localStorage.setItem('tasks',JSON.stringify(tasks));
                let line = task.nextElementSibling;
                task.remove();
                line.remove();
                left();
            }
        })
    });
}

function filter(){
    let type = Array.from(document.getElementsByClassName("type"));
    type.forEach(element=>{
        element.addEventListener('click',e=>{
            let old = document.getElementsByClassName("selected")[0];
            if(element != old){
                old.classList.remove("selected");
                element.classList.add("selected");
                if(element.textContent == 'All'){
                    label.forEach(ele=>{
                        ele.style.display = 'flex';
                        let line = ele.nextElementSibling;
                        line.style.display = 'flex';
                    })
                }
                else if(element.textContent == 'Active'){
                    label.forEach(ele=>{
                        let task = ele.getElementsByTagName("input")[0];
                        let line = ele.nextElementSibling;
                        if(task.classList.contains("completed")){
                            ele.style.display = 'none';
                            line.style.display = 'none';
                        }
                        else{
                            ele.style.display = 'flex';
                            line.style.display = 'flex';
                        }
                    })
                }
                else{
                    label.forEach(ele=>{
                        let task = ele.getElementsByTagName("input")[0];
                        let line = ele.nextElementSibling;
                        if(task.classList.contains("incomplete")){
                            ele.style.display = 'none';
                            line.style.display = 'none';
                        }
                        else{
                            ele.style.display = 'flex';
                            line.style.display = 'flex';
                        }
                    })
                }
            }
        })
    })
}

function clear(){
    let type = document.getElementsByClassName("clear")[0];
    type.addEventListener('click',e=>{
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        label.forEach(ele=>{
            let task = ele.getElementsByTagName("input")[0];
            let id = task.id;
            let line = ele.nextElementSibling;
            if(task.classList.contains("completed")){
                tasks = tasks.filter(task=> task.id !=id);
                ele.remove();
                line.remove();
                label = Array.from(document.getElementsByTagName("label"));
            }
        })
        localStorage.setItem('tasks',JSON.stringify(tasks));
    });
}

function add(){
    let input = document.getElementById("textInput")
    input.addEventListener('keydown',e=>{
        if(e.key == 'Enter'){
            let task = input.value;
            let newTask = document.createElement('label');
            newTask.innerHTML = `<div class="inCheck">
                                    <input type="checkbox" class="incomplete" id="${maxId + 1}">
                                </div>
                                <p>${task}</p>
                                <img src="./images/icon-cross.svg" alt="" class="cross">`
            let line = document.createElement('div');
            line.setAttribute('class','line')
            let form = document.getElementsByClassName("form")[0];
            form.append(newTask);
            form.append(line);
            label = Array.from(document.getElementsByTagName("label"));
            input.value = '';
            maxId = maxId+1;
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({id:maxId+1, task:task, completed:false});
            localStorage.setItem('tasks',JSON.stringify(tasks));
            left();
        }
        remove()
        mark()
    })
}

function toogle(){
    let mode = document.getElementsByClassName("mode")[0].querySelector('img');
    mode.addEventListener('click',e=>{
        DarkMode = !DarkMode;
        if(DarkMode){
            mode.src = './images/icon-sun.svg'
            document.body.style.backgroundColor = "hsl(235, 21%, 11%)";
            document.querySelector('.bg').style.backgroundImage = "url('./images/bg-desktop-dark.jpg')"
            document.querySelector('.newTodo').style.backgroundColor = "hsl(235, 24%, 19%)"
            document.querySelector('#textInput').style.backgroundColor = "hsl(235, 24%, 19%)"
            document.querySelector('#textInput').style.color = "hsl(234, 39%, 85%)"
            document.querySelector('.list').style.backgroundColor = "hsl(235, 24%, 19%)"
            label.forEach(l=>{
                l.style.color = "hsl(234, 39%, 85%)"
            })
            Array.from(document.querySelectorAll('.line')).forEach(l=>{
                l.style.backgroundColor = "hsl(234, 11%, 52%)"
            })
            Array.from(document.querySelectorAll('.pCompleted')).forEach(l=>{
                l.style.color = "hsl(233, 14%, 35%)"
            })
            document.querySelector('.summary').style.color = "hsl(234, 11%, 52%)"
        }
        else{
            mode.src = './images/icon-moon.svg'
            document.body.style.backgroundColor = "hsl(0, 0%, 98%)";
            document.querySelector('.bg').style.backgroundImage = "url('./images/bg-desktop-light.jpg')"
            document.querySelector('.newTodo').style.backgroundColor = "white"
            document.querySelector('#textInput').style.backgroundColor = "white"
            document.querySelector('#textInput').style.color = "black"
            document.querySelector('.list').style.backgroundColor = "white"
            label.forEach(l=>{
                l.style.color = "hsl(235, 19%, 35%)"
            })            
            Array.from(document.querySelectorAll('.line')).forEach(l=>{
                l.style.backgroundColor = "hsl(236, 9%, 61%)"
            })            
            Array.from(document.querySelectorAll('.pCompleted')).forEach(l=>{
                l.style.color = "hsl(233, 11%, 84%)"
            })  
            document.querySelector('.summary').style.color = "hsl(236, 9%, 61%)"
        }
    })
}

window.addEventListener('load',e=>{
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task=>{
        let newTask = document.createElement('label');
        newTask.innerHTML = `<div class="inCheck">
                                <input type="checkbox" class="${task.completed ? 'completed' : 'incomplete'}" id="${task.id}">
                                ${task.completed ? '<img src = "./images/icon-check.svg" class="check">' : ''}
                            </div>
                            <p class="${task.completed ? 'pCompleted' : ""}">${task.task}</p>
                            <img src="./images/icon-cross.svg" alt="" class="cross">`
        let line = document.createElement('div');
        line.setAttribute('class','line')
        let form = document.getElementsByClassName("form")[0];
        form.append(newTask);
        form.append(line);
    })
    label = Array.from(document.getElementsByTagName("label"));
    left()
    remove()
    mark()
    maxId = tasks.length >0 ? tasks[tasks.length - 1].id : 0;
})

left()
toogle()
remove()
mark()
filter()
clear()
add()