// Global variables
let recipes = [];

// DOM elements
const homeContent = document.getElementById("home-content");
const singleRecipe = document.getElementById("single-recipe");
const allRecipesContent = document.getElementById("all-recipes-content");
const aboutContent = document.getElementById("about-content");
const recipesGrid = document.getElementById("recipes-grid");
const allRecipesGrid = document.getElementById("all-recipes-grid");
const allRecipesLink = document.getElementById("all-recipes-link");
const aboutLink = document.getElementById("about-link");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Load recipes
  loadRecipes();

  // Set up event listeners
  setupEventListeners();

  // Check for recipe in URL
  checkUrlForRecipe();
});

// Load recipes from JSON files
function loadRecipes() {
  fetch("recipes/index.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No recipes found");
      }
      return response.json();
    })
    .then((data) => {
      recipes = data;
      displayRecentRecipes();
    })
    .catch((error) => {
      console.error("Error loading recipes:", error);
      recipesGrid.innerHTML =
        "<p>Keine Rezepte gefunden. Füge ein neues Rezept hinzu!</p>";
    });
}

// Display the most recent recipes on the homepage
function displayRecentRecipes() {
  recipesGrid.innerHTML = "";

  // Sort recipes by date (newest first)
  const sortedRecipes = [...recipes].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // Display the 6 most recent recipes
  const recentRecipes = sortedRecipes.slice(0, 6);

  recentRecipes.forEach((recipe) => {
    recipesGrid.appendChild(createRecipeCard(recipe));
  });
}

// Display all recipes
function displayAllRecipes() {
  allRecipesGrid.innerHTML = "";

  // Sort recipes alphabetically by title
  const sortedRecipes = [...recipes].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  sortedRecipes.forEach((recipe) => {
    allRecipesGrid.appendChild(createRecipeCard(recipe));
  });
}

// Create a recipe card element
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.dataset.id = recipe.id;

  const imageUrl = recipe.image
    ? `images/recipes/${recipe.image}`
    : "images/placeholder.jpg";

  card.innerHTML = `
        <div class="recipe-image" style="background-image: url('${imageUrl}')"></div>
        <div class="recipe-content">
            <h3 class="recipe-title">${recipe.title}</h3>
            <div class="recipe-meta">
                <span>${formatDate(recipe.date)}</span>
                <span>${recipe.time} Min</span>
            </div>
            <p class="recipe-excerpt">${recipe.description.substring(0, 100)}...</p>
            <span class="read-more">Weiterlesen</span>
        </div>
    `;

  card.addEventListener("click", () => {
    showRecipe(recipe.id);
  });

  return card;
}

// Format date to German format
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Show a single recipe
function showRecipe(recipeId) {
  const recipe = recipes.find((r) => r.id === recipeId);

  if (!recipe) {
    console.error("Recipe not found:", recipeId);
    return;
  }

  // Update URL without refreshing the page
  window.history.pushState({ recipeId }, recipe.title, `?recipe=${recipeId}`);

  // Hide other sections and show recipe detail
  homeContent.style.display = "none";
  allRecipesContent.style.display = "none";
  aboutContent.style.display = "none";
  singleRecipe.style.display = "block";

  // Load the recipe detail
  loadRecipeDetail(recipe);
}

// Load recipe detail
function loadRecipeDetail(recipe) {
  const imageUrl = recipe.image
    ? `images/recipes/${recipe.image}`
    : "images/placeholder.jpg";

  let ingredientsHtml = '<ul class="ingredients-list" id="ingredients-list">';
  recipe.ingredients.forEach((ingredient) => {
    let amount = "";
    let unit = "";
    let name = ingredient;

    // Check if ingredient has amount and unit
    if (ingredient.includes(":")) {
      const parts = ingredient.split(":");
      amount = parts[0].trim();
      name = parts[1].trim();

      // Check if amount contains unit
      if (amount.includes(" ")) {
        const amountParts = amount.split(" ");
        amount = amountParts[0];
        unit = amountParts[1];
      }
    }

    if (amount) {
      ingredientsHtml += `<li><span class="ingredient-amount" data-original="${amount}">${amount}</span> ${unit} ${name}</li>`;
    } else {
      ingredientsHtml += `<li>${name}</li>`;
    }
  });
  ingredientsHtml += "</ul>";

  let instructionsHtml = '<ol class="instructions-list">';
  recipe.instructions.forEach((instruction) => {
    instructionsHtml += `<li>${instruction}</li>`;
  });
  instructionsHtml += "</ol>";

  let tipsHtml = "";
  if (recipe.tips && recipe.tips.length > 0) {
    tipsHtml = `
            <div class="recipe-section">
                <h2 class="recipe-section-title">Tipps</h2>
                <div class="tips-list">
                    ${recipe.tips.map((tip) => `<p>${tip}</p>`).join("")}
                </div>
            </div>
        `;
  }

  singleRecipe.innerHTML = `
        <a href="#" class="back-button" id="back-button">Zurück zur Übersicht</a>
        <div class="recipe-detail-header">
            <h1 class="recipe-detail-title">${recipe.title}</h1>
            <div class="recipe-detail-meta">
                <span>Veröffentlicht am: ${formatDate(recipe.date)}</span>
                <span>Kategorie: ${recipe.category || "Allgemein"}</span>
            </div>
            <img src="${imageUrl}" alt="${recipe.title}" class="recipe-detail-image" loading="lazy">
            <p class="recipe-detail-description">${recipe.description}</p>
        </div>

        <div class="recipe-info">
            <div class="info-item">
                <div class="info-label">Zubereitungszeit</div>
                <div class="info-value">${recipe.time} Min</div>
            </div>
            <div class="info-item">
                <div class="info-label">Schwierigkeit</div>
                <div class="info-value">${recipe.difficulty || "Mittel"}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Portionen</div>
                <div class="info-value">${recipe.servings || 4}</div>
            </div>
        </div>

        <!-- Portionsrechner -->
        <div class="servings-calculator">
            <span class="servings-label">Portionen anpassen:</span>
            <div class="servings-controls">
                <button class="servings-btn" id="decrease-servings">−</button>
                <input type="number" min="1" value="${recipe.servings || 4}" class="servings-input" id="servings-input">
                <button class="servings-btn" id="increase-servings">+</button>
            </div>
            <div class="servings-info">Die Zutatenmengen werden automatisch angepasst.</div>
        </div>

        <div class="recipe-section">
            <h2 class="recipe-section-title">Zutaten</h2>
            ${ingredientsHtml}
        </div>

        <div class="recipe-section">
            <h2 class="recipe-section-title">Zubereitung</h2>
            ${instructionsHtml}
        </div>

        ${tipsHtml}
    `;

  // Add event listeners for the portions calculator
  setupPortionsCalculator();

  // Add event listener for the back button
  document
    .getElementById("back-button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      goBack();
    });
}

