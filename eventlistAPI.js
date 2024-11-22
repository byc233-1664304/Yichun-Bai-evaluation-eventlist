const eventAPI = (() =>{
    const EVENT_API_URL = "http://localhost:3000/events";

    async function getEvents() {
        const res = await fetch(EVENT_API_URL);
        const events = await res.json();
        return events;
    }

    async function postEvent(newEvent) {
        const res = await fetch(EVENT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEvent)
        });

        const event = await res.json();
        return event;
    }

    async function deleteEvent(id) {
        const res = await fetch(`${EVENT_API_URL}/${id}`, {
            method: "DELETE"
        });

        await res.json();
        return id;
    }

    async function editEvent(id, newEvent) {
        const res = await fetch(`${EVENT_API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEvent)
        });

        const updatedEvent = await res.json();
        return updatedEvent;
    }

    return {
        getEvents,
        postEvent,
        deleteEvent,
        editEvent
    };
})();