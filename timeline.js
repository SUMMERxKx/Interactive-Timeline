/* =========================================================
   script.js
   Purpose : All interactive logic for the timeline planner
   Author  : YOUR-NAME-HERE
   Date    : 2025-06-25
========================================================== */

/*-------------  Helper constants -------------*/
const timelineEl   = document.getElementById('timeline');
const yearModalEl  = document.getElementById('yearModal');
const yearForm     = document.getElementById('yearForm');
const resetBtn     = document.getElementById('resetBtn');

/*-------------  Event listeners -------------*/
// ➊ First-time (or manual) creation of a timeline
yearForm.addEventListener('submit', e => {
  e.preventDefault();
  const years = parseInt(document.getElementById('yearsInput').value, 10);
  if (Number.isFinite(years) && years >= 1 && years <= 10) {
    buildTimeline(years);
    yearModalEl.style.display = 'none';
  }
});

// ➋ Reset timeline & clear storage
resetBtn.addEventListener('click', () => {
  if (confirm('Clear the timeline and delete all saved notes?')) {
    localStorage.clear();
    location.reload();
  }
});

/*-------------  Initial load -------------*/
window.addEventListener('DOMContentLoaded', () => {
  // If keys exist in localStorage, recreate timeline from the highest year number found
  const storedKeys = Object.keys(localStorage).filter(k => /^timeline-Y\d+-/.test(k));
  if (storedKeys.length) {
    const maxYear = storedKeys
      .map(k => parseInt(k.match(/^timeline-Y(\d+)-/)[1], 10))
      .reduce((a, b) => Math.max(a, b), 0);
    buildTimeline(maxYear);
    yearModalEl.style.display = 'none';
  }
});

/*==========================================================
  Function: buildTimeline
  Desc    : Dynamically constructs the DOM nodes for each
            academic year and its three semesters.
==========================================================*/
function buildTimeline(years) {
  timelineEl.innerHTML = ''; // wipe any existing nodes
  for (let y = 1; y <= years; y++) {
    const yearBlock = document.createElement('div');
    yearBlock.className = 'year';
    yearBlock.dataset.year = y;
    yearBlock.innerHTML = `<h2>Year ${y}</h2>`;
    
    // Semester definitions (array keeps order)
    ['Fall', 'Winter', 'Summer'].forEach(sem => {
      yearBlock.appendChild(createSemesterBox(y, sem));
    });
    timelineEl.appendChild(yearBlock);
  }
}

/*==========================================================
  Function: createSemesterBox
  Desc    : Returns a DOM element (div.semester) containing
            label, editable area, and Save/Edit toggles.
==========================================================*/
function createSemesterBox(year, sem) {
  const key   = `timeline-Y${year}-${sem}`;
  const saved = localStorage.getItem(key) || '';

  // Root element
  const box = document.createElement('div');
  box.className = 'semester';
  box.role = 'listitem';
  box.dataset.key = key;

  // Label
  const label = document.createElement('label');
  label.textContent = `${sem} Semester`;
  box.appendChild(label);

  // Static text view (shown when not editing)
  const staticText = document.createElement('div');
  staticText.className = 'static-text';
  staticText.textContent = saved || '— click Edit to add notes —';
  staticText.style.display = saved ? 'block' : 'none';
  box.appendChild(staticText);

  // Editable textarea (hidden until Edit pressed)
  const textarea = document.createElement('textarea');
  textarea.value = saved;
  textarea.style.display = saved ? 'none' : 'block';
  box.appendChild(textarea);

  // Button row
  const btnRow = document.createElement('div');
  btnRow.className = 'btn-row';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';

  // Save logic
  saveBtn.addEventListener('click', () => {
    const val = textarea.value.trim();
    localStorage.setItem(key, val);
    staticText.textContent = val || '— click Edit to add notes —';
    textarea.style.display = 'none';
    staticText.style.display = 'block';
  });

  // Edit logic
  editBtn.addEventListener('click', () => {
    textarea.style.display = 'block';
    staticText.style.display = 'none';
    textarea.focus();
  });

  btnRow.append(saveBtn, editBtn);
  box.appendChild(btnRow);

  return box;
}