// Setup portions calculator
function setupPortionsCalculator() {
  const servingsInput = document.getElementById("servings-input");
  const decreaseBtn = document.getElementById("decrease-servings");
  const increaseBtn = document.getElementById("increase-servings");
  const ingredientAmounts = document.querySelectorAll(".ingredient-amount");

  if (!servingsInput || !decreaseBtn || !increaseBtn) return;

  // Get original servings
  const originalServings = parseInt(servingsInput.value);

  // Update ingredient amounts based on portions
  function updateIngredients() {
    const newServings = parseInt(servingsInput.value);
    const ratio = newServings / originalServings;

    ingredientAmounts.forEach((element) => {
      const originalAmount = parseFloat(element.getAttribute("data-original"));
      let newAmount = originalAmount * ratio;

      // Round values for better readability
      if (newAmount >= 10) {
        newAmount = Math.round(newAmount);
      } else if (newAmount >= 1) {
        newAmount = Math.round(newAmount * 2) / 2; // Round to 0.5
      } else {
        newAmount = Math.round(newAmount * 4) / 4; // Round to 0.25
      }

      // Format fractions
      if (newAmount % 1 === 0) {
        element.textContent = newAmount;
      } else if (newAmount === 0.25) {
        element.textContent = "¼";
      } else if (newAmount === 0.5) {
        element.textContent = "½";
      } else if (newAmount === 0.75) {
        element.textContent = "¾";
      } else {
        element.textContent = newAmount.toFixed(2).replace(".00", "");
      }

      // Highlight changes
      element.classList.add("highlight", "active");
      setTimeout(() => {
        element.classList.remove("active");
      }, 500);
    });
  }

  // Event listener for decrease button
  decreaseBtn.addEventListener("click", function () {
    if (parseInt(servingsInput.value) > 1) {
      servingsInput.value = parseInt(servingsInput.value) - 1;
      updateIngredients();
    }
  });

  // Event listener for increase button
  increaseBtn.addEventListener("click", function () {
    servingsInput.value = parseInt(servingsInput.value) + 1;
    updateIngredients();
  });

  // Event listener for direct input
  servingsInput.addEventListener("change", function () {
    if (parseInt(this.value) < 1) {
      this.value = 1;
    }
    updateIngredients();
  });

  // Focus handler
  servingsInput.addEventListener("focus", function () {
    this.select();
  });
}

// Check URL for recipe parameter
function checkUrlForRecipe() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("recipe");

  if (recipeId) {
    // Wait for recipes to load
    const checkRecipesLoaded = setInterval(() => {
      if (recipes.length > 0) {
        clearInterval(checkRecipesLoaded);
        showRecipe(recipeId);
      }
    }, 100);
  }
}

// Go back to previous view
function goBack() {
  // Remove recipe parameter from URL
  window.history.pushState({}, document.title, window.location.pathname);

  // Hide recipe detail and show home content
  singleRecipe.style.display = "none";
  homeContent.style.display = "block";
}

// Setup event listeners
function setupEventListeners() {
  // All recipes link
  allRecipesLink.addEventListener("click", function (e) {
    e.preventDefault();
    displayAllRecipes();

    homeContent.style.display = "none";
    singleRecipe.style.display = "none";
    aboutContent.style.display = "none";
    allRecipesContent.style.display = "block";
  });

  // About link
  aboutLink.addEventListener("click", function (e) {
    e.preventDefault();

    homeContent.style.display = "none";
    singleRecipe.style.display = "none";
    allRecipesContent.style.display = "none";
    aboutContent.style.display = "block";
  });

  // Search functionality
  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });
}

// Perform search
function performSearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) return;

  // Filter recipes by search query
  const searchResults = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      (recipe.category && recipe.category.toLowerCase().includes(query)),
  );

  // Display search results
  allRecipesGrid.innerHTML = "";

  if (searchResults.length === 0) {
    allRecipesGrid.innerHTML = "<p>Keine Rezepte gefunden.</p>";
  } else {
    searchResults.forEach((recipe) => {
      allRecipesGrid.appendChild(createRecipeCard(recipe));
    });
  }

  // Show all recipes section with search results
  homeContent.style.display = "none";
  singleRecipe.style.display = "none";
  aboutContent.style.display = "none";
  allRecipesContent.style.display = "block";

  // Update section title
  document.querySelector("#all-recipes-content .section-title").textContent =
    `Suchergebnisse für "${query}" (${searchResults.length})`;
}
