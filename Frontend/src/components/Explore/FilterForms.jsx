import React, { useState } from 'react';

const FilterForms = () => {
  // State for each filter form
  const [filtersSection1, setFiltersSection1] = useState({
    experience: [],
    ratings: '',
    sessions: '',
  });

  const [filtersSection2, setFiltersSection2] = useState({
    experience: '',
    ratings: '',
    sessions: '',
  });

  const [filtersSection3, setFiltersSection3] = useState({
    experience: '',
    ratings: '',
    sessions: '',
  });

  // Handler for filter changes
  const handleFilterChange = (section, setFilters) => (e) => {
    if (section === 1 && e.target.name === 'experience') {
      const value = e.target.value;
      setFilters((prevFilters) => {
        const newExperience = prevFilters.experience.includes(value)
          ? prevFilters.experience.filter((exp) => exp !== value)
          : [...prevFilters.experience, value];
        return { ...prevFilters, experience: newExperience };
      });
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center mt-10 items-start space-y-4 sm:space-y-0 sm:space-x-4">
      {/* Filters Section 1 - Experience Checkbox */}
      <div className="bg-white rounded-lg p-4 shadow-lg w-full sm:w-80">
        <h3 className="text-lg font-semibold mb-2">Experience</h3>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Experience</label>
            {['1+ years', '2+ years', '3+ years', '4+ years', '5+ years'].map((exp) => (
              <div key={exp} className="flex items-center">
                <input
                  type="checkbox"
                  value={exp}
                  checked={filtersSection1.experience.includes(exp)}
                  onChange={handleFilterChange(1, setFiltersSection1)}
                  name="experience"
                  className="mr-2"
                />
                <label className="text-lg">{exp}</label>
              </div>
            ))}
          </div>
          
          <button className="mt-4 bg-blue-500 text-white rounded py-2">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Filters Section 2 - Ratings Options */}
      <div className="bg-white rounded-lg p-4 shadow-lg w-full sm:w-80">
        <h3 className="text-lg font-semibold mb-2">Ratings</h3>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Rating</label>
            {['1', '2', '3', '4', '5'].map((rating) => (
              <div key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="ratings"
                  value={rating}
                  checked={filtersSection2.ratings === rating}
                  onChange={handleFilterChange(2, setFiltersSection2)}
                  className="mr-2"
                />
                <label className="text-lg">{rating}</label>
              </div>
            ))}
          </div>
          
          <button className="mt-4 bg-blue-500 text-white rounded py-2">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Filters Section 3 - Sessions Options */}
      <div className="bg-white rounded-lg p-4 shadow-lg w-full sm:w-80">
        <h3 className="text-lg font-semibold mb-2">Sessions</h3>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Sessions</label>
            {['10', '50', '100', '150', '200'].map((session) => (
              <div key={session} className="flex items-center">
                <input
                  type="radio"
                  name="sessions"
                  value={session}
                  checked={filtersSection3.sessions === session}
                  onChange={handleFilterChange(3, setFiltersSection3)}
                  className="mr-2"
                />
                <label className="text-lg">{session} + sessions</label>
              </div>
            ))}
          </div>
          
          <button className="mt-4 bg-blue-500 text-white rounded py-2">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterForms;
