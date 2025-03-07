import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const isLoading = false;
  const navigate = useNavigate();

  // This function handles the change event for each input field
  const handleChange = (value, index) => {
    const newCode = [...code];

    //HAndle Pasted content
    if (value.length > 1) {
      //slice the first 6 characters of the value and split them into an array
      const pastedCode = value.slice(0, 6).split("");
      //loop through the array and assign each character to the newCode array
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      //set the newCode array to the state
      setCode(newCode);

      //focus on the last non-empty input or the first empty input\
      //find the index of the last non-empty input
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      //if the last filled index is less than 5, focus on the next input, otherwise focus on the last input
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      //focus on the input at the focusIndex
      inputRef.current[focusIndex].focus();
    } else {
      //assign the value to the newCode array at the index
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRef.current[index + 1].focus();
      }
    }
  };

  // This function handles the keydown event for each input field
  const handleKeyDown = (e, index) => {
    // If the key pressed is backspace and the current input field is empty and the index is greater than 0
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Focus on the previous input field
      inputRef.current[index - 1].focus();
    }
  };

  //Auto submit when all fields are filled
  useEffect(() => {
    // Check if every digit in the code array is not an empty string
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit")); //handlesubmit if all digits are filled
    }
  }, [code]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    alert(`VErification code submitted, ${verificationCode}`);
  };

  return (
    <div className="max-w-md w-full bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md "
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-violet-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center mb-6 text-slate-300">
          Enter the 6-digit code sent to your email address
        </p>
        <form onSubmit={""} className="space-y-6">
          <div className="flex justify-evenly">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRef.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => {
                  handleChange(e.target.value, index);
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-11 h-11 text-center text-2xl font-bold bg-slate-700 text-white border-2 border-slate-400 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            ))}
          </div>{" "}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-300"
            type="submit"
            disabled={isLoading || code.some((digit) => digit === "")}
          >
            {isLoading ? "Verifying Email..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
