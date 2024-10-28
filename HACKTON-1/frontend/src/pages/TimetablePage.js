// src/pages/TimetablePage.js
import React, { useState } from 'react';
import Timetable from '../components/Timetable';
import './TimetablePage.css';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periodsPerDay = 7;

function TimetablePage() {
  const [numSections, setNumSections] = useState(1);
  const [subjectsInput, setSubjectsInput] = useState('');
  const [facultyCounts, setFacultyCounts] = useState('');
  const [labSubjectsInput, setLabSubjectsInput] = useState('');
  const [labFacultyCounts, setLabFacultyCounts] = useState('');
  const [timetables, setTimetables] = useState([]);

  const generateTimetables = () => {
    const subjectNames = subjectsInput.split(',').map(item => item.trim());
    const lectureFacultyCounts = facultyCounts.split(',').map(Number);
    const labSubjectNames = labSubjectsInput.split(',').map(item => item.trim());
    const labFacultyCountsArr = labFacultyCounts.split(',').map(Number);

    const subjects = [
      ...subjectNames.map((name, index) => ({ name, hours: lectureFacultyCounts[index] || 1, isLab: false })),
      ...labSubjectNames.map((name, index) => ({ name, hours: labFacultyCountsArr[index] || 2, isLab: true })),
    ];

    const sections = Array.from({ length: numSections }, (_, i) => `Section ${String.fromCharCode(65 + i)}`);
    const generatedTimetables = sections.map(section => createTimetableForSection(subjects));
    setTimetables(generatedTimetables);
  };

  const createTimetableForSection = (subjects) => {
    const schedule = Array.from({ length: days.length }, () => Array(periodsPerDay).fill(null));
    const shuffledSubjects = [...subjects];
    shuffleArray(shuffledSubjects);

    shuffledSubjects.forEach(subject => {
      let hoursLeft = subject.hours;

      while (hoursLeft > 0) {
        const dayIndex = Math.floor(Math.random() * days.length);
        let periodsFilled = 0;

        for (let period = 0; period < periodsPerDay; period++) {
          if (!schedule[dayIndex][period] && periodsFilled < 2) {
            if (subject.isLab && period <= periodsPerDay - 2 && schedule[dayIndex][period + 1] === null) {
              schedule[dayIndex][period] = subject.name;
              schedule[dayIndex][period + 1] = subject.name;
              hoursLeft -= 2;
              periodsFilled += 2;
              period++;
            } else if (!subject.isLab && schedule[dayIndex][period - 1] !== subject.name) {
              schedule[dayIndex][period] = subject.name;
              hoursLeft--;
              periodsFilled++;
            }
          }
          if (hoursLeft === 0 || periodsFilled >= 2) break;
        }
      }
    });
    return schedule;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  return (
    <div className="TimetablePage">
      <div className="header">
        <h2>Multi-section Timetable Generator</h2>
      </div>
      <div className="input-form">
        <label>Number of Sections:</label>
        <input type="number" value={numSections} onChange={e => setNumSections(parseInt(e.target.value) || 1)} min="1" />

        <label>Enter Lecture Subjects (comma-separated):</label>
        <input type="text" value={subjectsInput} onChange={e => setSubjectsInput(e.target.value)} />

        <label>Faculty Available per Lecture Subject (comma-separated):</label>
        <input type="text" value={facultyCounts} onChange={e => setFacultyCounts(e.target.value)} />

        <label>Enter Lab Subjects (comma-separated):</label>
        <input type="text" value={labSubjectsInput} onChange={e => setLabSubjectsInput(e.target.value)} />

        <label>Faculty Available per Lab Subject (comma-separated):</label>
        <input type="text" value={labFacultyCounts} onChange={e => setLabFacultyCounts(e.target.value)} />

        <button onClick={generateTimetables}>Generate Timetables</button>
      </div>
      <div id="timetablesContainer">
        {timetables.map((schedule, index) => (
          <Timetable key={index} section={`Section ${String.fromCharCode(65 + index)}`} schedule={schedule} />
        ))}
      </div>
    </div>
  );
}

export default TimetablePage;
