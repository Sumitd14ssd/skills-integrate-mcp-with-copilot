document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const sortSelect = document.getElementById("sort-select");

  let activitiesData = {};
  let categories = new Set();

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();
      activitiesData = activities;

      // Collect categories
      categories = new Set();
      Object.values(activities).forEach((details) => {
        if (details.category) categories.add(details.category);
      });
      renderCategoryOptions();
      renderActivityOptions();
      renderActivities();
    } catch (error) {
      activitiesList.innerHTML =
        "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  function renderCategoryOptions() {
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  function renderActivityOptions() {
    activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
    Object.entries(activitiesData).forEach(([name, details]) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      activitySelect.appendChild(opt);
    });
  }

  function renderActivities() {
    let filtered = Object.entries(activitiesData);

    // Filter by category
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
      filtered = filtered.filter(([_, details]) => details.category === selectedCategory);
    }

    // Search by name
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(([name]) => name.toLowerCase().includes(searchTerm));
    }

    // Sort
    if (sortSelect.value === "name") {
      filtered.sort((a, b) => a[0].localeCompare(b[0]));
    } else if (sortSelect.value === "date") {
      filtered.sort((a, b) => {
        const dateA = a[1].date || "";
        const dateB = b[1].date || "";
        return dateA.localeCompare(dateB);
      });
    }

    activitiesList.innerHTML = "";
    if (filtered.length === 0) {
      activitiesList.innerHTML = "<p>No activities found.</p>";
      return;
    }
    filtered.forEach(([name, details]) => {
      const card = document.createElement("div");
      card.className = "activity-card";
      card.innerHTML = `<h4>${name}</h4><p>${details.description || ""}</p>`;
      activitiesList.appendChild(card);
    });
  }

  // Event listeners for filters
  searchInput.addEventListener("input", renderActivities);
  categoryFilter.addEventListener("change", renderActivities);
  sortSelect.addEventListener("change", renderActivities);

  // Handle unregister functionality
  async function handleUnregister(event) { /* ...existing code... */ }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => { /* ...existing code... */ });

  // Initialize app
  fetchActivities();
});
