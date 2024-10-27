// Get references to the form and table body
const patientForm = document.getElementById('patientForm');
const patientTableBody = document.getElementById('patientTableBody');

// Load patients from local storage on page load
document.addEventListener('DOMContentLoaded', loadPatients);

// Handle form submit event
patientForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get input values
  const patient = {
    name: document.getElementById('patientName').value,
    case: document.getElementById('case').value,
    generalTx: document.getElementById('generalTx').value,
    status: document.getElementById('status').value,
    prepDate: document.getElementById('prepDate').value,
    ftpDate: document.getElementById('ftpDate').value,
    insertDate: document.getElementById('insertDate').value,
    offboarding: document.getElementById('offboarding').value,
    notes: document.getElementById('notes').value
  };

  // Add patient to local storage
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients.push(patient);
  localStorage.setItem('patients', JSON.stringify(patients));

  // Update the table
  addPatientToTable(patient);
  patientForm.reset(); // Clear form after submission
});

// Function to load patients from local storage
function loadPatients() {
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients.forEach(addPatientToTable);
}

// Function to add a patient to the table
function addPatientToTable(patient) {
  const row = document.createElement('tr');
  
  row.innerHTML = `
    <td>${patient.name}</td>
    <td>${patient.case}</td>
    <td>${patient.generalTx}</td>
    <td>${patient.status}</td>
    <td>${patient.prepDate}</td>
    <td>${patient.ftpDate}</td>
    <td>${patient.insertDate}</td>
    <td>${patient.offboarding}</td>
    <td>${patient.notes}</td>
    <td class="actions">
      <button onclick="deletePatient(this)">Delete</button>
    </td>
  `;
  patientTableBody.appendChild(row);
}

// Function to delete a patient
function deletePatient(button) {
  const row = button.parentElement.parentElement;
  const name = row.children[0].textContent;

  // Remove patient from local storage
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients = patients.filter(patient => patient.name !== name);
  localStorage.setItem('patients', JSON.stringify(patients));

  // Remove row from the table
  row.remove();
}
