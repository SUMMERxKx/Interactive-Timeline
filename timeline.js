// State management
let timelineData = new Map();
let currentEditCell = null;

// DOM Elements
const setupSection = document.getElementById('setup-section');
const yearsInput = document.getElementById('years-input');
const generateBtn = document.getElementById('generate-btn');
const timelineGrid = document.getElementById('timeline-grid');
const controls = document.getElementById('controls');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const editModal = document.getElementById('edit-modal');
const planText = document.getElementById('plan-text');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Event Listeners
generateBtn.addEventListener('click', generateTimeline);
downloadBtn.addEventListener('click', downloadPlan);
printBtn.addEventListener('click', () => window.print());
saveBtn.addEventListener('click', savePlan);
cancelBtn.addEventListener('click', closeModal);

// Generate timeline grid
function generateTimeline() {
    const years = parseInt(yearsInput.value);
    if (years < 1 || years > 6) {
        alert('Please enter a number between 1 and 6');
        return;
    }

    // Clear existing grid
    timelineGrid.innerHTML = '';
    timelineData.clear();

    // Set grid columns based on years
    timelineGrid.style.gridTemplateColumns = `repeat(${years}, 1fr)`;

    // Generate cells
    const semesters = ['Fall', 'Winter', 'Summer'];
    for (let year = 1; year <= years; year++) {
        for (const semester of semesters) {
            const cell = createSemesterCell(year, semester);
            timelineGrid.appendChild(cell);
        }
    }

    // Show grid and controls
    timelineGrid.hidden = false;
    controls.hidden = false;
}

// Create semester cell
function createSemesterCell(year, semester) {
    const cell = document.createElement('div');
    cell.className = 'semester-cell';
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', `Year ${year} ${semester} semester plan`);

    const heading = document.createElement('h3');
    heading.textContent = `Year ${year} - ${semester}`;
    cell.appendChild(heading);

    const content = document.createElement('div');
    content.className = 'cell-content';
    cell.appendChild(content);

    // Add click and keyboard event listeners
    cell.addEventListener('click', () => openModal(cell));
    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(cell);
        }
    });

    return cell;
}

// Modal functions
function openModal(cell) {
    currentEditCell = cell;
    const cellId = `${cell.querySelector('h3').textContent}`;
    planText.value = timelineData.get(cellId) || '';
    editModal.hidden = false;
    planText.focus();
}

function closeModal() {
    editModal.hidden = true;
    currentEditCell = null;
    planText.value = '';
}

function savePlan() {
    if (!currentEditCell) return;

    const cellId = currentEditCell.querySelector('h3').textContent;
    const content = currentEditCell.querySelector('.cell-content');
    const sanitizedText = sanitizeInput(planText.value);

    timelineData.set(cellId, sanitizedText);
    content.textContent = sanitizedText;
    closeModal();
}

// Download functionality
function downloadPlan() {
    const content = generatePlanText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_timeline_plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generatePlanText() {
    let text = 'Student Timeline Plan\n';
    text += '===================\n\n';

    for (const [cellId, content] of timelineData) {
        if (content) {
            text += `${cellId}\n`;
            text += `${'-'.repeat(cellId.length)}\n`;
            text += `${content}\n\n`;
        }
    }

    return text;
}

// Utility functions
function sanitizeInput(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.textContent;
}

// Handle Escape key for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editModal.hidden) {
        closeModal();
    }
}); 