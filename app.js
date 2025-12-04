// just fake courses with silly instructor names so it does not match real classes

const courses = [
  {
    id: "fruit-101",
    code: "FRUIT 101",
    title: "Introduction to Fruit Logic",
    instructor: "Prof. Lemon",
    schedule: "Mon / Wed 3:00–4:15 PM",
    status: "Full",
    seatsTaken: 35,
    capacity: 35
  },
  {
    id: "cake-200",
    code: "CAKE 200",
    title: "Advanced Cake Structures",
    instructor: "Dr. Cupcake",
    schedule: "Tue / Thu 9:00–10:15 AM",
    status: "Open",
    seatsTaken: 18,
    capacity: 30
  },
  {
    id: "tea-150",
    code: "TEA 150",
    title: "Brewing Methods I",
    instructor: "Prof. Mochi",
    schedule: "Mon / Wed 10:00–11:15 AM",
    status: "Waitlist",
    seatsTaken: 55,
    capacity: 50
  },
  {
    id: "pet-230",
    code: "PET 230",
    title: "Intro to Small Pets",
    instructor: "Dr. Brownie",
    schedule: "Fri 1:00–3:50 PM",
    status: "Full",
    seatsTaken: 40,
    capacity: 40
  },
  {
    id: "mochi-300",
    code: "MOCHI 300",
    title: "Soft Principles of Mochi",
    instructor: "Prof. Melon",
    schedule: "Tue / Thu 2:00–3:15 PM",
    status: "Open",
    seatsTaken: 27,
    capacity: 30
  },
  {
    id: "bubble-120",
    code: "BUBBLE 120",
    title: "Bubble Tea Fundamentals",
    instructor: "Dr. Pudding",
    schedule: "Mon / Wed / Fri 11:00–11:50 AM",
    status: "Full",
    seatsTaken: 60,
    capacity: 60
  }
];

const STORAGE_KEY = "seatifyWatchedCourses";

let watchedIds = [];
let lastStatuses = {};
let firstSimRun = true;

const courseListEl = document.getElementById("course-list");
const watchlistEl = document.getElementById("watchlist");
const notificationsEl = document.getElementById("notifications");

function loadWatchedFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      watchedIds = parsed;
    }
  } catch (e) {
    watchedIds = [];
  }
}

function saveWatched() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedIds));
}

function isWatched(id) {
  return watchedIds.includes(id);
}

function renderCourses() {
  courseListEl.innerHTML = "";
  courses.forEach(course => {
    const card = document.createElement("article");
    card.className = "course-card";
    card.dataset.id = course.id;

    const main = document.createElement("div");
    main.className = "course-main";

    const titleWrap = document.createElement("div");
    titleWrap.className = "course-title-wrap";

    const codeEl = document.createElement("div");
    codeEl.className = "course-code";
    codeEl.textContent = course.code;

    const titleEl = document.createElement("div");
    titleEl.className = "course-title";
    titleEl.textContent = course.title;

    titleWrap.appendChild(codeEl);
    titleWrap.appendChild(titleEl);

    const statusEl = document.createElement("div");
    statusEl.className = "status-pill " + getStatusClass(course.status);
    statusEl.textContent = course.status.toLowerCase();

    main.appendChild(titleWrap);
    main.appendChild(statusEl);

    const meta = document.createElement("div");
    meta.className = "course-meta";

    const inst = document.createElement("div");
    inst.className = "meta-chip";
    inst.innerHTML = '<span class="meta-dot"></span><span>' + course.instructor + "</span>";

    const sched = document.createElement("div");
    sched.className = "meta-chip";
    sched.innerHTML = '<span class="meta-dot"></span><span>' + course.schedule + "</span>";

    meta.appendChild(inst);
    meta.appendChild(sched);

    const footer = document.createElement("div");
    footer.className = "course-footer";

    const seatInfo = document.createElement("div");
    seatInfo.className = "seat-info";
    seatInfo.textContent = course.seatsTaken + " / " + course.capacity + " seats";

    const btn = document.createElement("button");
    btn.className = "watch-btn";
    btn.type = "button";
    btn.dataset.id = course.id;
    updateWatchButton(btn, course.id);

    footer.appendChild(seatInfo);
    footer.appendChild(btn);

    card.appendChild(main);
    card.appendChild(meta);
    card.appendChild(footer);

    courseListEl.appendChild(card);
  });
}

