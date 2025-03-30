import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useLocation } from "wouter";
import { insertCourseSchema } from "@shared/schema";

// Create a more strict schema for the form with validations
const courseFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(500),
  image: z.string().url({ message: "Please enter a valid image URL" }),
  category: z.string().min(2, { message: "Please select a category" }),
  duration: z.string().min(2, { message: "Please enter the course duration" }),
  fee: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Please enter a valid fee amount" })
});

// Extract the inferred type
type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CourseForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();

  // Initialize the form with default values
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2062&auto=format&fit=crop",
      category: "",
      duration: "",
      fee: "0.00",
    }
  });

  // Handle form submission
  async function onSubmit(values: CourseFormValues) {
    setIsSubmitting(true);
    
    try {
      // Submit the form data to the API
      await apiRequest(
        "POST",
        "/api/courses",
        values
      );
      
      toast({
        title: "Course Created Successfully",
        description: "Your course has been submitted for review",
      });
      
      // Reset the form after successful submission
      form.reset();
      
      // Redirect to courses page after 2 seconds
      setTimeout(() => {
        navigate("/courses");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error Creating Course",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Course Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide a detailed description of your course" 
                  className="h-32 resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Image URL */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter a URL for the course image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Blockchain">Blockchain</SelectItem>
                  <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                  <SelectItem value="Smart Contracts">Smart Contracts</SelectItem>
                  <SelectItem value="Web3">Web3</SelectItem>
                  <SelectItem value="DeFi">DeFi</SelectItem>
                  <SelectItem value="NFTs">NFTs</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                  <SelectItem value="3-4 weeks">3-4 weeks</SelectItem>
                  <SelectItem value="1-2 months">1-2 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="Self-paced">Self-paced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Fee */}
        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Fee (XLM)</FormLabel>
              <FormControl>
                <Input placeholder="Enter course fee in XLM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Course..." : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}