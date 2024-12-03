const form = document.getElementById("packageForm");
const packageTable = document.getElementById("packageTable").getElementsByTagName("tbody")[0];
const errorMessages = document.getElementById("errorMessages");
const existingPackageIDs = new Set(); // To store existing package IDs
let packages = []; // To hold all packages before sorting

// Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const recipientName = document.getElementById("recipientName").value.trim();
    const packageID = document.getElementById("packageID").value.trim();
    const deliveryAddress = document.getElementById("deliveryAddress").value.trim();
    const weight = document.getElementById("weight").value.trim();

    // Clear previous errors
    errorMessages.innerHTML = "";

    // Validate fields
    if (!/^[A-Za-z\s]+$/.test(recipientName)) {
        errorMessages.innerHTML += "Error: Recipient Name should contain only alphabetic characters.<br>";
    }
    if (!/^\d+$/.test(packageID)) {
        errorMessages.innerHTML += "Error: Package ID should be a numeric value.<br>";
    } else if (existingPackageIDs.has(packageID)) {
        errorMessages.innerHTML += "Error: Package ID already exists. Please enter a unique ID.<br>";
    }
    if (isNaN(weight) || weight <= 0) {
        errorMessages.innerHTML += "Error: Weight should be a positive numeric value.<br>";
    }

    if (errorMessages.innerHTML) {
        return; // Stop form submission if there are errors
    }

    // Generate a unique tracking code
    const trackingCode = generateTrackingCode(packageID, weight);

    // Add valid package data to the list
    const packageData = { recipientName, packageID, deliveryAddress, weight, trackingCode };
    packages.push(packageData);
    existingPackageIDs.add(packageID); // Add to the set of existing IDs

    // Clear form after submission
    form.reset();
    errorMessages.innerHTML = "";

    // Re-render table with sorted packages
    renderPackageTable();
});

// Function to generate tracking code using bitwise operations
function generateTrackingCode(packageId, weight) {
    return (packageId << 4 | weight).toString(2);
}

// Function to render the table with sorted packages
function renderPackageTable() {
    // Sort the packages by weight using an efficient sorting algorithm (Merge Sort)
    packages = mergeSort(packages);

    // Clear the table
    packageTable.innerHTML = "";

    // Populate the table with sorted packages
    packages.forEach(pkg => {
        const row = packageTable.insertRow();
        row.insertCell(0).textContent = pkg.recipientName;
        row.insertCell(1).textContent = pkg.packageID;
        row.insertCell(2).textContent = pkg.deliveryAddress;
        row.insertCell(3).textContent = pkg.weight;
        row.insertCell(4).textContent = pkg.trackingCode;
    });
}

// Merge Sort algorithm to sort packages by weight
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const middle = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, middle));
    const right = mergeSort(arr.slice(middle));

    return merge(left, right);
}

// Merge function for Merge Sort
function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i].weight < right[j].weight) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i), right.slice(j));
}

// Function to sort table columns (for other columns if needed)
function sortTable(columnIndex) {
    const rows = Array.from(packageTable.rows);
    const sortedRows = rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent.trim();
        const cellB = b.cells[columnIndex].textContent.trim();

        if (columnIndex === 3) {
            return parseFloat(cellA) - parseFloat(cellB); // Sort numerically for Weight
        } else {
            return cellA.localeCompare(cellB); // Sort alphabetically for other columns
        }
    });

    // Rebuild the table with sorted rows
    packageTable.innerHTML = "";
    sortedRows.forEach(row => packageTable.appendChild(row));
}