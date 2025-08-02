let predefinedRecipes = [
    {
      title: "Pasta Aglio e Olio",
      ingredients: ["200g spaghetti", "4 cloves garlic", "1 tsp chili flakes", "3 tbsp olive oil", "Salt", "Parsley"],
      instructions: "Boil pasta. Heat oil and garlic. Add chili flakes. Mix with pasta. Garnish with parsley."
    },
    {
      title: "Grilled Cheese Sandwich",
      ingredients: ["2 slices bread", "2 slices cheese", "Butter"],
      instructions: "Butter bread. Add cheese. Grill until golden brown."
    }
  ];
  
  let userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
  let allRecipes = [...predefinedRecipes, ...userRecipes];
  let currentRecipeIndex = null;
  
  const titleEl = document.getElementById("recipe-title");
  const ingredientsEl = document.getElementById("recipe-ingredients");
  const instructionsEl = document.getElementById("recipe-instructions");
  const actionBtns = document.getElementById("action-buttons");
  
  document.getElementById("generate-btn").addEventListener("click", () => {
    const index = Math.floor(Math.random() * allRecipes.length);
    displayRecipe(index);
  });
  
  document.getElementById("add-btn").addEventListener("click", () => {
    const title = document.getElementById("new-title").value.trim();
    const ingredientsRaw = document.getElementById("new-ingredients").value.trim();
    const instructions = document.getElementById("new-instructions").value.trim();
  
    if (!title || !ingredientsRaw || !instructions) {
      alert("Please fill all fields.");
      return;
    }
  
    const ingredients = ingredientsRaw.split(",").map(i => i.trim());
    const recipe = { title, ingredients, instructions };
  
    const editMode = document.getElementById("add-btn").textContent === "Update Recipe";
  
    if (editMode && currentRecipeIndex >= predefinedRecipes.length) {
      const localIndex = currentRecipeIndex - predefinedRecipes.length;
      userRecipes[localIndex] = recipe;
      alert("Recipe updated!");
    } else {
      userRecipes.push(recipe);
      alert("Recipe added!");
    }
  
    localStorage.setItem("userRecipes", JSON.stringify(userRecipes));
    resetForm();
    refreshAllRecipes();
  });
  
  function displayRecipe(index) {
    const recipe = allRecipes[index];
    currentRecipeIndex = index;
  
    titleEl.textContent = recipe.title;
    ingredientsEl.innerHTML = "";
    recipe.ingredients.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      ingredientsEl.appendChild(li);
    });
    instructionsEl.textContent = recipe.instructions;
  
    // Show action buttons for user recipes only
    actionBtns.style.display = index >= predefinedRecipes.length ? "flex" : "none";
  }
  
  function editCurrentRecipe() {
    if (currentRecipeIndex === null) return;
  
    const recipe = allRecipes[currentRecipeIndex];
    document.getElementById("new-title").value = recipe.title;
    document.getElementById("new-ingredients").value = recipe.ingredients.join(", ");
    document.getElementById("new-instructions").value = recipe.instructions;
  
    document.getElementById("form-title").textContent = "Edit Recipe";
    document.getElementById("add-btn").textContent = "Update Recipe";
  }
  
  function deleteCurrentRecipe() {
    if (currentRecipeIndex === null || currentRecipeIndex < predefinedRecipes.length) return;
  
    const localIndex = currentRecipeIndex - predefinedRecipes.length;
    if (confirm("Are you sure you want to delete this recipe?")) {
      userRecipes.splice(localIndex, 1);
      localStorage.setItem("userRecipes", JSON.stringify(userRecipes));
      refreshAllRecipes();
      alert("Recipe deleted!");
      resetRecipeView();
    }
  }
  
  function shareCurrentRecipe() {
    const url = `${window.location.origin}${window.location.pathname}?recipe=${currentRecipeIndex}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard:\n" + url);
  }
  
  function refreshAllRecipes() {
    allRecipes = [...predefinedRecipes, ...userRecipes];
  }
  
  function resetForm() {
    document.getElementById("new-title").value = "";
    document.getElementById("new-ingredients").value = "";
    document.getElementById("new-instructions").value = "";
    document.getElementById("form-title").textContent = "Add Your Own Recipe";
    document.getElementById("add-btn").textContent = "Add Recipe";
  }
  
  function resetRecipeView() {
    titleEl.textContent = "Press the button to generate a recipe";
    ingredientsEl.innerHTML = "";
    instructionsEl.textContent = "";
    actionBtns.style.display = "none";
    currentRecipeIndex = null;
  }
  
  // Load recipe by URL
  function loadRecipeFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("recipe"));
    if (!isNaN(id) && id >= 0 && id < allRecipes.length) {
      displayRecipe(id);
    }
  }
  
  refreshAllRecipes();
  loadRecipeFromURL();
  