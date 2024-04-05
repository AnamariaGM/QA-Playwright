document.addEventListener('DOMContentLoaded', function () {
    // Select the form and input elements
    const form = document.querySelector('form');
    const fileInput = document.getElementById('csv-file');
  
    // Add event listener for form submission
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent default form submission
  
      // Get the selected file
      const file = fileInput.files[0];
  
      // Parse the CSV file using Papa Parse library
      Papa.parse(file, {
        header: true,
        complete: function (results) {
          // Log the parsed data to the console (for demonstration)
          console.log(results.data);
  
          // Display the parsed data in a table
          displayDataInTable(results.data);
        }
      });
    });
  
    // Function to display parsed data in a table
    function displayDataInTable(data) {
      const table = document.createElement('table');
      const thead = table.createTHead();
      const tbody = table.createTBody();
  
      // Create table header row
      const headerRow = thead.insertRow();
      Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
      });
  
      // Create table body rows
      data.forEach(row => {
        const tr = tbody.insertRow();
        Object.values(row).forEach(value => {
          const td = tr.insertCell();
          td.textContent = value;
        });
      });
  
      // Append table to the document body
      document.body.appendChild(table);
    }
  });
  