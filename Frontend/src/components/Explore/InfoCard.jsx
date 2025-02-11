import React from "react";

const InfoCard = ({ title, description }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default InfoCard;
