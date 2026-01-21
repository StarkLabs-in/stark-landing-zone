import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import RevealText from "./RevealText";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-lg">S</span>
            </div>
            <RevealText
              text="Starklabs"
              className="font-display font-bold text-lg text-foreground"
            />
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
            <a 
              href="https://github.com/StarkLabs-in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Starklabs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
