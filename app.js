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
      <button type="button" class="calendar-btn" onclick="openCalendar('prepDate', ${index})">📅</button>
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
      <button type="button" class="calendar-btn" onclick="openCalendar('ftpDate', ${index})">📅</button>
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
      <button type="button" class="calendar-btn" onclick="openCalendar('insertDate', ${index})">📅</button>
    </td>
    <td>
      <select class="lab-status-dropdown" data-column="labStatusInsert">
        <option value="awaiting lab" ${patient.labStatusInsert === "awaiting lab" ? "selected" : ""}>Awaiting Lab</option>
        <option value="lab followed up" ${patient.labStatusInsert === "lab followed up" ? "selected" : ""}>Lab Followed Up</option>
        <option value="lab back" ${patient.labStatusInsert === "lab back" ? "selected" : ""}>Lab Back</option>
        <option value="not needed" ${patient.labStatusIn
