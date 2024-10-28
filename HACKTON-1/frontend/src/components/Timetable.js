// src/components/Timetable.js
import React from 'react';
import './Timetable.css';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periodsPerDay = 7;

const Timetable = ({ section, schedule }) => (
  <div className="section-table-container">
    <h3 className="section-title">{section}</h3>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          {[...Array(periodsPerDay)].map((_, i) => (
            <th key={i}>Period {i + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {days.map((day, dayIndex) => (
          <tr key={day}>
            <td>{day}</td>
            {schedule[dayIndex].map((subject, periodIndex) => (
              <td key={periodIndex}>{subject || '-'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Timetable;
