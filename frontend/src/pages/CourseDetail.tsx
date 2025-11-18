import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Users, BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseData {
  title: string;
  description: string;
  duration: string;
  trainer: string;
  targetAudience: string[];
  syllabus: string[];
  prerequisites: string[];
  outcomes: string[];
}

const courseData: Record<string, CourseData> = {
  "aws-devops": {
    title: "AWS/DevOps",
    description: "Master cloud infrastructure and deployment automation with AWS and modern DevOps practices",
    duration: "3 Months (12 weeks)",
    trainer: "Pritam Phadtare",
    targetAudience: [
      "Software developers looking to expand into DevOps",
      "System administrators transitioning to cloud",
      "IT professionals seeking AWS certification",
      "Fresh graduates interested in cloud computing"
    ],
    syllabus: [
      "AWS Core Services (EC2, S3, VPC, IAM)",
      "Lambda & Serverless Architecture",
      "RDS & DynamoDB Database Services",
      "CI/CD Pipelines with Jenkins & GitLab",
      "Docker Containerization",
      "Kubernetes Orchestration",
      "Infrastructure as Code with Terraform",
      "Monitoring with CloudWatch",
      "Security Best Practices",
      "Cost Optimization Strategies"
    ],
    prerequisites: [
      "Basic Linux commands",
      "Understanding of networking concepts",
      "Programming knowledge in any language"
    ],
    outcomes: [
      "Deploy and manage AWS infrastructure",
      "Build automated CI/CD pipelines",
      "Containerize applications with Docker",
      "Orchestrate containers using Kubernetes",
      "Implement Infrastructure as Code"
    ]
  },
  "mern": {
    title: "MERN Stack",
    description: "Build modern full-stack web applications using MongoDB, Express, React, and Node.js",
    duration: "4 Months (16 weeks)",
    trainer: "Shraddha Patil",
    targetAudience: [
      "Aspiring full-stack developers",
      "Frontend developers wanting backend skills",
      "Backend developers learning modern frontend",
      "Computer science students",
      "Career changers entering web development"
    ],
    syllabus: [
      "JavaScript ES6+ Features",
      "MongoDB Database Design & Operations",
      "Express.js Server & API Development",
      "RESTful API Design Principles",
      "React Fundamentals & Hooks",
      "State Management with Redux/Context",
      "Node.js Backend Development",
      "Authentication & Authorization (JWT)",
      "Real-time Features with Socket.io",
      "Deployment on Cloud Platforms"
    ],
    prerequisites: [
      "Basic HTML, CSS, JavaScript",
      "Understanding of web concepts",
      "Familiarity with Git basics"
    ],
    outcomes: [
      "Build complete full-stack applications",
      "Create RESTful APIs",
      "Develop responsive React interfaces",
      "Implement user authentication",
      "Deploy applications to production"
    ]
  },
  "java": {
    title: "Java Programming",
    description: "Master enterprise-grade application development with Core Java and Spring Boot",
    duration: "4 Months (16 weeks)",
    trainer: "Pratik Girme",
    targetAudience: [
      "Beginners to programming",
      "Students preparing for technical careers",
      "Developers learning enterprise development",
      "Professionals seeking Java certification",
      "Backend engineers"
    ],
    syllabus: [
      "Java Fundamentals & Syntax",
      "Object-Oriented Programming Concepts",
      "Collections Framework",
      "Exception Handling",
      "Multithreading & Concurrency",
      "JDBC & Database Connectivity",
      "Spring Framework Basics",
      "Spring Boot Application Development",
      "RESTful Web Services",
      "JPA & Hibernate ORM",
      "Microservices Architecture",
      "Testing with JUnit"
    ],
    prerequisites: [
      "Basic computer knowledge",
      "Logical thinking ability",
      "No prior programming required"
    ],
    outcomes: [
      "Write production-ready Java code",
      "Build Spring Boot applications",
      "Create RESTful APIs",
      "Work with databases using JPA",
      "Understand microservices patterns"
    ]
  },
  "data-science": {
    title: "Data Science & Analytics",
    description: "Transform data into actionable insights using Python, Machine Learning, and Analytics tools",
    duration: "5 Months (20 weeks)",
    trainer: "Rushikesh Khades",
    targetAudience: [
      "Data analysts seeking ML skills",
      "Software engineers transitioning to data science",
      "Business analysts wanting technical depth",
      "Statistics graduates entering tech",
      "Professionals in data-driven roles"
    ],
    syllabus: [
      "Python for Data Analysis",
      "NumPy & Pandas Libraries",
      "Data Cleaning & Preprocessing",
      "Exploratory Data Analysis (EDA)",
      "Statistical Analysis",
      "Machine Learning Algorithms",
      "Scikit-learn & Model Building",
      "Deep Learning Basics",
      "Data Visualization (Matplotlib, Seaborn)",
      "Tableau & Power BI",
      "SQL for Data Analysis",
      "Real-world Case Studies"
    ],
    prerequisites: [
      "Basic mathematics & statistics",
      "Programming basics (any language)",
      "Analytical thinking"
    ],
    outcomes: [
      "Analyze complex datasets",
      "Build ML models",
      "Create compelling visualizations",
      "Make data-driven decisions",
      "Work with modern analytics tools"
    ]
  },
  "core-python": {
    title: "Core Python",
    description: "Learn programming fundamentals and automation with Python from scratch",
    duration: "2 Months (8 weeks)",
    trainer: "Ayush Sasane",
    targetAudience: [
      "Complete programming beginners",
      "Students starting their coding journey",
      "Professionals automating tasks",
      "Data enthusiasts learning basics",
      "Anyone interested in programming"
    ],
    syllabus: [
      "Python Installation & Setup",
      "Variables & Data Types",
      "Control Flow (if, loops)",
      "Functions & Modules",
      "Data Structures (Lists, Tuples, Dicts)",
      "Object-Oriented Programming",
      "File Handling & I/O Operations",
      "Error Handling & Exceptions",
      "Working with APIs",
      "Web Scraping Basics",
      "Automation Scripts",
      "Mini Projects"
    ],
    prerequisites: [
      "Basic computer usage",
      "No programming experience required"
    ],
    outcomes: [
      "Write Python programs confidently",
      "Automate repetitive tasks",
      "Work with files and APIs",
      "Understand OOP concepts",
      "Build small automation projects"
    ]
  }
};

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = slug ? courseData[slug] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <Button 
          onClick={() => navigate("/")}
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {course.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
          
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Clock className="mr-2 h-4 w-4" />
              {course.duration}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Award className="mr-2 h-4 w-4" />
              Trainer: {course.trainer}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Who Can Attend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.targetAudience.map((audience, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-foreground/80">{audience}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-foreground/80">{prereq}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Syllabus */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Syllabus</CardTitle>
            <CardDescription>Comprehensive curriculum covering all essential topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {course.syllabus.map((topic, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-primary font-bold">{index + 1}.</span>
                  <span className="text-foreground/80">{topic}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Outcomes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Learning Outcomes</CardTitle>
            <CardDescription>What you'll be able to do after completing this course</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {course.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-foreground/80">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="text-muted-foreground mb-6">
              Enroll now and transform your career with {course.title}
            </p>
            <Button 
              size="lg"
              onClick={() => navigate(`/enquiry?course=${slug}`)}
            >
              Enroll Now
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CourseDetail;
