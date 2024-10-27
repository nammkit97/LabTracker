// Get references to the form, table body, and popups
const patientForm = document.getElementById('patientForm');
const patientTableBody = document.getElementById('patientTableBody');
const notesPopup = document.getElementById('notesPopup');
const editNotesText = document.getElementById('editNotesText');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const discardNotesBtn = document.getElementById('discardNotesBtn');
const settingsPopup = document.getElementById('settingsPopup');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
let currentEditIndex = null;

// Load patients from local storage on page load
document.addEventListener('DOMContentLoaded', loadPatients);

// Handle form submit event
patientForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get input values
    const patient = {
        name: document.getElementById('patientName').value,
        case: document.getElementById('case').value,
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
        <td>
            <span class="notes-display" onclick="openNotesPopup(${index})">
                ${patient.notes.length > 10 ? patient.notes.substring(0, 10) + '...' : patient.notes}
            </span>
        </td>
        <td class="actions">
            <button type="button" onclick="confirmDelete(${index}, this)">Delete</button>
        </td>
    `;
    
    patientTableBody.appendChild(row);
    
    // Check warnings
    checkWarnings(patient, index);
}

// Function to check warnings based on dates
function checkWarnings(patient, index) {
    const today = new Date();
    
    // Check Prep Lab Follow Up Warning
    if (patient.labStatusPrep === 'lab followed up' && patient.prepDate) {
        const prepDate = new Date(patient.prepDate);
        const daysDiff = Math.floor((today - prepDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 4) {
            alert("Warning: Prep Lab Follow Up is overdue by " + daysDiff + " days.");
        }
    }

    // Check Prep Lab Back Warning
    if (patient.labStatusPrep === 'lab back' && patient.ftpDate) {
        const ftpDate = new Date(patient.ftpDate);
        const daysDiff = Math.floor((today - ftpDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 2) {
            alert("Warning: Prep Lab Back is overdue by " + daysDiff + " days.");
        }
    }

    // Check Insert Lab Follow Up Warning
    if (patient.labStatusInsert === 'lab followed up' && patient.insertDate) {
        const insertDate = new Date(patient.insertDate);
        const daysDiff = Math.floor((today - insertDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 7) {
            alert("Warning: Insert Lab Follow Up is overdue by " + daysDiff + " days.");
        }
    }

    // Check Insert Lab Back Warning
    if (patient.labStatusInsert === 'lab back' && patient.insertDate) {
        const insertDate = new Date(patient.insertDate);
        const daysDiff = Math.floor((today - insertDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 2) {
            alert("Warning: Insert Lab Back is overdue by " + daysDiff + " days.");
        }
    }

    // Check Offboarding Lab Follow Up Warning
    if (patient.labStatusOffboarding === 'lab followed up' && patient.offboarding) {
        const offboardingDate = new Date(patient.offboarding);
        const daysDiff = Math.floor((today - offboardingDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 4) {
            alert("Warning: Offboarding Lab Follow Up is overdue by " + daysDiff + " days.");
        }
    }

    // Check Offboarding Lab Back Warning
    if (patient.labStatusOffboarding === 'lab back' && patient.offboarding) {
        const offboardingDate = new Date(patient.offboarding);
        const daysDiff = Math.floor((today - offboardingDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 2) {
            alert("Warning: Offboarding Lab Back is overdue by " + daysDiff + " days.");
        }
    }
}

// Function to update date
function updateDate(input, index, column) {
    const patients = JSON.parse(localStorage.getItem('patients'));
    patients[index][column] = input.value; // Update the appropriate column
    localStorage.setItem('patients', JSON.stringify(patients)); // Save changes
    loadPatients(); // Reload patients to reflect changes
}

// Toggle the visibility of date input
function toggleDateInput(button) {
    const dateInput = button.previousElementSibling;
    dateInput.style.display = dateInput.style.display === 'none' ? 'inline-block' : 'none';
}

// Function to confirm deletion
function confirmDelete(index, button) {
    if (confirm("Are you sure you want to delete this patient?")) {
        const patients = JSON.parse(localStorage.getItem('patients'));
        patients.splice(index, 1); // Remove patient from array
        localStorage.setItem('patients', JSON.stringify(patients)); // Save changes
        loadPatients(); // Reload patients to reflect changes
    }
}

// Function to open notes popup
function openNotesPopup(index) {
    const patients = JSON.parse(localStorage.getItem('patients'));
    currentEditIndex = index; // Store the index for editing
    editNotesText.value = patients[index].notes; // Set textarea to current notes
    notesPopup.style.display = 'block'; // Show the popup
}

// Function to save edited notes
saveNotesBtn.addEventListener('click', function() {
    const patients = JSON.parse(localStorage.getItem('patients'));
    patients[currentEditIndex].notes = editNotesText.value; // Update notes with new text
    localStorage.setItem('patients', JSON.stringify(patients)); // Save changes
    loadPatients(); // Reload patients to reflect changes
    notesPopup.style.display = 'none'; // Close the popup
});

// Function to discard changes and close the popup
discardNotesBtn.addEventListener('click', function() {
    notesPopup.style.display = 'none'; // Just close the popup
});

// Open settings popup
settingsBtn.addEventListener('click', function() {
    settingsPopup.style.display = 'block'; // Show the settings popup
});

// Close settings popup
closeSettingsBtn.addEventListener('click', function() {
    settingsPopup.style.display = 'none'; // Close the settings popup
});
