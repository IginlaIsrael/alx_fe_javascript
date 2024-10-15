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
      populateCategories(); // Update categories if a new one is added
      alert("New quote added successfully!");
  
      // Clear input fields after adding the new quote
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
    } else {
      alert("Please fill in both the quote text and the category.");
    }
  }
  
  // Function to populate the category dropdown dynamically
  function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  
    // Clear previous options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
    // Add unique categories to the dropdown
    uniqueCategories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Function to filter quotes based on the selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
  
    // Display the first filtered quote (or message if no quotes)
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (filteredQuotes.length > 0) {
      const firstQuote = filteredQuotes[0];
      quoteDisplay.innerHTML = `"${firstQuote.text}"<br><small>— Category: ${firstQuote.category}</small>`;
    } else {
      quoteDisplay.innerHTML = "No quotes found for this category.";
    }
  
    // Save the selected category to localStorage
    localStorage.setItem("selectedCategory", selectedCategory);
  }
  
  // Function to load the last selected category filter from localStorage
  function loadSelectedCategory() {
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";
    document.getElementById("categoryFilter").value = selectedCategory;
    filterQuotes(); // Apply the filter immediately based on the saved category
  }
  
  // Function to export quotes as a JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.click();
    URL.revokeObjectURL(url); // Clean up URL object
  }
  
  // Add event listener for the Export Quotes button
  document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
  
  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes(); // Save the updated quotes to localStorage
          populateCategories(); // Update categories
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON format.');
        }
      } catch (error) {
        alert('Error reading file: ' + error.message);
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Event listener for the "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Load the last viewed quote from sessionStorage (if available)
  window.onload = function () {
    populateCategories();  // Populate the category dropdown on page load
    loadSelectedCategory(); // Load and apply the last selected category filter
  
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
      const quoteDisplay = document.getElementById("quoteDisplay");
      quoteDisplay.innerHTML = `"${lastQuote.text}"<br><small>— Category: ${lastQuote.category}</small>`;
    }
  };
  