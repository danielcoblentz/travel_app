"use client";

import React, { useState } from 'react';

export default function AddTrip() {
  const [formData, setFormData] = useState({
    title: '',
   description: '',
   startDate: '',
   endDate: '',
   TripImg: '' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { title, value } = target;
    setFormData(prevState => ({
      ...prevState,
      [title]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // You would typically send this data to an API here
    alert(`Thank you, ${formData.title}! Check the console for full details.`);
  }; // we want the user to upload the following {title, description, dates, trip}

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
      <div>
        <label htmlFor="title">title:</label>
        <input
          type="text"
          id="title"
          title="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
     


      <div>
        <label htmlFor="title">title:</label>
        <input
          type="text"
          id="title"
          title="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

     <div>
        <label htmlFor="title">title:</label>
        <input
          type="text"
          id="title"
          title="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

     <div>
        <label htmlFor="img">Image URL:</label>
        <input
          type="text"
          id="img"
          title="img"
          value={formData.TripImg}
          onChange={handleChange}
        />
      </div>
       <div>
        <label htmlFor="img">Image URL:</label>
        <input
          type="text"
          id="img"
          title="img"
          value={formData.TripImg}
          onChange={handleChange}
        />
      </div>
      
      <button type="submit">Add Trip</button>
    </form>
  );
}