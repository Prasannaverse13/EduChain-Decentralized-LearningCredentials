import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  fee: string;
}

export default function FeaturedCourses() {
  const { toast } = useToast();

  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const enrollCourse = async (courseId: number) => {
    try {
      // Call API to enroll in course
      await apiRequest('POST', `/api/courses/${courseId}/enroll`, {});
      
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

  if (isLoading) {
    return (
      <section id="courses" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-8">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="courses" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">Featured Courses</h2>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            <p>Failed to load courses. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

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
  ];

  const displayCourses = courses || fallbackCourses;

  return (
    <section id="courses" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">Featured Courses</h2>
          <a href="/courses" className="text-primary font-medium hover:text-primary/80 transition hidden md:block">
            View all courses
            <i className="fas fa-arrow-right ml-1"></i>
          </a>
        </div>
        
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
                  <Button 
                    onClick={() => enrollCourse(course.id)}
                    className="bg-primary text-white hover:bg-primary/90 transition"
                    size="sm"
                  >
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <a href="/courses" className="inline-block text-primary font-medium hover:text-primary/80 transition">
            View all courses
            <i className="fas fa-arrow-right ml-1"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
