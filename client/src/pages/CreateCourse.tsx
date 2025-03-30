import CourseForm from "@/components/CourseForm";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useLocation } from "wouter";

interface CreateCourseProps {
  isWalletConnected: boolean;
  walletAddress: string;
}

export default function CreateCourse({ isWalletConnected, walletAddress }: CreateCourseProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Check if user is connected
  useEffect(() => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to create a course.",
        variant: "destructive",
      });
      
      // Redirect to courses page after 2 seconds
      setTimeout(() => {
        navigate("/courses");
      }, 2000);
    }
  }, [isWalletConnected, toast, navigate]);
  
  // If not connected, show message
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-wallet text-amber-500 text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-neutral-600 mb-6">
            You need to connect your wallet before you can create a course. This allows us to verify your identity and process your course submission.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Create a New Course</h1>
            <p className="text-neutral-600">
              Share your knowledge with the world! Complete the form below to create your course on the EduChain platform.
            </p>
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-primary mt-1 mr-3"></i>
                <div>
                  <p className="text-neutral-800 font-medium">Important Information</p>
                  <p className="text-sm text-neutral-600">
                    Once submitted, your course will be reviewed by our team before being published. All educational credentials for your course will be issued on the Stellar blockchain.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <CourseForm />
        </div>
      </div>
    </div>
  );
}