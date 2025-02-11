import React, { useEffect, useState } from 'react';

const Roadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoadmaps, setFilteredRoadmaps] = useState([]);

  // Fetch roadmaps data from an API (placeholder example)
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Example API
        const data = await response.json();
        const mappedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.body,
          topics: ['React', 'JavaScript', 'CSS'], // Mock topics
        }));
        setRoadmaps(mappedData);
        setFilteredRoadmaps(mappedData); // Initialize filteredRoadmaps with all roadmaps
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchRoadmaps();
  }, []);

  // Update filteredRoadmaps based on search query
  useEffect(() => {
    const results = roadmaps.filter(roadmap =>
      roadmap.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRoadmaps(results);
  }, [searchQuery, roadmaps]);

  return (
    <div className="max-w-5xl text-gray-500 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Roadmaps</h1>
      <input
        type="text"
        placeholder="Search for a course..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-6"
      />
      {filteredRoadmaps.length === 0 ? (
        <p className="text-gray-600">No roadmaps found.</p>
      ) : (
        <div className="space-y-4">
          {filteredRoadmaps.map((roadmap) => (
            <div key={roadmap.id} className="border rounded-lg p-4 bg-gray-100 shadow">
              <h2 className="text-xl font-semibold">{roadmap.title}</h2>
              <p className="text-gray-600 mb-2">{roadmap.description}</p>
              <h3 className="font-bold">Topics:</h3>
              <ul className="list-disc list-inside">
                {roadmap.topics.map((topic, idx) => (
                  <li key={idx} className="text-gray-600">{topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
