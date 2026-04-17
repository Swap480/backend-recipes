const { initializeDatabase } = require("./db/db.connect")
const Recipe = require("./models/recipe.models")
initializeDatabase()

const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(cors())
app.use(express.json())

//3. Create an API with route "/recipes" to create a new recipe in the recipes database. Make sure to handle errors properly. 
// Test your API with Postman. Add the following recipe:

// {
//   "title": "Spaghetti Carbonara",
//   "author": "Sanjeev Kapoor",
//   "difficulty": "Intermediate",
//   "prepTime": 20,
//   "cookTime": 15,
//   "ingredients": [
//     "200g spaghetti",
//     "100g guanciale or pancetta, diced",
//     "2 large eggs",
//     "50g grated Pecorino Romano cheese",
//     "Salt and black pepper to taste"
//   ],
//   "instructions": [
//     "Cook the spaghetti in boiling salted water until al dente.",
//     "Meanwhile, sauté the guanciale or pancetta until crispy.",
//     "In a bowl, whisk together eggs and grated cheese.",
//     "Drain the spaghetti and immediately toss with the egg mixture and cooked guanciale/pancetta.",
//     "Season with salt and pepper. Serve immediately."
//   ],
//   "imageUrl": "https://example.com/spaghetti_carbonara.jpg"
// }

async function createRecipe (newRecipe) {
    try {
        const recipe = new Recipe(newRecipe)
        const saveRecipe = await recipe.save()
        return saveRecipe
    } catch (error) {
        throw error
    }
}

