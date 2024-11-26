function validateInputs(eventName, startDate, endDate) {
    if(!eventName.trim() || !startDate.trim() || !endDate.trim()) {
        alert("Input Not Valid!");
        return false;
    }

    if(new Date(endDate) < new Date(startDate)) {
        alert("Input Not Valid!");
        return false;
    }

    return true;
}

function createEventElem(event, eventList, mode = "view") {
    // create a row of the event element
    const eventItemElem = document.createElement("tr");
    eventItemElem.id = event.id;
    
    // event name
    const eventElem = document.createElement("td");
    const nameInputElem = document.createElement("input");
    nameInputElem.value = event.eventName || "";

    if(mode === "edit" || mode === "add") {
        eventElem.appendChild(nameInputElem);
    }else {
        eventElem.textContent = event.eventName;
    }

    // start date
    const startElem = document.createElement("td");
    const startInputElem = document.createElement("input");
    startInputElem.type = "date";
    startInputElem.value = event.startDate || "";

    if(mode === "edit" || mode === "add") {
        startElem.appendChild(startInputElem);
    }else {
        startElem.textContent = event.startDate;
    }

    // end date
    const endElem = document.createElement("td");
    const endInputElem = document.createElement("input");
    endInputElem.type = "date";
    endInputElem.value = event.endDate || "";

    if(mode === "edit" || mode === "add") {
        endElem.appendChild(endInputElem);
    }else {
        endElem.textContent = event.endDate;
    }

    // actions
    const actionElem = document.createElement("td");

    // edit button
    const editButton = document.createElement("button");
    editButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>`;
    editButton.addEventListener("click", () => {
        const updatedRow = createEventElem(event, eventList, "edit");
        eventItemElem.replaceWith(updatedRow);
    });

    // delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "red-button";
    deleteButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
    deleteButton.addEventListener("click", async () => {
        await eventAPI.deleteEvent(event.id);
        eventItemElem.remove();
    });

    // save button
    const saveButton = document.createElement("button");
    saveButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>`;
    saveButton.addEventListener("click", async (e) => {
        e.preventDefault();
        
        const updatedEvent = {
            eventName: nameInputElem.value,
            startDate: startInputElem.value,
            endDate: endInputElem.value
        };

        if(!validateInputs(updatedEvent.eventName, updatedEvent.startDate, updatedEvent.endDate)) {
            return;
        }

        const savedEvent = await eventAPI.editEvent(event.id, updatedEvent);
        event = savedEvent;
        const index = eventList.findIndex(e => e.id === event.id);
        if(index !== -1) {
            eventList[index] = savedEvent;
        }

        const updatedRow = createEventElem(savedEvent, eventList, "view");
        eventItemElem.replaceWith(updatedRow);
    });

     // cancel button
     const cancelButton = document.createElement("button");
     cancelButton.className = "red-button";
     cancelButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>`;
     cancelButton.addEventListener("click", async () => {
        if(mode === "add") {
            eventItemElem.remove();
        }else if(mode === "edit"){
            const originalRow = createEventElem(event, eventList, "view");
            eventItemElem.replaceWith(originalRow);
        }
     });

    // add button
    const addButton = document.createElement("button");
    addButton.innerHTML = `<svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    addButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const newEvent = {
            eventName: nameInputElem.value,
            startDate: startInputElem.value,
            endDate: endInputElem.value
        }

        if(!validateInputs(newEvent.eventName, newEvent.startDate, newEvent.endDate)) {
            return;
        }

        const savedEvent = await eventAPI.postEvent(newEvent);
        eventList.push(savedEvent);

        const updatedRow = createEventElem(savedEvent, eventList, "view");
        eventItemElem.replaceWith(updatedRow);
    });

    // append buttons based on mode
    if(mode === "view") {
        actionElem.appendChild(editButton);
        actionElem.appendChild(deleteButton);
    }else if(mode === "edit") {
        actionElem.appendChild(saveButton);
        actionElem.appendChild(cancelButton);
    }else if(mode === "add") {
        actionElem.appendChild(addButton);
        actionElem.appendChild(cancelButton);
    }

    // append all elements to the row
    eventItemElem.appendChild(eventElem);
    eventItemElem.appendChild(startElem);
    eventItemElem.appendChild(endElem);
    eventItemElem.appendChild(actionElem);

    return eventItemElem;
}

function renderEvents(events, eventList) {
    const eventTableElem = document.getElementById("event-table");
    
    for(const event of events) {
        const eventElem = createEventElem(event, eventList);
        eventTableElem.appendChild(eventElem);
    }
}

(function initApp() {
    let eventList = [];
    eventAPI.getEvents().then((events) => {
        eventList = events;
        renderEvents(events, eventList);
    });

    const addNewElem = document.getElementById("add-new-button");
    addNewElem.addEventListener("click", () => {
        const newEvent = {
            eventName: "",
            startDate: "",
            endDate: ""
        }
        const newEventRow = createEventElem(newEvent, eventList, "add");
        document.getElementById("event-table").appendChild(newEventRow);
    });

    const removeExpiredElem = document.getElementById("remove-expired");
    removeExpiredElem.addEventListener("click", async () => {
        for(let i = 0; i < eventList.length; i++) {
            let e = eventList[i];
            let end = e.endDate;
            if(new Date(end) < new Date()) {
                await eventAPI.deleteEvent(e.id);
                document.getElementById(e.id).remove();
                eventList.splice(i, 1);
            }
        }
    });
})();