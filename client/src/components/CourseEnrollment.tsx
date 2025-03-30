import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/components/FeaturedCourses';

interface CourseEnrollmentProps {
  isWalletConnected: boolean;
  walletAddress: string;
  courseId: number;
}

export default function CourseEnrollment({ isWalletConnected, walletAddress, courseId }: CourseEnrollmentProps) {
  const [progress, setProgress] = useState(25); // Example progress percentage
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  
  // Fetch course data
  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: courseId > 0
  });
  
  // Simulate progress for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prevProgress => prevProgress + 5);
      } else {
        setIsCompleted(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  if (isLoading) return <div className="p-12 text-center">Loading course data...</div>;
  if (error) return <div className="p-12 text-center text-red-500">Failed to load course data</div>;
  if (!course) return <div className="p-12 text-center">Course not found</div>;
  
  const handleCompleteCourse = () => {
    toast({
      title: "Course Completed",
      description: "Congratulations! You've completed this course. Your credential will be issued shortly.",
      variant: "default",
    });
  };
  
  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">{course.title}</h1>
              <p className="text-neutral-600">Continue your learning journey</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={handleCompleteCourse}
                className="bg-primary text-white hover:bg-primary/90"
                disabled={!isCompleted}
              >
                {isCompleted ? 'Complete & Get Credential' : 'In Progress'}
              </Button>
            </div>
          </div>
          
          {/* Course Progress Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                  <div 
                    className="w-full aspect-video bg-cover bg-center rounded-lg overflow-hidden" 
                    style={{ backgroundImage: `url(${course.image})` }}
                  ></div>
                </div>
                <div className="md:w-3/4">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${course.category === 'Blockchain' ? 'bg-primary/10 text-primary' : 
                          course.category === 'Development' ? 'bg-secondary/10 text-secondary' : 
                          'bg-accent/10 text-accent'}
                      `}
                    >
                      {course.category}
                    </Badge>
                    <span className="text-xs text-neutral-500">{course.duration}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Your Progress</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-neutral-100 p-3 rounded-lg text-center">
                      <div className="text-sm text-neutral-600 mb-1">Duration</div>
                      <div className="font-medium">{course.duration}</div>
                    </div>
                    <div className="bg-neutral-100 p-3 rounded-lg text-center">
                      <div className="text-sm text-neutral-600 mb-1">Status</div>
                      <div className="font-medium">
                        {isCompleted ? (
                          <span className="text-success">Completed</span>
                        ) : (
                          <span className="text-amber-500">In Progress</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-neutral-100 p-3 rounded-lg text-center">
                      <div className="text-sm text-neutral-600 mb-1">Enrolled On</div>
                      <div className="font-medium">March 30, 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Course Content */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              
              <div className="space-y-4">
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex justify-between items-center">
                    <div className="font-medium">Module 1: Introduction to {course.category}</div>
                    <Badge variant="outline" className="bg-success/10 text-success">Completed</Badge>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-check-circle text-success mr-3"></i>
                          <span>Welcome & Overview</span>
                        </div>
                        <span className="text-xs text-neutral-500">10 min</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-check-circle text-success mr-3"></i>
                          <span>Core Concepts</span>
                        </div>
                        <span className="text-xs text-neutral-500">15 min</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-check-circle text-success mr-3"></i>
                          <span>History & Evolution</span>
                        </div>
                        <span className="text-xs text-neutral-500">20 min</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex justify-between items-center">
                    <div className="font-medium">Module 2: Intermediate Concepts</div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700">In Progress</Badge>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-check-circle text-success mr-3"></i>
                          <span>Advanced Architecture</span>
                        </div>
                        <span className="text-xs text-neutral-500">25 min</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-clock text-amber-500 mr-3"></i>
                          <span>Security Considerations</span>
                        </div>
                        <span className="text-xs text-neutral-500">30 min</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-lock text-neutral-400 mr-3"></i>
                          <span>Implementation Strategies</span>
                        </div>
                        <span className="text-xs text-neutral-500">35 min</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex justify-between items-center">
                    <div className="font-medium">Module 3: Advanced Applications</div>
                    <Badge variant="outline" className="bg-neutral-100 text-neutral-500">Locked</Badge>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between">
                        <div className="flex items-center opacity-50">
                          <i className="fas fa-lock text-neutral-400 mr-3"></i>
                          <span>Practical Use Cases</span>
                        </div>
                        <span className="text-xs text-neutral-500">40 min</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center opacity-50">
                          <i className="fas fa-lock text-neutral-400 mr-3"></i>
                          <span>Real-world Projects</span>
                        </div>
                        <span className="text-xs text-neutral-500">45 min</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center opacity-50">
                          <i className="fas fa-lock text-neutral-400 mr-3"></i>
                          <span>Future Trends</span>
                        </div>
                        <span className="text-xs text-neutral-500">30 min</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Resources */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 border border-neutral-200 rounded-lg hover:border-primary transition cursor-pointer">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-file-pdf text-primary"></i>
                  </div>
                  <div>
                    <div className="font-medium">{course.title} Handbook</div>
                    <div className="text-sm text-neutral-500">PDF Document • 2.5 MB</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-neutral-200 rounded-lg hover:border-primary transition cursor-pointer">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-video text-primary"></i>
                  </div>
                  <div>
                    <div className="font-medium">Recorded Webinar</div>
                    <div className="text-sm text-neutral-500">Video • 45:30</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-neutral-200 rounded-lg hover:border-primary transition cursor-pointer">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-code text-primary"></i>
                  </div>
                  <div>
                    <div className="font-medium">Code Repository</div>
                    <div className="text-sm text-neutral-500">GitHub • Updated March 2025</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}