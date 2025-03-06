import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <Check className="size-4 text-indigo-500 mr-2" />
          ) : (
            <X className="size-4 text-slate-500 mr-2" />
          )}
          <span className={item.met ? "text-indigo-500" : "text-slate-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  //This function takes a password as an argument and returns a strength score based on the length of the password and the presence of different types of characters
  const getStrength = (pass) => {
    //Initialize the strength score to 0
    let strength = 0;
    //If the password is at least 6 characters long, increase the strength score by 1
    if (pass.length >= 6) strength++;
    //If the password contains both lowercase and uppercase letters, increase the strength score by 1
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    //If the password contains a number, increase the strength score by 1
    if (pass.match(/\d/)) strength++;
    //If the password contains a special character, increase the strength score by 1
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    //Return the final strength score
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-indigo-500";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-400">Password strength</span>
        <span className="text-xs text-slate-400">
          {getStrengthText(strength)}
        </span>
      </div>

      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-slate-600"}
              `}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};
export default PasswordStrengthMeter;
