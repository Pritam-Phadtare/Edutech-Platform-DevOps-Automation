import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 rounded-lg gradient-primary">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Coding Cloud
          </span>
        </Link>
        
        <Button 
          onClick={() => navigate("/enquiry")}
          className="gradient-primary hover:opacity-90 transition-opacity"
        >
          Enquire Now
        </Button>
      </div>
    </header>
  );
};

export default Header;