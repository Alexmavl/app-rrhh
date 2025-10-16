import React from "react";

export const Card: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="bg-white shadow rounded-xl p-4 border border-gray-100 hover:shadow-lg transition">
    {children}
  </div>
);
