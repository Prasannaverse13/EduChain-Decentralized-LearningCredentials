import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  enrollments, type Enrollment, type InsertEnrollment,
  credentials, type Credential, type InsertCredential
} from "@shared/schema";

// Interface for all storage CRUD operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Enrollment methods
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  
  // Credential methods
  getUserCredentials(userId: number): Promise<Credential[]>;
  getCredentialByTxHash(txHash: string): Promise<Credential | undefined>;
  createCredential(credential: InsertCredential): Promise<Credential>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private enrollments: Map<string, Enrollment>;
  private credentials: Map<number, Credential>;
  
  private userIdCounter: number;
  private courseIdCounter: number;
  private enrollmentIdCounter: number;
  private credentialIdCounter: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.credentials = new Map();
    
    this.userIdCounter = 1;
    this.courseIdCounter = 1;
    this.enrollmentIdCounter = 1;
    this.credentialIdCounter = 1;
    
    // Initialize with some courses
    this.initSampleCourses();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      walletAddress: insertUser.walletAddress || null,
      email: insertUser.email || null, 
      name: insertUser.name || null
    };
    this.users.set(id, user);
    return user;
  }
  
  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const createdAt = new Date();
    const course: Course = { ...insertCourse, id, createdAt };
    this.courses.set(id, course);
    return course;
  }
  
  // Enrollment methods
  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    const key = `${userId}-${courseId}`;
    return this.enrollments.get(key);
  }
  
  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values())
      .filter(enrollment => enrollment.userId === userId);
  }
  
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.enrollmentIdCounter++;
    const enrolledAt = new Date();
    const completed = false;
    const completedAt = null;
    
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id, 
      enrolledAt, 
      completed, 
      completedAt 
    };
    
    const key = `${insertEnrollment.userId}-${insertEnrollment.courseId}`;
    this.enrollments.set(key, enrollment);
    return enrollment;
  }
  
  // Credential methods
  async getUserCredentials(userId: number): Promise<Credential[]> {
    return Array.from(this.credentials.values())
      .filter(credential => credential.userId === userId);
  }
  
  async getCredentialByTxHash(txHash: string): Promise<Credential | undefined> {
    return Array.from(this.credentials.values())
      .find(credential => credential.stellarTxHash === txHash);
  }
  
  async createCredential(insertCredential: InsertCredential): Promise<Credential> {
    const id = this.credentialIdCounter++;
    const issuedAt = new Date();
    
    const credential: Credential = { 
      ...insertCredential, 
      id, 
      issuedAt,
      stellarTxHash: insertCredential.stellarTxHash || null,
      skills: insertCredential.skills || null,
      metaData: insertCredential.metaData || null
    };
    
    this.credentials.set(id, credential);
    return credential;
  }
  
  // Initialize sample courses for development
  private initSampleCourses() {
    const sampleCourses: InsertCourse[] = [
      {
        title: "Blockchain Fundamentals",
        description: "Learn the core concepts of blockchain technology, cryptography, and distributed ledger systems.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        category: "Blockchain",
        duration: "8 weeks",
        fee: "Free"
      },
      {
        title: "Stellar Development",
        description: "Master Stellar blockchain development with hands-on projects and real-world applications.",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
        category: "Development",
        duration: "6 weeks",
        fee: "Free"
      },
      {
        title: "Smart Contract Engineering",
        description: "Build secure and efficient smart contracts for decentralized applications on Stellar.",
        image: "https://images.unsplash.com/photo-1633265486064-086b219458ec",
        category: "Advanced",
        duration: "10 weeks",
        fee: "Free"
      }
    ];
    
    sampleCourses.forEach(course => {
      this.createCourse(course);
    });
  }
}

// Initialize the storage with sample data for development
export const storage = new MemStorage();

// Create sample courses
(async () => {
  try {
    // Check if storage is properly initialized by getting courses
    const courses = await storage.getAllCourses();
    console.log(`Storage initialized with ${courses.length} courses`);
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
})();
