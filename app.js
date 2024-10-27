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
    labStatus: 'not needed', // Default value
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
  patients.forEach(addPatientToTable);
}

// Function to add a patient to the table
function addPatientToTable(patient, index = null) {
  const row = document.createElement('tr');
  
  row.innerHTML = `
    <td>${patient.name}</td>
    <td>${patient.case}</td>
    <td>${patient.generalTx}</td>
    <td>${patient.status}</td>
    <td contenteditable="true" class="editable" data-column="prepDate">${patient.prepDate}</td>
    <td contenteditable="true" class="editable" data-column="ftpDate">${patient.ftpDate}</td>
    <td contenteditable="true" class="editable" data-column="insertDate">${patient.insertDate}</td>
    <td contenteditable="true" class="editable" data-column="offboarding">${patient.offboarding}</td>
    <td>
      <select class="lab-status-dropdown" data-column="labStatus">
        <option value="not needed" ${patient.labStatus === "not needed" ? "selected" : ""}>Not Needed</option>
        <option value="lab followed up" ${patient.labStatus === "lab followed up" ? "selected" : ""}>Lab Followed Up</option>
        <option value="lab back" ${patient.labStatus === "lab back" ? "selected" : ""}>Lab Back</option>
      </select>
    </td>
    <td>${patient.notes}</td>
    <td class="actions">
      <button onclick="editPatient(${index})">Edit</button>
      <button onclick="deletePatient(${index}, this)">Delete</button>
    </td>
  `;
  patientTableBody.appendChild(row);
}

// Function to delete a patient
function deletePatient(index, button) {
  const row = button.parentElement.parentElement;

  // Remove patient from local storage
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients.splice(index, 1);
  localStorage.setItem('patients', JSON.stringify(patients));

  // Remove row from the table
  row.remove();
}

// Function to edit a patient
function editPatient(index) {
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  const patient = patients[index];

  // Select the row that contains the patient's data
  const row = patientTableBody.rows[index];
  
  // Get the updated values from the editable fields
  const prepDate = row.querySelector('[data-column="prepDate"]').textContent.trim();
  const ftpDate = row.querySelector('[data-column="ftpDate"]').textContent.trim();
  const insertDate = row.querySelector('[data-column="insertDate"]').textContent.trim();
  const offboarding = row.querySelector('[data-column="offboarding"]').textContent.trim();
  const labStatus = row.querySelector('.lab-status-dropdown').value;

  // Update the patient object
  patient.prepDate = prepDate;
  patient.ftpDate = ftpDate;
  patient.insertDate = insertDate;
  patient.offboarding = offboarding;
  patient.labStatus = labStatus;

  // Save updated patient data back to local storage
  patients[index] = patient;
  localStorage.setItem('patients', JSON.stringify(patients));

  alert('Patient details updated successfully!');
}
