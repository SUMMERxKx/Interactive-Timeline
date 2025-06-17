// State management
let timelineData = new Map();
let currentEditCell = null;
let yearsCount = 0;

// DOM Elements
const setupSection = document.getElementById('setup-section');
const yearsInput = document.getElementById('years-input');
const generateBtn = document.getElementById('generate-btn');
const resetBtn = document.getElementById('reset-btn');
const timelineYears = document.getElementById('timeline-years');
const controls = document.getElementById('controls');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const editModal = document.getElementById('edit-modal');
const planText = document.getElementById('plan-text');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const progressBarInner = document.getElementById('progress-bar-inner');
const ariaLive = document.getElementById('aria-live');

// Event Listeners
generateBtn.addEventListener('click', generateTimeline);
downloadBtn.addEventListener('click', downloadPlan);
printBtn.addEventListener('click', () => window.print());
saveBtn.addEventListener('click', savePlan);
cancelBtn.addEventListener('click', closeModal);
resetBtn.addEventListener('click', resetTimeline);

yearsInput.addEventListener('input', () => {
    resetBtn.hidden = true;
});

// Generate timeline grid grouped by year
function generateTimeline() {
    const years = parseInt(yearsInput.value);
    if (years < 1 || years > 6) {
        alert('Please enter a number between 1 and 6');
        return;
    }
    yearsCount = years;
    timelineYears.innerHTML = '';
    timelineData.clear();
    resetBtn.hidden = false;

    // Animate progress bar
    progressBarInner.style.width = '0%';
    setTimeout(() => {
        progressBarInner.style.width = '100%';
    }, 100);

    // Group semesters by year
    const semesters = ['Fall', 'Winter', 'Summer'];
    for (let year = 1; year <= years; year++) {
        const yearBlock = document.createElement('section');
        yearBlock.className = 'year-block';
        yearBlock.setAttribute('aria-label', `Year ${year}`);
        yearBlock.setAttribute('tabindex', '-1');

        const yearTitle = document.createElement('div');
        yearTitle.className = 'year-title';
        yearTitle.textContent = `Year ${year}`;
        yearBlock.appendChild(yearTitle);

        const semestersRow = document.createElement('div');
        semestersRow.className = 'year-semesters';
        for (const semester of semesters) {
            const cell = createSemesterCell(year, semester);
            semestersRow.appendChild(cell);
        }
        yearBlock.appendChild(semestersRow);
        timelineYears.appendChild(yearBlock);
    }
    timelineYears.hidden = false;
    controls.hidden = false;
    announce(`Timeline generated for ${years} year${years > 1 ? 's' : ''}.`);
}

// Create semester cell
function createSemesterCell(year, semester) {
    const cell = document.createElement('div');
    cell.className = 'semester-cell';
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', `Year ${year} ${semester} semester plan`);

    const heading = document.createElement('h3');
    heading.textContent = `${semester}`;
    cell.appendChild(heading);

    const content = document.createElement('div');
    content.className = 'cell-content';
    cell.appendChild(content);

    // Add click and keyboard event listeners
    cell.addEventListener('click', () => openModal(cell, year, semester));
    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(cell, year, semester);
        }
    });

    // Animate in
    cell.style.opacity = 0;
    setTimeout(() => {
        cell.style.opacity = 1;
    }, 100 * (year - 1) + (semester === 'Fall' ? 0 : semester === 'Winter' ? 1 : 2) * 80);

    return cell;
}

// Modal functions
function openModal(cell, year, semester) {
    currentEditCell = cell;
    const cellId = `Year ${year} - ${semester}`;
    planText.value = timelineData.get(cellId) || '';
    editModal.hidden = false;
    planText.focus();
    announce(`Editing plan for Year ${year} ${semester}.`);
}

function closeModal() {
    editModal.hidden = true;
    currentEditCell = null;
    planText.value = '';
}

function savePlan() {
    if (!currentEditCell) return;
    // Find year and semester from DOM
    const yearBlock = currentEditCell.closest('.year-block');
    const year = yearBlock.querySelector('.year-title').textContent.replace(/[^0-9]/g, '');
    const semester = currentEditCell.querySelector('h3').textContent;
    const cellId = `Year ${year} - ${semester}`;
    const content = currentEditCell.querySelector('.cell-content');
    const sanitizedText = sanitizeInput(planText.value);
    timelineData.set(cellId, sanitizedText);
    content.textContent = sanitizedText;
    closeModal();
    announce(`Plan saved for Year ${year} ${semester}.`);
}

// Download functionality
function downloadPlan() {
    const content = generatePlanText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tru_timeline_plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    announce('Plan downloaded as text file.');
}

function generatePlanText() {
    let text = 'Your Path Through TRU\n';
    text += '====================\n\n';
    for (let year = 1; year <= yearsCount; year++) {
        text += `Year ${year}\n`;
        text += `${'-'.repeat(6 + String(year).length)}\n`;
        ['Fall', 'Winter', 'Summer'].forEach(semester => {
            const cellId = `Year ${year} - ${semester}`;
            const content = timelineData.get(cellId);
            if (content) {
                text += `${semester}:\n${content}\n\n`;
            }
        });
    }
    return text;
}

function resetTimeline() {
    timelineYears.innerHTML = '';
    timelineData.clear();
    controls.hidden = true;
    progressBarInner.style.width = '0%';
    resetBtn.hidden = true;
    announce('Timeline reset.');
}

// Utility functions
function sanitizeInput(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.textContent;
}

function announce(msg) {
    ariaLive.textContent = '';
    setTimeout(() => { ariaLive.textContent = msg; }, 50);
}

// Handle Escape key for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editModal.hidden) {
        closeModal();
    }
}); 