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
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
      const quoteDisplay = document.getElementById("quoteDisplay");
      quoteDisplay.innerHTML = `"${lastQuote.text}"<br><small>— Category: ${lastQuote.category}</small>`;
    }
  };
  