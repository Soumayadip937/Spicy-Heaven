document.addEventListener("DOMContentLoaded", () => {
const minusBtns = document.querySelectorAll(".minus-btn");
const plusBtns = document.querySelectorAll(".plus-btn");
const qtyInputs = document.querySelectorAll(".qty-input");

minusBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (qtyInputs[index].value > 0) {
      qtyInputs[index].value = parseInt(qtyInputs[index].value) - 1;
    }
  });
});

plusBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    qtyInputs[index].value = parseInt(qtyInputs[index].value) + 1;
  });
});
  const generateBillBtn = document.getElementById("generate-bill-btn");
const salesReportTable = document.getElementById("sales-report-table");
let totalExpenses = 0;
generateBillBtn.addEventListener("click", generateBill);
function generateBill() {
  // Get customer details
  const name = document.getElementById("name").value;
  const contact = document.getElementById("contact").value;
  // Reset input values
document.getElementById("name").value = "";
document.getElementById("contact").value = "";
  // Get menu items
  const menuItems = document.querySelectorAll("tbody tr");
  let total = 0;
  let items = [];
  menuItems.forEach(item => {
    const name = item.querySelector("td:first-child").textContent;
    const price = parseInt(item.querySelector("td:nth-child(2)").textContent);
    const qty = item.querySelector(".qty-input");
    if (qty) { // check if the element exists
     const qtyInput=parseInt(qty.value);
    const amount = price * qtyInput;
    if (qtyInput > 0) {
      
      items.push({
        name,
        price,
        qty:qtyInput,
        amount
      });
      total += amount;
  }
    }
  });
  if (salesReportTable.rows.length === 0) {
    const newRow = salesReportTable.insertRow(0);
    const nameHeader = newRow.insertCell(0);
    const qtyHeader = newRow.insertCell(1);
    const priceHeader = newRow.insertCell(2);
    const totalHeader = newRow.insertCell(3);
    nameHeader.innerHTML = "Item";
    qtyHeader.innerHTML = "Quantity";
    priceHeader.innerHTML = "Price";
    totalHeader.innerHTML = "Amount";
  }
  // Generate PDF
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [108, 216],
  });
  const tableColumns = ["Item", "Price", "Quantity", "Amount"];
  const tableRows = items.map(item => [item.name, item.price, item.qty, item.amount]);
  tableRows.push(["", "", "Total", total]);
  
  // Add customer details
doc.setFont("Helvetica");
doc.setFontSize(8);
doc.setFontStyle("normal");
doc.text(`Customer Name: ${name}`, 5, 10);
doc.text(`Contact Number: ${contact}`, 5, 15);


// Add restaurant details
doc.setFontSize(10);
doc.setFontStyle("bold");
doc.text("Spicy Heaven", 55, 10);
doc.setFontStyle("normal");
doc.setFontSize(8);
doc.text("Pulimoodu, Stationkadavu,Kulathoor,", 55, 15);
doc.text("Trivandrum, Kerela - 695583", 55, 20);
doc.text("Phone: 8089557370/6282111211", 55, 25);

// Add table of items
doc.autoTable({
  head: [tableColumns],
  body: tableRows,
  startY: 30,
  theme: "grid",
  tableWidth: "auto" , // Set the width of the table to 180mm
  tableHeight: "auto", // Set the height of the table to 100mm
});
// Enable auto print
doc.autoPrint({variant: 'non-conform'});
  doc.save(`${name}_bill.pdf`);
  items.forEach(item => {
    const existingRow = Array.from(salesReportTable.rows).find(row => row.cells[0].textContent === item.name);
  if (existingRow) {
    // update existing row
    const qty = parseInt(existingRow.cells[1].textContent) + item.qty;
    const amount = parseInt(existingRow.cells[3].textContent) + item.amount;
    existingRow.cells[1].textContent = qty;
    existingRow.cells[3].textContent = amount;
  }else{
    const newRow = salesReportTable.insertRow(-1);
    const nameCell = newRow.insertCell(0);
    const qtyCell = newRow.insertCell(1);
    const priceCell = newRow.insertCell(2);
    const totalCell = newRow.insertCell(3);
    nameCell.innerHTML = item.name;
    qtyCell.innerHTML = item.qty;
    priceCell.innerHTML = item.price;
    totalCell.innerHTML = item.amount;
    //totalExpenses += total;
  }
  });
   totalExpenses += total;
  // Reset menu items
  menuItems.forEach(item => {
    item.querySelector(".qty-input").value = 0;
  });
}
// Generate sales report
const generateReportBtn = document.getElementById("generate-report-btn");
generateReportBtn.addEventListener("click", generateReport);
function generateReport() {
  const doc = new jsPDF();
  const tableColumns = ["Item", "Price", "Quantity", "Amount"];
  const tableRows = [];
  const rows = salesReportTable.rows;
  if (rows.length <= 1) { // added check
    alert("No sales data available.");
    return;
  }
  for (let i = 1; i < rows.length; i++) {
    const name = rows[i].cells[0].textContent;
    const price = parseFloat(rows[i].cells[2].textContent);
    const qty = parseInt(rows[i].cells[1].textContent);
    const total = parseFloat(rows[i].cells[3].textContent);
    tableRows.push([name, price, qty, total.toFixed(2)]);
  }
  tableRows.push(["", "", "Total Expenses", totalExpenses.toFixed(2)]);
  doc.autoTable({
    head: [tableColumns],
    body: tableRows
  });
  doc.save("sales-report.pdf");
}

// Reset sales report every day at 12:00 AM
setInterval(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  console.log(`Current time: ${hours}:${minutes}:${seconds}`); // log current time
  if (hours === 0 && minutes === 0 && seconds === 0) {
    console.log('Resetting sales report...'); // log reset action
    resetSalesReport();
  }
}, 10000);

function resetSalesReport() {
  // Remove all rows from the sales report table except the header
  const rows = salesReportTable.rows;
  for (let i = rows.length - 1; i > 0; i--) {
    salesReportTable.deleteRow(i);
  }
  totalExpenses = 0;
}

  });
    