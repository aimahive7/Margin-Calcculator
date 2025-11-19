// Disable Share on load
document.getElementById('share').disabled = true;

document.getElementById('gst').addEventListener('change', function () {
  document.getElementById('gst-other').style.display = this.value === 'other' ? 'inline-block' : 'none';
});

document.getElementById('calculate').onclick = function () {
  const itemName = document.getElementById('item-name').value.trim();
  const ptr = parseFloat(document.getElementById('ptr').value) || 0;
  let gst = document.getElementById('gst').value;
  if (gst === 'other') {
    gst = parseFloat(document.getElementById('gst-other').value) || 0;
  } else {
    gst = parseFloat(gst);
  }
  const purDiscVal = parseFloat(document.getElementById('pur-discount-val').value) || 0;
  const purDiscType = document.getElementById('pur-discount-type').value;
  const saleDiscVal = parseFloat(document.getElementById('sale-discount-val').value) || 0;
  const saleDiscType = document.getElementById('sale-discount-type').value;
  const saleRate = parseFloat(document.getElementById('sale-rate').value) || 0;

  // Net Purchase Amount (PTR + GST)
  let netAmount = ptr + (ptr * gst / 100);

  // Apply Purchase Discount
  if (purDiscType === 'percentage') {
    netAmount -= netAmount * purDiscVal / 100;
  } else {
    netAmount -= purDiscVal;
  }
  const finalPurchaseRate = netAmount;

  // Apply Sale Discount
  let effectiveSaleRate = saleRate;
  if (saleDiscType === 'percentage') {
    effectiveSaleRate -= saleRate * saleDiscVal / 100;
  } else {
    effectiveSaleRate -= saleDiscVal;
  }

  // Profit/Loss
  const profit = effectiveSaleRate - finalPurchaseRate;
  const profitPercent = finalPurchaseRate === 0 ? 0 : (profit / finalPurchaseRate * 100);

  // Margin and Markup calculations
  const marginPercent = effectiveSaleRate === 0 ? 0 : ((effectiveSaleRate - finalPurchaseRate) / effectiveSaleRate * 100);
  const markupPercent = finalPurchaseRate === 0 ? 0 : ((effectiveSaleRate - finalPurchaseRate) / finalPurchaseRate * 100);

  // Status color
  let statusClass = '', statusText = '';
  if (profit > 0) {
    statusClass = 'profit';
    statusText = 'Profit';
  } else if (profit < 0) {
    statusClass = 'loss';
    statusText = 'Loss';
  } else {
    statusClass = '';
    statusText = 'No Profit/Loss';
  }

  // Output results
  document.getElementById('results').innerHTML = `
    <div class="result-box"><strong>Item Name:</strong> ${itemName || '-'} </div>
    <div class="result-box"><strong>Net Purchase Amount (PTR + GST - Discounts):</strong> ₹ ${finalPurchaseRate.toFixed(2)}</div>
    <div class="result-box"><strong>Sale Rate (after sale discount):</strong> ₹ ${effectiveSaleRate.toFixed(2)}</div>
    <div class="result-box"><strong>Markup % (on Cost):</strong> ${markupPercent.toFixed(2)}%</div>    
    <div class="result-box"><strong>Profit/Loss Percentage:</strong> ${profitPercent.toFixed(2)}%</div>
    <div class="result-box"><strong>Margin % (on Sale Rate):</strong> ${marginPercent.toFixed(2)}%</div>
    <div class="result-box"><strong><span class="${statusClass}">Profit/Loss:</span></strong> ${statusText}</div>
    <div class="result-box"><strong>Profit/Loss Amount:</strong> ₹ ${profit.toFixed(2)}</div>
  `;
    // Enable share button after calculation
    document.getElementById('share').disabled = false;
};

document.getElementById('reset').onclick = function () {
  document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');
  document.getElementById('gst').value = '0';
  document.getElementById('pur-discount-type').value = 'amount';
  document.getElementById('sale-discount-type').value = 'amount';
  document.getElementById('gst-other').style.display = 'none';
  document.getElementById('results').innerHTML = '';

    // Disable share after reset
  document.getElementById('share').disabled = true;

};

document.getElementById('share').onclick = function () {
  const results = document.getElementById('results').textContent.trim();
  if (navigator.share && results) {
    navigator.share({
      title: "Item Calculator Result",
      text: results
    });
  } else if (results) {
    navigator.clipboard.writeText(results);
    alert('Result copied to clipboard!');
  }
};

// ==========================================
// TO-DO LIST FUNCTIONALITY
// ==========================================

// Store all calculations
let todoList = [];

