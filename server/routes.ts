import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCourseSchema, insertCredentialSchema, insertUserSchema } from "@shared/schema";
import * as stellarService from "./stellar";
import * as blendService from "./blend";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Stellar Smart Contract Routes
  app.post("/api/stellar/deploy-contract", async (req, res) => {
    try {
      console.log("Deploying Stellar smart contract for credential issuance...");
      const result = await stellarService.setupCredentialContract();
      
      res.status(201).json({
        contractId: result.contractId,
        stellarExpertUrl: `https://stellar.expert/explorer/testnet/account/${result.contractId}`
      });
    } catch (error) {
      console.error("Contract deployment error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to deploy Stellar contract"
      });
    }
  });
  
  app.get("/api/stellar/contract-info", async (req, res) => {
    try {
      // Use the predefined contract ID
      const contractId = "GBTYMOXZNUPHG7LDJ7X7JZKDCDCPMGH45H3JGOJQPOJC2YRFYFJNCPTL";
      
      // Check if account exists
      const accountExists = await stellarService.checkAccount(contractId);
      
      if (!accountExists) {
        return res.status(404).json({ 
          message: "Contract not deployed yet",
          deployed: false
        });
      }
      
      res.json({
        contractId: contractId,
        deployed: true,
        stellarExpertUrl: `https://stellar.expert/explorer/testnet/account/${contractId}`
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get contract info" 
      });
    }
  });
  
  // Users
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid user data" 
      });
    }
  });

  app.get("/api/users/me", async (req, res) => {
    try {
      // In a real app, this would use session to get the current user's ID
      // For now, we'll return a sample user
      const userId = 1; // This would come from session in a real app
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get user"
      });
    }
  });

  // Courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get courses" 
      });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }
      
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get course" 
      });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      // Use wallet address from request header
      const walletAddress = req.headers['x-wallet-address'] as string;
      
      if (!walletAddress) {
        return res.status(401).json({ message: "Wallet address is required" });
      }
      
      // Get or create user based on wallet address
      let user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        // Create a new user with the wallet address
        user = await storage.createUser({
          username: `user_${Date.now()}`,
          email: `${Date.now()}@example.com`, // Placeholder
          password: "password123", // Placeholder
          walletAddress
        });
      }
      
      const courseData = insertCourseSchema.parse(req.body);
      
      // Add creator information
      const enrichedCourseData = {
        ...courseData,
        creatorId: user.id,
        status: 'pending' // Courses are pending review by default
      };
      
      const course = await storage.createCourse(enrichedCourseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid course data" 
      });
    }
  });

  // Enrollments
  app.post("/api/courses/:id/enroll", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }
      
      // Use wallet address from request header
      const walletAddress = req.headers['x-wallet-address'] as string;
      
      if (!walletAddress) {
        return res.status(401).json({ message: "Wallet address is required" });
      }
      
      // Check if course exists
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Get or create user based on wallet address
      let user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        // Create a new user with the wallet address
        user = await storage.createUser({
          username: `user_${Date.now()}`,
          email: `${Date.now()}@example.com`, // Placeholder
          password: "password123", // Placeholder
          walletAddress
        });
      }
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(user.id, courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      const enrollment = await storage.createEnrollment({
        userId: user.id,
        courseId
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to enroll in course" 
      });
    }
  });
  
  app.get("/api/enrollments/me", async (req, res) => {
    try {
      // Use wallet address from request header
      const walletAddress = req.headers['x-wallet-address'] as string;
      
      if (!walletAddress) {
        return res.status(401).json({ message: "Wallet address is required" });
      }
      
      // Get user by wallet address
      const user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        // Return empty array if user not found - they just haven't enrolled in any courses yet
        return res.json([]);
      }
      
      // Get all enrollments for this user
      const enrollments = await storage.getUserEnrollments(user.id);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get enrollments" 
      });
    }
  });

  // Credentials
  app.get("/api/credentials/me", async (req, res) => {
    try {
      // In a real app, userId would come from session
      const userId = 1; // Mock user ID
      
      const credentials = await storage.getUserCredentials(userId);
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get credentials" 
      });
    }
  });

  app.post("/api/credentials/issue", async (req, res) => {
    try {
      const schema = z.object({
        userId: z.number().optional(),
        courseId: z.number(),
        destination: z.string().optional(),
        walletAddress: z.string().optional(),
        credentialData: z.object({}).passthrough().optional()
      });
      
      const { userId, courseId, destination, walletAddress, credentialData: customData } = schema.parse(req.body);
      
      // Use destination or walletAddress
      const recipientAddress = destination || walletAddress || req.headers['x-wallet-address'] as string;
      
      if (!recipientAddress) {
        return res.status(400).json({ message: "Recipient wallet address is required" });
      }
      
      // Determine user ID
      let targetUserId = userId;
      if (!targetUserId) {
        // Try to find user by wallet address
        const user = await storage.getUserByWalletAddress(recipientAddress);
        targetUserId = user?.id || 1; // Fall back to default user if not found
      }
      
      // Get course info
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user has completed the course (skip for demo/hackathon)
      const enrollment = await storage.getEnrollment(targetUserId, courseId);
      
      /* In production, we would check this, but for hackathon/demo we allow credential issuance regardless
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      
      if (!enrollment.completed) {
        return res.status(400).json({ message: "Course not completed yet" });
      }
      */
      
      // Prepare credential data
      const credentialData = customData || {
        id: `cred-${Date.now()}`,
        title: `${course.title} Certificate`,
        recipient: recipientAddress,
        institution: "EduChain Platform",
        courseId: courseId,
        issueDate: new Date().toISOString(),
        skills: ["Blockchain", "Stellar", course.category],
        type: "course_completion"
      };
      
      // Issue credential on Stellar blockchain using our smart contract platform
      console.log(`Issuing credential to ${recipientAddress} for course ${courseId}`);
      const txHash = await stellarService.issueCredential(recipientAddress, credentialData);
      
      // Save credential in database
      const credential = await storage.createCredential({
        title: `${course.title} Certificate`,
        description: `Successfully completed the ${course.title} course`,
        userId: targetUserId,
        courseId,
        issuerName: "EduChain Platform",
        stellarTxHash: txHash,
        skills: Array.isArray(credentialData.skills) ? credentialData.skills : ["Blockchain", "Stellar", course.category],
        metaData: credentialData,
      });
      
      // Return both the credential record and the Stellar transaction info
      res.status(201).json({
        credential,
        txHash,
        stellarExpertUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`
      });
    } catch (error) {
      console.error("Credential issuance error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to issue credential on Stellar"
      });
    }
  });

  app.get("/api/credentials/verify/:hash", async (req, res) => {
    try {
      const txHash = req.params.hash;
      
      // Verify on Stellar blockchain
      const verificationResult = await stellarService.verifyCredential(txHash);
      
      if (!verificationResult) {
        return res.status(404).json({ message: "Credential not found or invalid" });
      }
      
      // Get credential from database for additional info
      const credential = await storage.getCredentialByTxHash(txHash);
      
      res.json({
        verified: true,
        stellarData: verificationResult,
        credential
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to verify credential" 
      });
    }
  });

  // Blend Protocol Routes (DeFi Educational Lending)
  app.post("/api/blend/loan-application", async (req, res) => {
    try {
      const loanRequestSchema = z.object({
        borrowerPublicKey: z.string().min(1),
        collateralCredentials: z.array(z.string()),
        requestedAmount: z.number().positive(),
        courseName: z.string().min(1),
        institutionName: z.string().min(1),
        loanTermMonths: z.number().positive()
      });

      const validatedData = loanRequestSchema.parse(req.body);
      
      // Process loan application through Blend Protocol
      const loanOffer = await blendService.processBlendLoanApplication(validatedData);
      
      res.status(201).json({
        success: true,
        loanOffer
      });
    } catch (error) {
      console.error("Blend loan application error:", error);
      res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : "Failed to process loan application" 
      });
    }
  });

  app.get("/api/blend/pool-stats", async (req, res) => {
    try {
      const poolStats = await blendService.getBlendPoolStatistics();
      res.json(poolStats);
    } catch (error) {
      console.error("Error fetching Blend pool stats:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch pool statistics" 
      });
    }
  });

  app.get("/api/blend/borrower-validation/:publicKey", async (req, res) => {
    try {
      const publicKey = req.params.publicKey;
      const validation = await blendService.validateBlendBorrower(publicKey);
      res.json(validation);
    } catch (error) {
      console.error("Error validating Blend borrower:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to validate borrower" 
      });
    }
  });

  app.get("/api/blend/contract-info", async (req, res) => {
    try {
      const contractInfo = blendService.getBlendContractInfo();
      res.json(contractInfo);
    } catch (error) {
      console.error("Error fetching Blend contract info:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch contract information" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
