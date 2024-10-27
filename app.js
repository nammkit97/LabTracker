const addPatientBtn = document.getElementById('addPatient');
const patientTableBody = document.getElementById('patientTableBody');
const notesPopup = document.getElementById('notesPopup');
const editNotesText = document.getElementById('editNotesText');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const discardNotesBtn = document.getElementById('discardNotesBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPopup = document.getElementById('settingsPopup');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');

let currentEditIndex = null;

document.addEventListener('DOMContentLoaded', loadPatients);
addPatientBtn.addEventListener('click', addPatient);
closeSettingsBtn.addEventListener('click', () => settingsPopup.style.display = 'none');

function loadPatients() {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    patientTableBody.innerHTML = '';

    patients.forEach((patient, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.name || 'Not Set'}</td>
            <td>
                <span class="date-display" data-column="prepDate">${patient.prepDate || 'Not Set'}</span>
                <input type="date" class="calendar-input" style="display:none;" onchange="updateDate(this, ${index}, 'prepDate')">
                <button type="button" class="calendar-btn" onclick="toggleDateInput(this)">📅</button>
            </td>
            <td>
                <select class="lab-status-dropdown" data-column="labStatusPrep" onchange="updateLabStatus(this, ${index})">
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
                <span class="date-display" data-column="insertDate">${patient.insertDate || 'Not Set'}</span>
                <input type="date" class="calendar-input" style="display:none;" onchange="updateDate(this, ${index}, 'insertDate')">
                <button type="button" class="calendar-btn" onclick="toggleDateInput(this)">📅</button>
            </td>
            <td>
                <select class="lab-status-dropdown" data-column="labStatusInsert" onchange="updateLabStatus(this, ${index})">
                    <option value="awaiting lab" ${patient.labStatusInsert === "awaiting lab" ? "selected" : ""}>Awaiting Lab</option>
                    <option value="lab followed up" ${patient.labStatusInsert === "lab followed up" ? "selected" : ""}>Lab Followed Up</option>
                    <option value="lab back" ${patient.labStatusInsert === "lab back" ? "selected" : ""}>Lab Back</option>
                    <option value="not needed" ${patient.labStatusInsert === "not needed" ? "selected" : ""}>Not Needed</option>
                </select>
            </td>
            <td>
                <span class="date-display" data-column="offboardingDate">${patient.offboardingDate || 'Not Set'}</span>
                <input type="date" class="calendar-input" style="display:none;" onchange="updateDate(this, ${index}, 'offboardingDate')">
                <button type="button" class="calendar-btn" onclick="toggleDateInput(this)">📅</button>
            </td>
            <td>
                <span class="notes-display" onclick="openNotesPopup(${index})">${patient.notes.length > 10 ? patient.notes.slice(0, 10) + '...' : patient.notes || 'Not Set'}</span>
            </td>
            <td>
                <button onclick="deletePatient(${index})">Delete</button>
            </td>
        `;
        
        // Apply color based on lab status
        applyLabStatusColors(row, patient);

        patientTableBody.appendChild(row);
    });
}

function addPatient() {
    const name = document.getElementById('patientName').value;
    const notes = document.getElementById('notes').value;
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const newPatient = {
        name,
        prepDate: '',
        labStatusPrep: 'awaiting lab',
        ftpDate: '',
        insertDate: '',
        labStatusInsert: 'awaiting lab',
        offboardingDate: '',
        labStatusOffboarding: 'awaiting lab',
        notes
    };
    patients.push(newPatient);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadPatients();
    document.getElementById('patientName').value = '';
    document.getElementById('notes').value = '';
}

function toggleDateInput(button) {
    const input = button.previousElementSibling;
    input.style.display = input.style.display === 'none' ? 'block' : 'none';
}

function updateDate(input, index, column) {
    const patients = JSON.parse(localStorage.getItem('patients'));
    patients[index][column] = input.value;
    localStorage.setItem('patients', JSON.stringify(patients));
    loadPatients(); // Reload patients to reflect changes
}

function updateLabStatus(select, index) {
    const patients = JSON.parse(localStorage.getItem('patients'));
    const column = select.getAttribute('data-column');
    patients[index][column] = select.value;
    localStorage.setItem('patients', JSON.stringify(patients));
    loadPatients(); // Reload patients to reflect changes

    // Apply color based on new lab status
    applyLabStatusColors(select.closest('tr'), patients[index]);
}

function applyLabStatusColors(row, patient) {
    const today = new Date();

    // Prep Lab Status
    if (patient.labStatusPrep === "awaiting lab" && daysBetween(today, new Date(patient.prepDate)) < parseInt(document.getElementById('prepLabFollowUpWarning').value)) {
        row.cells[2].classList.add('red');
    } else if (patient.labStatusPrep === "awaiting lab" && daysBetween(today, new Date(patient.prepDate)) < parseInt(document.getElementById('prepLabFollowUpWarning').value)+1) {
        row.cells[2].classList.add('yellow');    
    } else if (patient.labStatusPrep === "lab followed up" && daysBetween(today, new Date(patient.prepDate)) < parseInt(document.getElementById('prepLabBackWarning').value)) {
        row.cells[2].classList.add('red');
    } else if (patient.labStatusPrep === "lab followed up" && daysBetween(today, new Date(patient.prepDate)) < parseInt(document.getElementById('prepLabBackWarning').value)+1) {
        row.cells[2].classList.add('yellow');
    } else if (patient.labStatusPrep === "lab back") {
        row.cells[2].classList.add('green');
    } else {
        row.cells[2].classList.remove('red', 'yellow', 'green');
    }

    // Insert Lab Status
    if (patient.labStatusInsert === "awaiting lab" && daysBetween(today, new Date(patient.insertDate)) < parseInt(document.getElementById('insertLabFollowUpWarning').value)) {
        row.cells[6].classList.add('red');
    } else if (patient.labStatusInsert === "awaiting lab" && daysBetween(today, new Date(patient.insertDate)) < parseInt(document.getElementById('insertLabFollowUpWarning').value)+1) {
        row.cells[6].classList.add('red');
    } else if (patient.labStatusInsert === "awaiting lab" && daysBetween(today, new Date(patient.insertDate)) < parseInt(document.getElementById('insertLabBackUpWarning').value)) {
        row.cells[6].classList.add('red');
    } else if (patient.labStatusInsert === "awaiting lab" && daysBetween(today, new Date(patient.insertDate)) < parseInt(document.getElementById('insertLabBackUpWarning').value)+1) {
        row.cells[6].classList.add('yellow');
    } else if (patient.labStatusInsert === "lab back") {
        row.cells[6].classList.add('green');
    } else {
        row.cells[6].classList.remove('red', 'green');
    }

    // Offboarding Lab Status
    if (patient.labStatusOffboarding === "awaiting lab" && daysBetween(today, new Date(patient.offboardingDate)) < parseInt(document.getElementById('offboardingLabFollowUpWarning').value)) {
        row.cells[8].classList.add('red');
    }else if (patient.labStatusOffboarding === "awaiting lab" && daysBetween(today, new Date(patient.offboardingDate)) < parseInt(document.getElementById('offboardingLabFollowUpWarning').value)+1) {
        row.cells[8].classList.add('yellow');
    }else if (patient.labStatusOffboarding === "awaiting lab" && daysBetween(today, new Date(patient.offboardingDate)) < parseInt(document.getElementById('offboardingLabBackWarning').value)) {
        row.cells[8].classList.add('red');
    }else if (patient.labStatusOffboarding === "awaiting lab" && daysBetween(today, new Date(patient.offboardingDate)) < parseInt(document.getElementById('offboardingLabBackWarning').value)+1) {
        row.cells[8].classList.add('yellow');
    } else if (patient.labStatusOffboarding === "lab back") {
        row.cells[8].classList.add('green');
    } else {
        row.cells[8].classList.remove('red', 'green');
    }
}

function daysBetween(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

function openNotesPopup(index) {
    const patients = JSON.parse(localStorage.getItem('patients'));
    currentEditIndex = index; // Store index for editing
    editNotesText.value = patients[index].notes; // Load current notes into the textarea
    notesPopup.style.display = 'flex'; // Show the popup
}

// Save edited notes
saveNotesBtn.addEventListener('click', function () {
    const patients = JSON.parse(localStorage.getItem('patients'));
    patients[currentEditIndex].notes = editNotesText.value; // Update notes
    localStorage.setItem('patients', JSON.stringify(patients)); // Save changes
    loadPatients(); // Reload patients to reflect changes
    notesPopup.style.display = 'none'; // Close the popup
});

// Discard edited notes
discardNotesBtn.addEventListener('click', function () {
    notesPopup.style.display = 'none'; // Close the popup
});

// Delete patient with confirmation
function deletePatient(index) {
    if (confirm('Are you sure you want to delete this patient?')) {
        const patients = JSON.parse(localStorage.getItem('patients'));
        patients.splice(index, 1);
        localStorage.setItem('patients', JSON.stringify(patients));
        loadPatients(); // Reload patients after deletion
    }
}
