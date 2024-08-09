import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center p-4 text-red-800 bg-red-100 rounded-lg">
      <AlertCircle className="h-6 w-6 mr-2" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
