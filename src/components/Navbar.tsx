import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Elevate + condense the navbar once the user scrolls past the hero fold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "About", href: "/#about" },
    { label: "Future AI Club", href: "/future-ai-club" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/90 border-border shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
          : "bg-background/60 border-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "py-3" : "py-4"
          }`}
        >
          <Link to="/">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-effect">
                <span className="font-display font-bold text-primary-foreground text-xl">S</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Stark<span className="text-primary">labs</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const cls =
                "group relative text-muted-foreground hover:text-foreground transition-colors font-medium";
              const underline = (
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              );
              return item.href.startsWith("/") ? (
                <Link key={item.label} to={item.href} className={cls}>
                  {item.label}
                  {underline}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className={cls}>
                  {item.label}
                  {underline}
                </a>
              );
            })}
            <Link to="/products">
              <Button className="glow-effect shimmer-on-hover">Explore Products</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 pb-4 pt-2">
                {navItems.map((item) =>
                  item.href.startsWith("/") ? (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  )
                )}
                <Link to="/products" onClick={() => setIsOpen(false)}>
                  <Button className="glow-effect w-full">Explore Products</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
