import React from "react";

const Input = ({ icon: Icon, ...rest }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-indigo-500" />
      </div>
      <input
        {...rest}
        className="w-full pl-10 pr-3 py-2 bg-slate-800/50   rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400 transition-all duration-300"
      />
    </div>
  );
};

export default Input;
