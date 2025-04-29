
import SubmissionResult from "@/components/SubmissionResult";
import { useLocation, useNavigate } from "react-router-dom";

const SubmissionResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, message } = location.state || { 
    success: false, 
    message: "No submission details found." 
  };

  const handleReset = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Space Tech RFP Matchmaker
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Submission Result
          </p>
        </div>

        <SubmissionResult 
          success={success} 
          message={message} 
          onReset={handleReset} 
        />
      </div>
    </div>
  );
};

export default SubmissionResultPage;
