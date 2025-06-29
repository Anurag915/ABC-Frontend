import React, { useEffect, useState, useRef } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

// Import the CSS file for the scrolling effect
import './NC.css'; // You will create this file

function NC({ labId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContentRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      if (!labId) {
        setError("Lab ID is missing for notices/circulars.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const res = await fetch(`${apiUrl}/api/labs/${labId}`);
        if (!res.ok) throw new Error("Failed to fetch lab data");
        const lab = await res.json();

        const combined = [
          ...(lab.notices || []).map((item) => ({ ...item, type: "Notice", rawDate: item.createdAt || (item._id ? new Date(parseInt(item._id.substring(0, 8), 16) * 1000) : new Date(0)) })),
          ...(lab.circulars || []).map((item) => ({
            ...item,
            type: "Circular",
            rawDate: item.createdAt || (item._id ? new Date(parseInt(item._id.substring(0, 8), 16) * 1000) : new Date(0)),
          })),
        ];

        // Sort by creation date (newest first)
        const sortedItems = combined.sort((a, b) => {
            const dateA = new Date(a.rawDate);
            const dateB = new Date(b.rawDate);
            return dateB - dateA; // Descending order (latest first)
        });

        setItems(sortedItems); // Display all sorted items for the continuous scroll
      } catch (err) {
        console.error("Error fetching notices/circulars:", err);
        setError("Failed to load notices & circulars.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [labId]);


  // Effect for continuous scrolling
  useEffect(() => {
    if (items.length > 0 && scrollContentRef.current) {
        const container = scrollContentRef.current.parentElement;
        const content = scrollContentRef.current;

        // Clone content to create a seamless loop
        content.innerHTML = ''; // Clear previous content before cloning
        items.forEach(itemData => {
            const li = document.createElement('li');
            li.className = 'nc-scroll-item pb-3 border-b border-gray-100 last:border-b-0 last:pb-0'; // Apply Tailwind classes
            li.innerHTML = `
                <a href="${apiUrl}${itemData.fileUrl}" target="_blank" rel="noopener noreferrer" class="block text-gray-700 hover:text-green-700 transition-colors duration-200 group">
                    <div class="flex items-center justify-between">
                        <span class="font-semibold text-base block group-hover:underline">
                            ${itemData.name}
                        </span>
                        ${itemData.rawDate ? `<span class="text-xs text-gray-400 flex-shrink-0 ml-2">${new Date(itemData.rawDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>` : ''}
                    </div>
                    ${itemData.description ? `<p class="text-sm text-gray-500 mt-1">${itemData.description}</p>` : ''}
                    <span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${itemData.type === 'Notice' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                        ${itemData.type}
                    </span>
                </a>
            `;
            content.appendChild(li);
        });

        // Clone the content to make the scroll seamless
        const clonedContent = content.cloneNode(true);
        container.appendChild(clonedContent);

        // Calculate animation duration based on content height
        const totalHeight = content.scrollHeight;
        const duration = totalHeight / 50; // Adjust '50' for scroll speed (lower = faster)

        container.style.animationDuration = `${duration}s`;
        container.classList.add('nc-marquee-animation');

        return () => {
          // Clean up animation class if component unmounts
          container.classList.remove('nc-marquee-animation');
          // Remove cloned content to prevent memory leaks if component re-renders quickly
          if (container.children.length > 1) {
            container.removeChild(clonedContent);
          }
        };
    }
  }, [items, apiUrl]);


  // --- Loading State UI (No external icons) ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Loading notices...</p>
      </div>
    );
  }

  // --- Error State UI (No external icons) ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 rounded-lg p-4 text-center border border-red-200">
        <p className="font-semibold text-lg mb-2">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // --- Empty State UI (No external icons) ---
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
        <p className="text-lg font-medium mb-2">No recent items</p>
        <p className="text-sm">Check back for updates!</p>
      </div>
    );
  }

  // --- Main Content UI ---
  return (
    <div className="w-full h-full relative overflow-hidden"> {/* Added relative and overflow-hidden for marquee */}
        {/* Removed redundant outer divs, assuming parent handles card styling */}
        <div className="h-full nc-scroll-container" ref={scrollContentRef.parentElement}> {/* Ref on parent of scroll-content */}
            <ul className="list-none p-0 space-y-4 nc-scroll-content" ref={scrollContentRef}>
                {/* Content will be dynamically added by useEffect for seamless scroll */}
            </ul>
        </div>
    </div>
  );
}

export default NC;