import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const links = {
    Research: ["AI Lab", "Quantum Lab", "Energy Lab", "Publications"],
    Company: ["About Us", "Careers", "News", "Partners"],
    Legal: ["Privacy Policy", "Terms of Service", "Security"],
  };

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-xl">S</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Stark<span className="text-primary">labs</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-xs mb-6">
              Pioneering breakthrough technologies for a better tomorrow.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Starklabs. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Advancing humanity through science and innovation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