app.post("/recipes", async (req, res) => {
    try {
        const saveRecipe = await createRecipe(req.body)
        if(!saveRecipe.title || !saveRecipe.author || !saveRecipe.difficulty || !saveRecipe.prepTime || !saveRecipe.cookTime || !saveRecipe.ingredients || !saveRecipe.instructions || !saveRecipe.imageUrl){
            res.status(400).json({ error: "title, author, difficulty, prepTime, cookTime, ingredient, instruction, imageURL are required."})
        } else {         
            res.status(200).json({ message: "New recepie data posted succesfully.", Recipe: saveRecipe })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to post new Recipe."})
    }
})

// Issue faced while running the function 
// ingredients spell mismatch

//4. Run your API and create another recipe data in the database.
// {
//   "title": "Chicken Tikka Masala",
//   "author": "Sanjeev Kapoor",
//   "difficulty": "Intermediate",
//   "prepTime": 30,
//   "cookTime": 30,
//   "ingredients": [
//     "500g boneless, skinless chicken thighs, cut into bite-sized pieces",
//     "1 cup plain yogurt",
//     "2 tablespoons vegetable oil",
//     "2 onions, finely chopped",
//     "4 cloves garlic, minced",
//     "1-inch piece of ginger, grated",
//     "2 teaspoons ground coriander",
//     "1 teaspoon ground cumin",
//     "1 teaspoon paprika",
//     "1/2 teaspoon turmeric",
//     "1/2 teaspoon cayenne pepper (adjust to taste)",
//     "1 cup tomato puree",
//     "1 cup heavy cream",
//     "Salt and cilantro leaves for garnish"
//   ],
//   "instructions": [
//     "Marinate chicken pieces in yogurt and spices for at least 1 hour.",
//     "Heat oil in a pan and sauté onions, garlic, and ginger until golden.",
//     "Add marinated chicken and cook until browned.",
//     "Stir in tomato puree and cook until chicken is cooked through.",
//     "Add cream, season with salt, and simmer for a few minutes.",
//     "Garnish with cilantro leaves and serve with rice or naan."
//   ],
//   "imageUrl": "https://example.com/chicken_tikka_masala.jpg"
// }

//5. Run your API and create another recipe data in the database.

// {
//   title: 'Classic Chocolate Chip Cookies',
//   author: 'Baker Betty',
//   difficulty: 'Easy',
//   prepTime: 15,
//   cookTime: 10,
//   ingredients: [
//     '1 cup (2 sticks) unsalted butter, softened',
//     '3/4 cup granulated sugar',
//     '3/4 cup packed light brown sugar',
//     '1 teaspoon vanilla extract',
//     '2 large eggs',
//     '2 1/4 cups all-purpose flour',
//     '1 teaspoon baking soda',
//     '1/2 teaspoon salt',
//     '2 cups semisweet chocolate chips'
//   ],
//   instructions: [
//     'Preheat the oven to 375°F (190°C). Line baking sheets with parchment paper.',
//     'In a large bowl, cream together the butter, granulated sugar, and brown sugar until smooth.',
//     'Beat in the vanilla extract and eggs one at a time until well blended.',
//     'Combine the flour, baking soda, and salt; gradually stir into the creamed mixture.',
//     'Stir in the chocolate chips by hand using a wooden spoon.',
//     'Drop by rounded spoonfuls onto the prepared baking sheets.',
//     'Bake for 8 to 10 minutes in the preheated oven, or until edges are golden.',
//     'Allow cookies to cool on baking sheet for 5 minutes before transferring to a wire rack to cool completely.'
//   ],
//   imageUrl: 'https://example.com/classic_chocolate_chip_cookies.jpg'
// }

//6. Create an API to get all the recipes in the database as a response. Make sure to handle errors properly.

async function readAllRecipe () {
    try {
        const allRecipe = await Recipe.find()
        return allRecipe
    } catch (error) {
        throw error
    }
}

app.get("/recipes", async (req, res) => {
    try {
        const allRecipe = await readAllRecipe()
        if(allRecipe){
            res.json(allRecipe)
        } else {
            res.status(404).json({ error: "Recipe not found."})
        }
    } catch (error) {
            res.status(500).json({ error: "Failed to get Recipe data."})
    }
})

//7. Create an API to get a recipe's details by its title. Make sure to handle errors properly.

async function readRecipeByTitle (recipeTitle) {
    try {
        const recipeByTitle = await Recipe.findOne({ title: recipeTitle })
        return recipeByTitle
    } catch (error) {
        throw error
    }
}

app.get("/recipes/title/:title", async (req, res) => {
    try {
        const recipeByTitle = await readRecipeByTitle(req.params.title)
        if(recipeByTitle){
            res.json(recipeByTitle)
        } else {
            res.status(404).json({ error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get Recipe details."})
    }
})

//8. Create an API to get details of all the recipes by an author. Make sure to handle errors properly.

async function readRecipeByAuthor (authorName) {
    try {
        const recipe = await Recipe.findOne({ author: authorName })
        return recipe
    } catch (error) {
        throw error
    }
}

app.get("/recipes/author/:author", async (req, res) => {
    try {
        const recipe = await readRecipeByAuthor(req.params.author)
        if(recipe){
            res.json(recipe)
        } else {
            res.status(404).json({ error: "Recipe with author not found."})
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Recipe data."})
    }
})

//9. Create an API to get all the recipes that are of "Easy" difficulty level.

async function readRecipeWithDifficulty(recipeDifficulty){
    try {
        const recipe = await Recipe.findOne({ difficulty: recipeDifficulty })
        return recipe
    } catch (error) {
        throw error
    }
}

app.get("/recipes/difficulty/:difficulty", async (req, res) => {
    try {
        const recipe = await readRecipeWithDifficulty(req.params.difficulty)
        if(recipe){
            res.json(recipe)
        } else {
            res.status(404).json({ error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get recipe details."})
    }
})

//10. Create an API to update a recipe's difficulty level with the help of its id.
// Update the difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy".
// Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.

async function readAndUpdateRecipe (recipeId, dataToUpdate) {
    try {
        const recipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true})
        return recipe
    } catch (error) {
        throw error
    }
}

app.post("/recipes/updateDifficulty/:recipeId", async (req, res) => {
    try {
        const recipe = await readAndUpdateRecipe(req.params.recipeId, req.body)
        if(recipe){
            res.status(200).json({ message: "Book details updated succesfully.", recipe: recipe})
        } else {
            res.status(404).json({ error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to find and update details."})
    }
})

//11. Create an API to update a recipe's prep time and cook time with the help of its title.
// Update the details of the recipe "Chicken Tikka Masala". 
// Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.
// Updated recipe data: { "prepTime": 40, "cookTime": 45 }

async function readRecipeAndUpdateByTitle (recipeTitle, dataToUpdate) {
    try {
        const recipe = await Recipe.findOneAndUpdate({ title: recipeTitle }, dataToUpdate, {new: true})
        return recipe
    } catch (error) {
        throw error
    }
}

app.post("/recipes/recipeTitle/:title", async (req, res) => {
    try {
        const recipe = await readRecipeAndUpdateByTitle(req.params.title, req.body)
        if(recipe){
            res.status(200).json({ message: "Recipe details updated successfully.", recipe: recipe})
        } else {
            res.status(404).json({ error: "Recipe not found." })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to updated recipe details." })
    }
})

//12. Create an API to delete a recipe with the help of a recipe id. Send an error message "Recipe not found" if the recipe does not exist.
//  Make sure to handle errors properly.

async function readAndDeleteRecipe (recipeId) {
    try {
        const recipe = await Recipe.findByIdAndDelete({ _id: recipeId })
        return recipe
    } catch (error) {
        throw error
    }
}

app.delete("/recipes/delete/:id", async (req, res) => {
    try {
        const recipe = await readAndDeleteRecipe(req.params.id)
        if(recipe){
            res.status(200).json({ message: "Recipe details deleted succesfully.", recipe: recipe})
        } else {
            res.status(404).json({ error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete recipe details"})
    }
    
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})