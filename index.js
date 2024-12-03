const form = document.getElementById("packageForm");
const packageTable = document.getElementById("packageTable").getElementsByTagName("tbody")[0];
const errorMessages = document.getElementById("errorMessages");
const existingPackageIDs = new Set(); 
let packages = []; 


form.addEventListener("submit", function(event) {
    event.preventDefault();
    const recipientName = document.getElementById("recipientName").value.trim();
    const packageID = document.getElementById("packageID").value.trim();
    const deliveryAddress = document.getElementById("deliveryAddress").value.trim();
    const weight = document.getElementById("weight").value.trim();

    
    errorMessages.innerHTML = "";

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

   
    const trackingCode = generateTrackingCode(packageID, weight);

   
    const packageData = { recipientName, packageID, deliveryAddress, weight, trackingCode };
    packages.push(packageData);
    existingPackageIDs.add(packageID); 

  
    form.reset();
    errorMessages.innerHTML = "";

   
    renderPackageTable();
});


function generateTrackingCode(packageId, weight) {
    return (packageId << 4 | weight).toString(2);
}


function renderPackageTable() {

    packages = mergeSort(packages);

    
    packageTable.innerHTML = "";

   
    packages.forEach(pkg => {
        const row = packageTable.insertRow();
        row.insertCell(0).textContent = pkg.recipientName;
        row.insertCell(1).textContent = pkg.packageID;
        row.insertCell(2).textContent = pkg.deliveryAddress;
        row.insertCell(3).textContent = pkg.weight;
        row.insertCell(4).textContent = pkg.trackingCode;
    });
}


function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const middle = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, middle));
    const right = mergeSort(arr.slice(middle));

    return merge(left, right);
}


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

function sortTable(columnIndex) {
    const rows = Array.from(packageTable.rows);
    const sortedRows = rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent.trim();
        const cellB = b.cells[columnIndex].textContent.trim();

        if (columnIndex === 3) {
            return parseFloat(cellA) - parseFloat(cellB);
        } else {
            return cellA.localeCompare(cellB); 
        }
    });


    packageTable.innerHTML = "";
    sortedRows.forEach(row => packageTable.appendChild(row));
}