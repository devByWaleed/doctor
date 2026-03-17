import { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const TopButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button when scrolled down 300px, hide when at top
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Adds smooth scrolling
        });
    };

    return (
        <>
            {showButton && (
                <img
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 w-12 h-12 cursor-pointer
                    rounded-full shadow-lg hover:-translate-y-2 transition-all duration-300"
                    src={assets.TopIcon}
                    alt="Back to Top"
                />
            )}
        </>
    );
};

export default TopButton;