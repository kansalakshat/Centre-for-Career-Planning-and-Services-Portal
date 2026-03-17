import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "corporate");

    useEffect(() => {
        document.querySelector("html").setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "corporate" ? "business" : "corporate");
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-sm btn-circle bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-none shadow-sm"
            aria-label="Toggle Theme"
        >
            {theme === "corporate" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;
