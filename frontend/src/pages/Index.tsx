import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { Cloud, Code, Database, ChartBar, Coffee, FileCode } from "lucide-react";

const Index = () => {
  const courses = [
    {
      title: "AWS/DevOps",
      description: "Master cloud infrastructure and deployment automation",
      icon: Cloud,
      slug: "aws-devops",
      highlights: [
        "AWS services (EC2, S3, Lambda, RDS)",
        "CI/CD pipelines with Jenkins & GitLab",
        "Docker & Kubernetes orchestration",
        "Infrastructure as Code with Terraform"
      ]
    },
    {
      title: "MERN Stack",
      description: "Build full-stack web applications with modern JavaScript",
      icon: Code,
      slug: "mern",
      highlights: [
        "MongoDB for scalable databases",
        "Express.js backend development",
        "React.js for dynamic UIs",
        "Node.js server-side programming"
      ]
    },
    {
      title: "Data Science & Analytics",
      description: "Transform data into actionable insights",
      icon: ChartBar,
      slug: "data-science",
      highlights: [
        "Python for data analysis",
        "Machine Learning algorithms",
        "Data visualization with Tableau & Power BI",
        "Statistical modeling and predictions"
      ]
    },
    {
      title: "Core Python",
      description: "Learn programming fundamentals with Python",
      icon: Coffee,
      slug: "core-python",
      highlights: [
        "Python syntax and data structures",
        "Object-oriented programming",
        "File handling and APIs",
        "Web scraping and automation"
      ]
    },
    {
      title: "Java Programming",
      description: "Enterprise-grade application development",
      icon: FileCode,
      slug: "java",
      highlights: [
        "Core Java concepts and OOP",
        "Spring Boot framework",
        "RESTful API development",
        "Database connectivity with JDBC"
      ]
    },
    {
      title: "Database Management",
      description: "Master SQL and NoSQL database systems",
      icon: Database,
      slug: "database",
      highlights: [
        "MySQL and PostgreSQL",
        "MongoDB and Redis",
        "Database design and optimization",
        "Query optimization techniques"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Coding Cloud
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your career with industry-leading courses in software development, 
            cloud computing, and data science. Learn from experts and build real-world projects.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-foreground/70">
            <span className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              ✓ Live Projects
            </span>
            <span className="px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
              ✓ Expert Instructors
            </span>
            <span className="px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
              ✓ Job Assistance
            </span>
          </div>
        </section>

        {/* Courses Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">
            Our <span className="text-primary">Premium Courses</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-20 text-center">
          <div className="bg-card rounded-2xl p-12 shadow-card border border-border/50">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with Coding Cloud. 
              Get personalized course recommendations and start learning today.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;