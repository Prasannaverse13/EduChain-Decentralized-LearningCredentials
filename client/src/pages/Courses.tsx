import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/components/FeaturedCourses';
import { useLocation } from 'wouter';

interface CoursesProps {
  isWalletConnected: boolean;
  walletAddress: string;
}

export default function Courses({ isWalletConnected, walletAddress }: CoursesProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);

  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });
  
  // Fetch user's enrollments
  const { data: enrollmentData } = useQuery<{userId: number, courseId: number}[]>({
    queryKey: ['/api/enrollments/me'],
    enabled: isWalletConnected
  });
  
  // Update enrolled courses when enrollment data changes
  useEffect(() => {
    if (enrollmentData && enrollmentData.length > 0) {
      const courseIds = enrollmentData.map(enrollment => enrollment.courseId);
      setEnrolledCourses(courseIds);
    }
  }, [enrollmentData]);

  const enrollCourse = async (courseId: number) => {
    try {
      if (!walletAddress) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet first to enroll in courses.",
          variant: "destructive",
        });
        return;
      }
      
      // Call API to enroll in course
      await apiRequest('POST', `/api/courses/${courseId}/enroll`, {});
      
      // Add the course to enrolledCourses
      setEnrolledCourses(prev => [...prev, courseId]);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments/me'] });
      
      toast({
        title: "Enrollment Successful",
        description: "You've been enrolled in this course. Check your dashboard to get started.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: error instanceof Error ? error.message : "Could not enroll in the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If API doesn't return data yet, provide fallback courses
  const fallbackCourses: Course[] = [
    {
      id: 1,
      title: "Blockchain Fundamentals",
      description: "Learn the core concepts of blockchain technology, cryptography, and distributed ledger systems.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      category: "Blockchain",
      duration: "8 weeks",
      fee: "Free"
    },
    {
      id: 2,
      title: "Stellar Development",
      description: "Master Stellar blockchain development with hands-on projects and real-world applications.",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
      category: "Development",
      duration: "6 weeks",
      fee: "Free"
    },
    {
      id: 3,
      title: "Smart Contract Engineering",
      description: "Build secure and efficient smart contracts for decentralized applications on Stellar.",
      image: "https://images.unsplash.com/photo-1633265486064-086b219458ec",
      category: "Advanced",
      duration: "10 weeks",
      fee: "Free"
    },
    {
      id: 4,
      title: "Decentralized Finance (DeFi)",
      description: "Explore the world of decentralized finance and learn how to build DeFi applications on Stellar.",
      image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74",
      category: "Finance",
      duration: "12 weeks",
      fee: "Free"
    },
    {
      id: 5,
      title: "Blockchain for Education",
      description: "Learn how blockchain technology is transforming the education sector with verifiable credentials.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      category: "Education",
      duration: "4 weeks",
      fee: "Free"
    },
    {
      id: 6,
      title: "Tokenomics and Cryptocurrency",
      description: "Understanding the economics of tokens and cryptocurrencies in blockchain ecosystems.",
      image: "https://images.unsplash.com/photo-1518544866330-3588e837ec8f",
      category: "Economics",
      duration: "6 weeks",
      fee: "Free"
    }
  ];

  const displayCourses = courses || fallbackCourses;

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Courses</h1>
            <p className="text-neutral-600">Explore our range of blockchain and Stellar-related courses. All credentials are issued on the Stellar blockchain.</p>
          </div>
          {isWalletConnected && (
            <Button 
              onClick={() => navigate('/courses/create')}
              className="mt-4 md:mt-0 bg-primary text-white hover:bg-primary/90 transition flex items-center"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Add Your Course
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="outline" className="bg-white cursor-pointer">All Courses</Badge>
          <Badge variant="outline" className="bg-white cursor-pointer">Blockchain</Badge>
          <Badge variant="outline" className="bg-white cursor-pointer">Development</Badge>
          <Badge variant="outline" className="bg-white cursor-pointer">Advanced</Badge>
          <Badge variant="outline" className="bg-white cursor-pointer">Finance</Badge>
          <Badge variant="outline" className="bg-white cursor-pointer">Education</Badge>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white shadow-sm">
                <div className="h-48 bg-neutral-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-neutral-200 animate-pulse mb-3 w-1/3"></div>
                  <div className="h-6 bg-neutral-200 animate-pulse mb-2"></div>
                  <div className="h-4 bg-neutral-200 animate-pulse mb-2"></div>
                  <div className="h-4 bg-neutral-200 animate-pulse mb-4 w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-neutral-200 animate-pulse w-1/4"></div>
                    <div className="h-9 bg-neutral-200 animate-pulse w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center bg-red-50 text-red-500 p-4 rounded-lg">
            <p>Failed to load courses. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course) => (
              <Card key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="w-full h-48 bg-neutral-200 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${course.image})` }}
                  ></div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${course.category === 'Blockchain' ? 'bg-primary/10 text-primary' : 
                         course.category === 'Development' ? 'bg-secondary/10 text-secondary' : 
                         course.category === 'Finance' ? 'bg-green-100 text-green-700' :
                         course.category === 'Education' ? 'bg-blue-100 text-blue-700' :
                         'bg-accent/10 text-accent'}
                      `}
                    >
                      {course.category}
                    </Badge>
                    <span className="ml-2 text-xs text-neutral-500">{course.duration}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-neutral-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-800 font-medium">{course.fee}</span>
                    {enrolledCourses.includes(course.id) ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-success/10 text-success">
                          <i className="fas fa-check mr-1"></i> Enrolled
                        </Badge>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          View Course
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => enrollCourse(course.id)}
                        className="bg-primary text-white hover:bg-primary/90 transition"
                        size="sm"
                        disabled={!isWalletConnected}
                      >
                        {!isWalletConnected ? 'Connect Wallet to Enroll' : 'Enroll Now'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
