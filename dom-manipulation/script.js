// Initialize the quotes array, loading from localStorage if available
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not watch the clock; do what it does. Keep going.", category: "Motivation" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
];

// Server URL for simulating server interactions (JSONPlaceholder or similar)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';  

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

// Function to add a new quote and sync with server
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText.trim() !== "" && newQuoteCategory.trim() !== "") {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes(); // Save the updated quotes array to localStorage
    populateCategories(); // Update categories if a new one is added
    alert("New quote added successfully!");

    // Sync the new quote with the server
    postQuoteToServer(newQuote);

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

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    // Simulate quotes from server (JSONPlaceholder returns posts, so we'll adapt them as quotes)
    const formattedServerQuotes = serverQuotes.map(post => ({
      text: post.title,  // Use post title as the quote text
      category: "Server",  // Assign a default category for server quotes
    }));

    return formattedServerQuotes;
  } catch (error) {
    console.error("Error fetching quotes from the server:", error);
    return [];
  }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify(quote),
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync quote with the server');
    }

    const serverResponse = await response.json();
    console.log("Quote synced with server:", serverResponse);
  } catch (error) {
    console.error("Error syncing quote with server:", error);
  }
}

// Function to sync quotes and handle conflicts
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Identify conflicts between local and server data
  const conflicts = quotes.filter(localQuote =>
    !serverQuotes.some(serverQuote => serverQuote.text === localQuote.text)
  );

  if (conflicts.length > 0) {
    alert(`${conflicts.length} conflict(s) found. Resolving by using server data.`);
  }

  // Resolve conflicts: server data takes precedence
  quotes = [...serverQuotes, ...quotes];

  // Save the merged quotes array to localStorage
  saveQuotes();

  // Update the display and dropdown with merged data
  populateCategories();
  filterQuotes();
}

// Periodically check for updates from the server (e.g., every 30 seconds)
setInterval(syncQuotes, 30000);

// Event listeners for the Export button and Show New Quote button
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial sync when the page loads
window.onload = function () {
  syncQuotes();  // Fetch quotes from server and sync with localStorage
  populateCategories();  // Populate the category dropdown on page load
  loadSelectedCategory();  // Load and apply the last selected category filter

  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${lastQuote.text}"<br><small>— Category: ${lastQuote.category}</small>`;
  }
};