// Load saved calculations from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
      const saved = localStorage.getItem('marginCalculations');
          if (saved) {
                    todoList = JSON.parse(saved);
                            renderTodoList();
                                }
                                });

                                // Add calculation to list
                                function addCalculationToList() {
                                      const results = document.getElementById('results').innerHTML;
                                          
                                          // Check if there are results to add
                                              if (!results || results.trim() === '') {
                                                        alert('Please calculate first before adding to list!');
                                                                return;
                                                                    }

                                                                        // Get item name
                                                                            const itemName = document.getElementById('item-name').value || 'Item';

                                                                                // Create calculation entry
                                                                                    const calcEntry = {
                                                                                              id: Date.now(),
                                                                                                      itemName: itemName,
                                                                                                              results: results,
                                                                                                                      createdAt: new Date().toLocaleString()
                                                                                                                          };

                                                                                                                              // Add to list
                                                                                                                                  todoList.push(calcEntry);
                                                                                                                                      
                                                                                                                                      // Save to localStorage
                                                                                                                                          localStorage.setItem('marginCalculations', JSON.stringify(todoList));
                                                                                                                                              
                                                                                                                                              // Render the list
                                                                                                                                                  renderTodoList();
                                                                                                                                                      
                                                                                                                                                      alert('Calculation added to history!');
                                                                                                                                                      }

                                                                                                                                                      // Render the todo list
                                                                                                                                                      function renderTodoList() {
                                                                                                                                                            const listElement = document.getElementById('todo-list');
                                                                                                                                                                listElement.innerHTML = '';
                                                                                                                                                                    
                                                                                                                                                                    if (todoList.length === 0) {
                                                                                                                                                                              listElement.innerHTML = '<li class="empty-message">No calculations yet. Calculate and add to history!</li>';
                                                                                                                                                                                      return;
                                                                                                                                                                                          }
                                                                                                                                                                                              
                                                                                                                                                                                              todoList.forEach((item, index) => {
                                                                                                                                                                                                        const li = document.createElement('li');
                                                                                                                                                                                                                li.className = 'todo-item';
                                                                                                                                                                                                                        li.innerHTML = `
                                                                                                                                                                                                                                    <div class="todo-header">
                                                                                                                                                                                                                                                    <strong>${item.itemName}</strong>
                                                                                                                                                                                                                                                                    <span class="todo-date">${item.createdAt}</span>
                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                            <div class="todo-results">${item.results}</div>
                                                                                                                                                                                                                                                                                                        <div class="todo-actions-item">
                                                                                                                                                                                                                                                                                                                        <button onclick="deleteCalculation(${index})" class="btn-delete">🗑️ Delete</button>
                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                            `;
                                                                                                                                                                                                                                                                                                                                                    listElement.appendChild(li);
                                                                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        // Delete a calculation
                                                                                                                                                                                                                                                                                                                                                        function deleteCalculation(index) {
                                                                                                                                                                                                                                                                                                                                                              if (confirm('Are you sure you want to delete this calculation?')) {
                                                                                                                                                                                                                                                                                                                                                                        todoList.splice(index, 1);
                                                                                                                                                                                                                                                                                                                                                                                localStorage.setItem('marginCalculations', JSON.stringify(todoList));
                                                                                                                                                                                                                                                                                                                                                                                        renderTodoList();
                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                            // Clear all calculations
                                                                                                                                                                                                                                                                                                                                                                                            function clearAllCalculations() {
                                                                                                                                                                                                                                                                                                                                                                                                  if (confirm('Are you sure you want to clear all calculations? This cannot be undone!')) {
                                                                                                                                                                                                                                                                                                                                                                                                            todoList = [];
                                                                                                                                                                                                                                                                                                                                                                                                                    localStorage.removeItem('marginCalculations');
                                                                                                                                                                                                                                                                                                                                                                                                                            renderTodoList();
                                                                                                                                                                                                                                                                                                                                                                                                                                    alert('All calculations cleared!');
                                                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                        // Print all calculations
                                                                                                                                                                                                                                                                                                                                                                                                                                        function printAllCalculations() {
                                                                                                                                                                                                                                                                                                                                                                                                                                              if (todoList.length === 0) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                        alert('No calculations to print!');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                return;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        let printContent = '<html><head><title>Margin Calculator - All Calculations</title>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            printContent += '<style>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                printContent += 'body { font-family: Arial, sans-serif; padding: 20px; }';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    printContent += 'h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        printContent += '.calc-item { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; page-break-inside: avoid; }';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            printContent += '.item-header { font-weight: bold; font-size: 18px; color: #4CAF50; margin-bottom: 5px; }';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                printContent += '.item-date { color: #666; font-size: 12px; margin-bottom: 10px; }';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    printContent += 'p { margin: 5px 0; }';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        printContent += '</style></head><body>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            printContent += '<h1>Item Margin Calculator - All Calculations</h1>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                printContent += '<p>Generated on: ' + new Date().toLocaleString() + '</p>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    printContent += '<p>Total Calculations: ' + todoList.length + '</p><hr>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        todoList.forEach((item, index) => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  printContent += '<div class="calc-item">';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          printContent += '<div class="item-header">' + (index + 1) + '. ' + item.itemName + '</div>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  printContent += '<div class="item-date">Calculated on: ' + item.createdAt + '</div>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          printContent += item.results;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  printContent += '</div>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          printContent += '</body></html>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              // Open print window
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  const printWindow = window.open('', '', 'width=800,height=600');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      printWindow.document.write(printContent);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          printWindow.document.close();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              printWindow.focus();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  setTimeout(() => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            printWindow.print();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }, 250);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                // Share all calculations
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                // Share all calculations
function shareAllCalculations() {
    if (todoList.length === 0) {
        alert('No calculations to share!');
        return;
    }
    
    let shareText = '📊 MARGIN CALCULATOR RESULTS 📊\n';
    shareText += '========================================\n\n';
    shareText += 'Total Calculations: ' + todoList.length + '\n\n';
    
    todoList.forEach((item, index) => {
        shareText += '----------------------------------------\n';
        shareText += (index + 1) + '. ' + item.itemName + '\n';
        shareText += 'Date: ' + item.createdAt + '\n';
        
        // Extract text from HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.results;
        shareText += tempDiv.textContent || tempDiv.innerText || '';
        shareText += '\n\n';
    });
    
    shareText += '========================================\n';
    
    // Try to use Web Share API first (mobile devices)
    if (navigator.share) {
        navigator.share({
            title: 'Margin Calculator - All Results',
            text: shareText
        }).then(() => {
            console.log('Shared successfully');
        }).catch((error) => {
            console.log('Error sharing:', error);
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('✅ All calculations copied to clipboard!\nYou can now paste and share anywhere.');
        }).catch(() => {
            alert('Unable to copy. Please select and copy manually.');
        });
    }
}