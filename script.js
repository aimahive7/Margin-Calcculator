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