function renderWatchlist() {
  if (watchedIds.length === 0) {
    watchlistEl.className = "watchlist-empty";
    watchlistEl.innerHTML = '<p>You are not watching anything yet. Click "watch" on a course to start.</p>';
    return;
  }

  watchlistEl.className = "watchlist-list";
  watchlistEl.innerHTML = "";

  watchedIds.forEach(id => {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    const row = document.createElement("div");
    row.className = "watchlist-item";

    const left = document.createElement("div");
    left.innerHTML = '<span class="code">' + course.code + "</span> – " + course.title;

    const right = document.createElement("div");
    right.innerHTML = "<small>" + course.status.toLowerCase() + "</small>";

    row.appendChild(left);
    row.appendChild(right);

    watchlistEl.appendChild(row);
  });
}

function getStatusClass(status) {
  const s = status.toLowerCase();
  if (s === "open") return "status-open";
  if (s === "waitlist") return "status-waitlist";
  return "status-full";
}

function updateWatchButton(btn, id) {
  const watching = isWatched(id);
  if (watching) {
    btn.classList.add("watching");
    btn.innerHTML = "<span>★</span> Watching";
  } else {
    btn.classList.remove("watching");
    btn.innerHTML = "<span>☆</span> Watch";
  }
}

function toggleWatch(id) {
  if (isWatched(id)) {
    watchedIds = watchedIds.filter(x => x !== id);
  } else {
    watchedIds.push(id);
  }
  saveWatched();
  document.querySelectorAll('.watch-btn[data-id="' + id + '"]').forEach(btn => {
    updateWatchButton(btn, id);
  });
  renderWatchlist();
}

courseListEl.addEventListener("click", e => {
  const btn = e.target.closest(".watch-btn");
  if (!btn) return;
  const id = btn.dataset.id;
  if (!id) return;
  toggleWatch(id);
});

function showNotification(msg) {
  const wrapper = document.createElement("div");
  wrapper.className = "notification";

  const icon = document.createElement("div");
  icon.className = "notification-icon";
  icon.textContent = "✨";

  const text = document.createElement("div");
  text.className = "notification-message";
  text.textContent = msg;

  const close = document.createElement("button");
  close.className = "notification-close";
  close.type = "button";
  close.textContent = "x";

  close.addEventListener("click", () => {
    wrapper.remove();
  });

  wrapper.appendChild(icon);
  wrapper.appendChild(text);
  wrapper.appendChild(close);

  notificationsEl.appendChild(wrapper);

  setTimeout(() => {
    wrapper.remove();
  }, 8000);
}

function initStatuses() {
  courses.forEach(c => {
    lastStatuses[c.id] = c.status;
  });
}

function simulateStatusChanges() {
  // this is fake on purpose, just to show that something is happening
  courses.forEach(c => {
    if (c.id === "fruit-101") {
      // flip between full and open
      if (c.status === "Full") {
        c.status = "Open";
        c.seatsTaken = Math.max(0, c.capacity - 1);
      } else if (c.status === "Open") {
        c.status = "Full";
        c.seatsTaken = c.capacity;
      }
    }
    if (c.id === "pet-230") {
      // cycle waitlist -> open -> full -> waitlist
      if (c.status === "Waitlist") {
        c.status = "Open";
        c.seatsTaken = c.capacity - 1;
      } else if (c.status === "Open") {
        c.status = "Full";
        c.seatsTaken = c.capacity;
      } else if (c.status === "Full") {
        c.status = "Waitlist";
        c.seatsTaken = c.capacity + 3;
      }
    }
  });

  courses.forEach(c => {
    const prev = lastStatuses[c.id];
    if (prev !== "Open" && c.status === "Open" && isWatched(c.id)) {
      showNotification("A seat opened in " + c.code + " – " + c.title);
    }
    lastStatuses[c.id] = c.status;
  });

  renderCourses();
  renderWatchlist();
}

document.addEventListener("DOMContentLoaded", () => {
  loadWatchedFromStorage();
  initStatuses();
  renderCourses();
  renderWatchlist();

  setTimeout(() => {
    simulateStatusChanges();
  }, 5000);

  setInterval(() => {
    simulateStatusChanges();
  }, 30000);
});


