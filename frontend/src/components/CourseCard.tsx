import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
  slug: string;
}

const CourseCard = ({ title, description, icon: Icon, highlights, slug }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card hover:shadow-hover transition-all duration-300 animate-fadeIn border-border/50 hover:border-primary/30">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary font-bold">•</span>
              <span className="text-foreground/80">{highlight}</span>
            </li>
          ))}
        </ul>
        <Button 
          onClick={() => navigate(`/courses/${slug}`)}
          variant="outline" 
          className="w-full border-primary/30 hover:bg-primary/5"
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;