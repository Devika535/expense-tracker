const balanceEl = document.getElementById('balance');
const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const listEl = document.getElementById('transactions');
const ctx = document.getElementById('expenseChart').getContext('2d');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenseChart;

// Save and render
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function render() {
  listEl.innerHTML = '';
  let balance = 0;
  let totals = { income: 0, expense: 0 };

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount < 0 ? 'expense' : 'income');
    li.innerHTML = `
      <span><i class="fa-regular fa-circle-dot"></i> ${t.desc}</span>
      <span>${t.amount < 0 ? '-' : '+'}₹${Math.abs(t.amount)}
        <button data-id="${t.id}"><i class="fa-solid fa-trash"></i></button>
      </span>
    `;
    listEl.appendChild(li);

    balance += t.amount;
    if (t.amount < 0) totals.expense += Math.abs(t.amount);
    else totals.income += t.amount;
  });

  balanceEl.textContent = balance;
  drawChart(totals);
}

function drawChart({income, expense}) {
  if (expenseChart) expenseChart.destroy();
  expenseChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#2ecc71', '#e74c3c']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// Add / Delete
form.addEventListener('submit', e => {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = +amountInput.value.trim();
  if (!desc || !amount) return;

  transactions.push({ id: Date.now(), desc, amount });
  updateLocalStorage();
  render();
  form.reset();
});

listEl.addEventListener('click', e => {
  if (e.target.closest('button')) {
    const id = +e.target.closest('button').dataset.id;
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    render();
  }
});

render();
