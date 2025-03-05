// Recipe Loader - Utility functions for loading and displaying recipes

// Load a specific recipe by ID
function loadRecipeById(recipeId) {
  return fetch(`recipes/${recipeId}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Recipe not found: ${recipeId}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error loading recipe:", error);
      return null;
    });
}

// Format recipe data for display
function formatRecipeData(recipe) {
  // Convert timestamp to readable date
  if (recipe.date) {
    const date = new Date(recipe.date);
    recipe.formattedDate = date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Process ingredients to separate amounts and units
  if (recipe.ingredients) {
    recipe.processedIngredients = recipe.ingredients.map((ingredient) => {
      const parts = ingredient.split(":");
      if (parts.length > 1) {
        const amountParts = parts[0].trim().split(" ");
        return {
          amount: amountParts[0],
          unit: amountParts.length > 1 ? amountParts[1] : "",
          name: parts[1].trim(),
        };
      } else {
        return {
          amount: "",
          unit: "",
          name: ingredient.trim(),
        };
      }
    });
  }

  return recipe;
}

// Export functions for use in other scripts
if (typeof module !== "undefined") {
  module.exports = {
    loadRecipeById,
    formatRecipeData,
  };
}
