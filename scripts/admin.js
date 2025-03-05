// DOM elements
const recipeForm = document.getElementById("recipe-form");
const ingredientsContainer = document.getElementById("ingredients-container");
const instructionsContainer = document.getElementById("instructions-container");
const tipsContainer = document.getElementById("tips-container");
const addIngredientBtn = document.getElementById("add-ingredient");
const addInstructionBtn = document.getElementById("add-instruction");
const addTipBtn = document.getElementById("add-tip");
const successMessage = document.getElementById("success-message");
const errorMessage = document.getElementById("error-message");

// Initialize the admin page
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Add ingredient button
  addIngredientBtn.addEventListener("click", function () {
    addListItem(ingredientsContainer, "ingredient-input", "text");
  });

  // Add instruction button
  addInstructionBtn.addEventListener("click", function () {
    addListItem(instructionsContainer, "instruction-input", "textarea");
  });

  // Add tip button
  addTipBtn.addEventListener("click", function () {
    addListItem(tipsContainer, "tip-input", "text");
  });

  // Setup remove buttons for existing items
  setupRemoveButtons();

  // Form submission
  recipeForm.addEventListener("submit", handleFormSubmit);
}

// Add a new list item (ingredient, instruction, or tip)
function addListItem(container, inputClass, inputType) {
  const listItem = document.createElement("div");
  listItem.className = "list-item";

  let input;
  if (inputType === "textarea") {
    input = document.createElement("textarea");
    input.className = `form-textarea ${inputClass}`;
  } else {
    input = document.createElement("input");
    input.type = "text";
    input.className = `form-input ${inputClass}`;
  }

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "×";
  removeBtn.addEventListener("click", function () {
    container.removeChild(listItem);
  });

  listItem.appendChild(input);
  listItem.appendChild(removeBtn);
  container.appendChild(listItem);

  // Focus the new input
  input.focus();
}

// Setup remove buttons for existing items
function setupRemoveButtons() {
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const listItem = this.parentElement;
      const container = listItem.parentElement;

      // Make sure there's at least one item left
      if (container.children.length > 1) {
        container.removeChild(listItem);
      } else {
        // Clear the input instead of removing it
        const input = listItem.querySelector("input, textarea");
        if (input) {
          input.value = "";
        }
      }
    });
  });
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();

  // Hide messages
  successMessage.style.display = "none";
  errorMessage.style.display = "none";

  // Get form values
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const imageFile = document.getElementById("image").files[0];
  const time = parseInt(document.getElementById("time").value);
  const difficulty = document.getElementById("difficulty").value;
  const servings = parseInt(document.getElementById("servings").value);

  // Get ingredients
  const ingredients = [];
  document.querySelectorAll(".ingredient-input").forEach((input) => {
    const value = input.value.trim();
    if (value) {
      ingredients.push(value);
    }
  });

  // Get instructions
  const instructions = [];
  document.querySelectorAll(".instruction-input").forEach((input) => {
    const value = input.value.trim();
    if (value) {
      instructions.push(value);
    }
  });

  // Get tips
  const tips = [];
  document.querySelectorAll(".tip-input").forEach((input) => {
    const value = input.value.trim();
    if (value) {
      tips.push(value);
    }
  });

  // Validate form
  if (
    !title ||
    !description ||
    !imageFile ||
    !time ||
    ingredients.length === 0 ||
    instructions.length === 0
  ) {
    errorMessage.textContent = "Bitte fülle alle Pflichtfelder aus.";
    errorMessage.style.display = "block";
    return;
  }

  // Generate a unique ID for the recipe
  const id = generateRecipeId(title);

  // Create recipe object
  const recipe = {
    id,
    title,
    description,
    category,
    image: `${id}.jpg`, // We'll save the image with this filename
    time,
    difficulty,
    servings,
    ingredients,
    instructions,
    tips,
    date: new Date().toISOString(),
  };

  // Simulate saving the recipe - In a real implementation this would send data to a server
  // Here we're just showing how it would be formatted
  console.log("Saving recipe:", recipe);

  // In a real implementation, this would upload the image and save the recipe data
  simulateSaveRecipe(recipe, imageFile)
    .then(() => {
      successMessage.style.display = "block";
      recipeForm.reset();

      // Scroll to top to show the success message
      window.scrollTo(0, 0);

      // Reset containers to initial state
      resetContainers();
    })
    .catch((error) => {
      errorMessage.textContent = `Fehler: ${error.message}`;
      errorMessage.style.display = "block";
    });
}

// Generate a recipe ID from the title
function generateRecipeId(title) {
  // Convert title to lowercase, remove special characters, and replace spaces with hyphens
  const base = title
    .toLowerCase()
    .replace(/[äöüß]/g, (match) =>
      match === "ä" ? "ae" : match === "ö" ? "oe" : match === "ü" ? "ue" : "ss",
    )
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Add a timestamp to ensure uniqueness
  return `${base}-${Date.now()}`;
}

// Reset containers to initial state
function resetContainers() {
  // Reset ingredients container
  ingredientsContainer.innerHTML = "";
  for (let i = 0; i < 2; i++) {
    addListItem(ingredientsContainer, "ingredient-input", "text");
  }

  // Reset instructions container
  instructionsContainer.innerHTML = "";
  addListItem(instructionsContainer, "instruction-input", "textarea");

  // Reset tips container
  tipsContainer.innerHTML = "";
  addListItem(tipsContainer, "tip-input", "text");

  // Setup remove buttons
  setupRemoveButtons();
}

// Simulate saving the recipe (in a real implementation, this would send data to a server)
function simulateSaveRecipe(recipe, imageFile) {
  return new Promise((resolve, reject) => {
    // In a real implementation, this would be an API call to save the recipe
    // For this example, we'll just simulate success after a short delay
    setTimeout(() => {
      // Here we'd normally save the recipe to a database and upload the image
      // Since we can't do that in a static site, we'll just log what would happen
      console.log(`Recipe would be saved to recipes/${recipe.id}.json`);
      console.log(`Image would be saved to images/recipes/${recipe.image}`);
      console.log(`Recipe index would be updated to include this recipe`);

      // For the purpose of this demonstration, we'll consider it a success
      resolve();

      // In a real implementation, you'd have code like:
      /*
            fetch('/api/recipes', {
                method: 'POST',
                body: JSON.stringify(recipe),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to save recipe');
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
            */
    }, 1000);
  });
}
