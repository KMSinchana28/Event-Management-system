document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const eventId = localStorage.getItem("currentEventId");

  let events = JSON.parse(localStorage.getItem("events")) || [];
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  let registrations = JSON.parse(localStorage.getItem("registrations")) || {};

  const event = events.find(e => e.id === eventId);

  if (!event) {
    alert("Event not found.");
    window.location.href = "index.html";
    return;
  }

  // Display event info
  document.getElementById("eventTitle").textContent = event.title;
  document.getElementById("eventDescription").textContent = event.description;
  document.getElementById("eventDate").textContent = new Date(event.date).toLocaleString();

  // Countdown
  function updateCountdown() {
    const now = new Date();
    const eventDate = new Date(event.date);
    const diff = eventDate - now;

    if (diff <= 0) {
      document.getElementById("countdown").textContent = "Event has started!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("countdown").textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Sections
  const organizerControls = document.getElementById("organizerControls");
  const attendeeControls = document.getElementById("attendeeControls");
  const reviewSection = document.getElementById("reviewSection");

  if (!currentUser) {
    organizerControls.style.display = "none";
    attendeeControls.style.display = "none";
    reviewSection.style.display = "none";
    return;
  }

  // ORGANIZER VIEW
  if (currentUser.username === event.organizer) {
    organizerControls.style.display = "block";
    attendeeControls.style.display = "none";
    reviewSection.style.display = "none";

    document.getElementById("editBtn").href = `create-event.html?id=${event.id}`;
    document.getElementById("deleteBtn").addEventListener("click", () => {
      events = events.filter(e => e.id !== event.id);
      localStorage.setItem("events", JSON.stringify(events));
      alert("Event deleted.");
      window.location.href = "dashboard.html";
    });

  // ATTENDEE VIEW
  } else if (currentUser.role === "attendee") {
    organizerControls.style.display = "none";
    attendeeControls.style.display = "block";
    reviewSection.style.display = "block";

    const registerBtn = document.getElementById("registerBtn");
    const alreadyRegistered = (registrations[event.id] || []).includes(currentUser.username);

    if (alreadyRegistered) {
      registerBtn.textContent = "Registered";
      registerBtn.disabled = true;
    } else {
      registerBtn.addEventListener("click", () => {
        console.log("Register button clicked");
        if (!registrations[event.id]) registrations[event.id] = [];
        registrations[event.id].push(currentUser.username);
        localStorage.setItem("registrations", JSON.stringify(registrations));
        alert("You have registered for this event!");
        registerBtn.textContent = "Registered";
        registerBtn.disabled = true;
        renderRegisteredUsers();
      });
    }

    // Submit review
    document.getElementById("submitReviewBtn").addEventListener("click", () => {
      const reviewText = document.getElementById("reviewText").value.trim();
      const rating = document.getElementById("ratingSelect").value;

      if (!reviewText || !rating) {
        alert("Please provide both review and rating.");
        return;
      }

      reviews.push({
        eventId: event.id,
        user: currentUser.username,
        rating,
        text: reviewText
      });

      localStorage.setItem("reviews", JSON.stringify(reviews));
      alert("Review submitted!");
      document.getElementById("reviewText").value = "";
      document.getElementById("ratingSelect").value = "";
      renderReviews();
    });

  // UNKNOWN ROLE
  } else {
    organizerControls.style.display = "none";
    attendeeControls.style.display = "none";
    reviewSection.style.display = "none";
  }

  // Show reviews
  function renderReviews() {
    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = "";
    const eventReviews = reviews.filter(r => r.eventId === event.id);

    if (eventReviews.length === 0) {
      reviewsList.innerHTML = "<li>No reviews yet.</li>";
    } else {
      eventReviews.forEach(r => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${r.user}</strong> (${r.rating}⭐): ${r.text}`;
        reviewsList.appendChild(li);
      });
    }
  }

  // Show registered users
  function renderRegisteredUsers() {
    const registeredList = document.getElementById("registeredUsersList");
    const users = registrations[event.id] || [];

    registeredList.innerHTML = "";
    if (users.length === 0) {
      registeredList.innerHTML = "<li>No attendees registered yet.</li>";
    } else {
      users.forEach(u => {
        const li = document.createElement("li");
        li.textContent = u;
        registeredList.appendChild(li);
      });
    }
  }

  renderReviews();
  renderRegisteredUsers();
});
