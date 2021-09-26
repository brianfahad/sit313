import React, { useState } from "react";

const NewTask = (props) => 
{   
    const [ taskType, setTaskType ] = useState('in-person');
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ suburb, setSuburb ] = useState('');
    const [ date, setDate ] = useState('');
    const [ budget, setBudget ] = useState('total');
    const [ budgetValue, setBudgetValue ] = useState('');

    function postTask(e) {
        e.preventDefault();
        const data = {
            task_type: taskType,
            title: title,
            description: description,
            suburb: suburb,
            date: date,
            budget: budget,
            budget_value: budgetValue,
        }
        fetch('http://localhost:8080/add-task', { 
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        }).then(response => response.json()).then(data => console.log(data))
    }

    return (
        <form onSubmit={postTask}>
            <div>
                <div className="bg-gray-200 mt-4 w-11/12 mx-auto rounded-lg">
                    <p className="text-xl font-bold text-left ml-10 py-4">New Task</p>
                </div>
                <div className="flex w-11/12 mx-auto mt-4">
                    <p className="ml-10">Select task type: </p>
                    <input type="radio" value="in-person" checked={taskType === 'in-person'} onChange={(event) => setTaskType(event.target.value) } id="in-person" className="mr-2 ml-4 my-auto" name="task-type" />
                    <label htmlFor="in-person">In Person</label>
                    <input type="radio" value="online" checked={taskType === 'online'} onChange={(event) => setTaskType(event.target.value) } id="online" className="mr-2 ml-4 my-auto" name="task-type"  />
                    <label htmlFor="online">Online</label>
                </div>

                <div className="bg-gray-200 mt-4 w-11/12 mx-auto rounded-lg">
                    <p className="text-lg text-left ml-10 py-2">Describe your task to experts</p>
                </div>

                <div className="w-11/12 mx-auto mt-4">
                    <div className="flex">
                        <label htmlFor="task-title" className="ml-10 mr-14">Task title</label>
                        <input type="text" value={title} onChange={(event) => setTitle(event.target.value) } htmlFor="task-title" className="py-1 mr-4 border border-green-900 rounded px-4 w-1/3" placeholder="Enter the task title" />
                    </div>
                    <div className="flex mt-5">
                        <label htmlFor="task-desc" className="mr-2 ml-10">Task description</label>
                        <textarea htmlFor="task-desc" value={description} onChange={(event) => setDescription(event.target.value) } className="py-1 mr-4 border border-green-900 rounded px-4 w-1/3" placeholder="Enter the task description" />
                    </div>
                </div>

                <div className="bg-gray-200 mt-4 w-11/12 mx-auto rounded-lg">
                    <p className="text-lg text-left ml-10 py-2">Setting up your task</p>
                </div>

                <div className="w-11/12 mx-auto mt-4">
                    { taskType === 'in-person' &&
                        <div className="flex">
                            <label htmlFor="suburb" className="ml-10 mr-16">Suburb</label>
                            <input type="text" value={suburb} onChange={(event) => setSuburb(event.target.value) } htmlFor="suburb" className="py-1 mr-4 border border-green-900 rounded px-4 w-1/3" placeholder="Suburb" />
                        </div>
                    }
                    <div className="flex mt-5">
                        <label htmlFor="date" className="ml-10 mr-20">Date</label>
                        <input type="text" value={date} onChange={(event) => setDate(event.target.value) } htmlFor="date" className="py-1 mr-4 border border-green-900 rounded px-4 w-1/3" placeholder="Date" />
                    </div>
                </div>

                <div className="bg-gray-200 mt-4 w-11/12 mx-auto rounded-lg">
                    <p className="text-lg text-left ml-10 py-2">Suggest how much</p>
                </div>

                <div className="w-11/12 mx-auto mt-4">
                    <p className="text-left ml-10">What is your budget?</p>
                    <p className="text-left ml-10">(This is an estimate)</p>

                    <div className="text-left ml-10 mt-5">
                        <input type="radio" value="total" checked={budget === 'total'} onChange={(event) => setBudget(event.target.value) } id="total" className="mr-2 my-auto" name="task-budget" />
                        <label htmlFor="total">Total</label>
                        <input type="radio" value="hourly" checked={budget === 'hourly'} onChange={(event) => setBudget(event.target.value) } id="hourly-rate" className="mr-2 ml-4 my-auto" name="task-budget"  />
                        <label htmlFor="hourly-rate">Hourly rate</label>
                    </div>

                    <input type="text" value={budgetValue} onChange={(event) => setBudgetValue(event.target.value) } className="py-1 border border-green-900 rounded px-4 mr-auto block ml-10 mt-5" placeholder="$" />
                
                </div>

                <div className="w-11/12 mx-auto mt-8">
                    <button className="bg-green-900 px-8 py-1 rounded text-white font-semibold mr-auto ml-10 block" type="submit">Post task</button>
                </div>
            </div>
        </form>
    );
}

export default NewTask