import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import CourseEnrollment from '@/components/CourseEnrollment';
import { Button } from '@/components/ui/button';

interface CourseDetailsProps {
  isWalletConnected: boolean;
  walletAddress: string;
}

export default function CourseDetails({ isWalletConnected, walletAddress }: CourseDetailsProps) {
  // Get course ID from URL
  const [location] = useLocation();
  const courseId = parseInt(location.split('/courses/')[1]) || 0;
  
  // Check if user is enrolled in this course
  const { data: enrollments, isLoading } = useQuery<any[]>({
    queryKey: ['/api/enrollments/me'],
    enabled: isWalletConnected
  });
  
  // Check if the user is enrolled in this course
  const isEnrolled = Array.isArray(enrollments) && enrollments.some((enrollment: any) => enrollment.courseId === courseId) || false;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading course details...</p>
        </div>
      </div>
    );
  }
  
  // If user is not connected, prompt to connect
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-wallet text-amber-500 text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
          <p className="text-neutral-600 mb-6">
            Please connect your wallet to view your enrolled courses. You'll need to be connected to track your progress and earn credentials.
          </p>
          <Button asChild className="bg-primary text-white hover:bg-primary/90">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    );
  }
  
  // If user is not enrolled in this course, show enrollment message
  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-exclamation-triangle text-amber-500 text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Not Enrolled</h2>
          <p className="text-neutral-600 mb-6">
            You're not enrolled in this course. Browse our available courses to enroll and start your learning journey.
          </p>
          <Button asChild className="bg-primary text-white hover:bg-primary/90">
            <a href="/courses">View Available Courses</a>
          </Button>
        </div>
      </div>
    );
  }
  
  // Show the course content for enrolled users
  return <CourseEnrollment isWalletConnected={isWalletConnected} walletAddress={walletAddress} courseId={courseId} />;
}