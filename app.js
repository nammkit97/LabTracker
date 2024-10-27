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
    prepDate: '',
    ftpDate: '',
    insertDate: '',
    offboarding: '',
    labStatusPrep: 'awaiting lab',  // Default value
    labStatusFtp: 'awaiting lab',   // Default value
    labStatusInsert: 'awaiting lab', // Default value
    labStatusOffboarding: 'awaiting lab', // Default value
    notes: document.getElementById('notes').value
  };

  // Add patient to local storage
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients.push(patient);
  localStorage.setItem('patients', JSON.stringify(patients));

  // Update the table
  addPatientToTable(patient, patients.length - 1);
  patientForm.reset(); // Clear form after submission
});

// Function to load patients from local storage
function loadPatients() {
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patientTableBody.innerHTML = ''; // Clear table before loading
  patients.forEach(addPatientToTable);
}

// Function to add a patient to the table
function addPatientToTable(patient, index = null) {
  const row = document.createElement('tr');
  
  row.innerHTML = `
    <td>${patient.name}</td>
    <td>${patient.case}</td>
    <td>${patient.generalTx}</td>
    <td>
      <span class="date-display" data-column="prepDate">${patient.prepDate || 'Not Set'}</span>
      <input type="date" class="calendar-input" style="display:none;" onchange="updateDate(this, ${index}, 'prepDate')">
      <button type="button" class="calendar-btn" onclick="toggleDateInput(this)">📅</button>
    </td>
    <td>
      <select class="lab-status-dropdown" data-column="labStatusPrep">
        <option value="awaiting lab" ${patient.labStatusPrep === "awaiting lab" ? "selected" : ""}>Awaiting Lab</option>
        <option value="lab followed up" ${patient.labStatusPrep === "lab followed up" ? "selected" : ""}>Lab Followed Up</option>
        <option value="lab back" ${patient.labStatusPrep === "lab back" ? "selected" : ""}>Lab Back</option>
        <option value="not needed" ${patient.labStatusPrep === "not needed" ? "selected" : ""}>Not Needed</option>
      </select>
    </td>
    <td>
      <span class="date-display" data-column="ftpDate">${patient.ftpDate || 'Not Set'}</span>
      <input type="date" class="calendar-input" style="display:none;" onchange="updateDate(this, ${index}, 'ftpDate')">
      <button type="button" class="calendar-btn" onclick="toggleDateInput(this)">📅</button>
    </td>
    <td>
      <select class="lab-status-dropdown" data-column="labStatusFtp">
        <option value="awaiting lab" ${patient.labStatusFtp === "awaiting lab" ? "selected" : ""}>Awaiting Lab</option>
        <option value="lab followed up" ${patient.labStatusFtp === "lab followed up" ? "selected" : ""}>Lab Followed Up</option>
        <option value="lab back" ${patient.labStatusFtp === "lab back" ? "selected" : ""}>Lab Back</option>
        <option value="not needed" ${patient.labStatusFtp === "not needed" ? "selected" : ""}>Not Needed</option>
      </select>
    </td>
    <td>
      <span class="date-display" data-column="insertDate">${patient.insertDate || 'Not Set'}</span>
      <input type="date" class="calendar-input" style="display:none;" onchange="updateDate(this, ${index}, 'insertDate')">
      <button type="button" class="calendar-btn" onclick="toggleDateInput(this)">📅</button>
    </td>
    <td>
      <select class="lab-status-dropdown" data-column="labStatusInsert">
        <option value="awaiting lab" ${patient.labStatusInsert === "awaiting lab" ? "selected" : ""}>Awaiting Lab</option>
        <option value="lab followed up" ${patient.labStatusInsert === "lab followed up" ? "selected" : ""}>Lab Followed Up</option>
        <option value="lab back" ${patient.labStatusInsert === "lab back" ? "selected" : ""}>Lab Back</option>
        <option value="not needed" ${patient.labStatusInsert === "not needed" ? "selected" : ""}>Not Needed</option>
      </select>
    </td>
    <td>
      <span class="date-display" data-column="offboarding">${patient.offboarding || 'Not Set'}</span>
      <input type="date" class="calendar-input" style="display:none;" onchange="updateDate(this, ${index}, 'offboarding')">
      <button type="button" class="calendar-btn" onclick="toggleDateInput(this)">📅</button>
    </td>
    <td>
      <select class="lab-status-dropdown" data-column="labStatusOffboarding">
        <option value="awaiting lab" ${patient.labStatusOffboarding === "awaiting lab" ? "selected" : ""}>Awaiting Lab</option>
        <option value="lab followed up" ${patient.labStatusOffboarding === "lab followed up" ? "selected" : ""}>Lab Followed Up</option>
        <option value="lab back" ${patient.labStatusOffboarding === "lab back" ? "selected" : ""}>Lab Back</option>
        <option value="not needed" ${patient.labStatusOffboarding === "not needed" ? "selected" : ""}>Not Needed</option>
      </select>
    </td>
    <td>${patient.notes}</td>
    <td class="actions">
      <button onclick="deletePatient(${index}, this)">Delete</button>
    </td>
  `;
  patientTableBody.appendChild(row);
}

// Function to delete a patient
function deletePatient(index, btn) {
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients.splice(index, 1);
  localStorage.setItem('patients', JSON.stringify(patients));
  btn.closest('tr').remove(); // Remove the row from the table
}

// Function to toggle visibility of date input
function toggleDateInput(btn) {
  const dateInput = btn.previousElementSibling;
  dateInput.style.display = dateInput.style.display === 'none' ? 'inline-block' : 'none';
}

// Function to update date
function updateDate(input, index, column) {
  const patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients[index][column] = input.value;
  localStorage.setItem('patients', JSON.stringify(patients));
  loadPatients();
}
