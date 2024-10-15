// Initialize the quotes array, loading from localStorage if available
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not watch the clock; do what it does. Keep going.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  ];
  
  // Function to save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${randomQuote.text}"<br><small>— Category: ${randomQuote.category}</small>`;
  
    // Save the last viewed quote to sessionStorage
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  }
  
  // Function to add a new quote to the array and save to localStorage
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText.trim() !== "" && newQuoteCategory.trim() !== "") {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes(); // Save the updated quotes array to localStorage
      alert("New quote added successfully!");
  
      // Clear input fields after adding the new quote
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
    } else {
      alert("Please fill in both the quote text and the category.");
    }
  }
  
  // Function to create and append the form dynamically to add new quotes
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
  
    // Create input fields for the new quote and category
    const inputQuote = document.createElement("input");
    inputQuote.setAttribute("id", "newQuoteText");
    inputQuote.setAttribute("type", "text");
    inputQuote.setAttribute("placeholder", "Enter a new quote");
  
    const inputCategory = document.createElement("input");
    inputCategory.setAttribute("id", "newQuoteCategory");
    inputCategory.setAttribute("type", "text");
    inputCategory.setAttribute("placeholder", "Enter quote category");
  
    // Create the add quote button
    const addQuoteButton = document.createElement("button");
    addQuoteButton.textContent = "Add Quote";
    addQuoteButton.addEventListener("click", addQuote);
  
    // Append the input fields and button to the form container
    formContainer.appendChild(inputQuote);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addQuoteButton);
  
    // Append the form container to the body or a specific div
    document.body.appendChild(formContainer);
  }
  
  // Event listener for the "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Call the createAddQuoteForm function to render the form on page load
  createAddQuoteForm();
  
  // Load the last viewed quote from sessionStorage (if available)
  window.onload = function () {
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
      const quoteDisplay = document.getElementById("quoteDisplay");
      quoteDisplay.innerHTML = `"${lastQuote.text}"<br><small>— Category: ${lastQuote.category}</small>`;
    }
  };
  