document.addEventListener("DOMContentLoaded", () => {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const list = document.getElementById("eventsList");
  const searchInput = document.getElementById("searchInput");

  function display(eventsToShow) {
    list.innerHTML = "";

    if (eventsToShow.length === 0) {
      list.innerHTML = "<p>No events found.</p>";
      return;
    }

    eventsToShow.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        ${event.image ? `<img src="${event.image}" class="event-image" alt="Event Image">` : ""}
        <h3>${event.title}</h3>
        <p>${event.description.slice(0, 80)}...</p>
        <p><strong>Date:</strong> ${event.date ? new Date(event.date).toLocaleString() : "Invalid Date"}</p>
        <button onclick="viewEvent('${event.id}')">See More</button>
      `;
      list.appendChild(card);
    });
  }

  display(events);

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q)
      );
      display(filtered);
    });
  }
});

function viewEvent(id) {
  localStorage.setItem("currentEventId", id);
  window.location.href = "event-details.html";
}
