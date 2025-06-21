// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import axios from "axios";
// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// export default function InfiniteLabPhotos({ labId }) {
//   const [photos, setPhotos] = useState([]);
//   const [skip, setSkip] = useState(0);
//   const limit = 3;
//   const loadingRef = useRef(false);
//   const [hasMore, setHasMore] = useState(true);
//   const containerRef = useRef(null);
//   const autoSlideIntervalRef = useRef(null);
//   const [isHovered, setIsHovered] = useState(false);
//   const autoSlideDelay = 3000;
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const loadPhotos = async () => {
//     if (loadingRef.current || !hasMore) return;
//     loadingRef.current = true;
//     setIsLoading(true);

//     try {
//       const res = await axios.get(
//         `${apiUrl}/api/labs/${labId}/photos?skip=${skip}&limit=${limit}`
//       );

//       if (res.data.length < limit) setHasMore(false);
//       setPhotos((prev) => [...prev, ...res.data]);
//       setSkip((prev) => prev + limit);
//     } catch (err) {
//       console.error("Error loading photos:", err);
//     } finally {
//       loadingRef.current = false;
//       setIsLoading(false);
//     }
//   };

//   const scrollToIndex = useCallback(
//     (index) => {
//       if (!containerRef.current || photos.length === 0) return;
//       const photoBlockWidthVW = 75;
//       const gapPx = parseFloat(getComputedStyle(containerRef.current).gap || "0px");
//       const itemWidth = (containerRef.current.clientWidth * photoBlockWidthVW) / 100 + gapPx;
//       containerRef.current.scrollTo({
//         left: index * itemWidth,
//         behavior: "smooth",
//       });
//     },
//     [photos]
//   );

//   const handleNext = useCallback(() => {
//     setCurrentIndex((prevIndex) => {
//       const totalItems = photos.length + (!hasMore ? 1 : 0);
//       const nextIndex = (prevIndex + 1) % totalItems;
//       scrollToIndex(nextIndex);
//       if (nextIndex >= photos.length - 2 && hasMore && !loadingRef.current) {
//         loadPhotos();
//       }
//       return nextIndex;
//     });
//   }, [photos.length, hasMore, scrollToIndex]);

//   const handlePrev = useCallback(() => {
//     setCurrentIndex((prevIndex) => {
//       const totalItems = photos.length + (!hasMore ? 1 : 0);
//       const prevIndexCalculated = (prevIndex - 1 + totalItems) % totalItems;
//       scrollToIndex(prevIndexCalculated);
//       return prevIndexCalculated;
//     });
//   }, [photos.length, hasMore, scrollToIndex]);

//   useEffect(() => {
//     loadPhotos();
//   }, [labId]);

//   useEffect(() => {
//     const startAutoSlide = () => {
//       if (autoSlideIntervalRef.current) {
//         clearInterval(autoSlideIntervalRef.current);
//       }
//       autoSlideIntervalRef.current = setInterval(() => {
//         if (!isHovered && photos.length > 0) {
//           handleNext();
//         }
//       }, autoSlideDelay);
//     };
//     startAutoSlide();
//     return () => clearInterval(autoSlideIntervalRef.current);
//   }, [isHovered, photos.length, handleNext]);

//   const renderedPhotos = useMemo(() => {
//     return photos.map((photo, index) => (
//       <div
//         key={photo._id}
//         style={{
//           scrollSnapAlign: "center",
//           flexShrink: 0,
//           width: "75vw",
//           height: "360px",
//           position: "relative",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//           overflow: "hidden",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           willChange: "transform",
//           transform: "translateZ(0)",
//         }}
//       >
//         <img
//           src={`${apiUrl}${photo.fileUrl}`}
//           alt={photo.name}
//           loading={index === 0 ? "eager" : "lazy"}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             display: "block",
//           }}
//         />
//       </div>
//     ));
//   }, [photos]);

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100vw",
//         padding: "1rem 0",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <div
//         ref={containerRef}
//         className="overflow-x-auto flex hide-scrollbar"
//         style={{
//           scrollSnapType: "x mandatory",
//           scrollBehavior: "smooth",
//           width: "100%",
//           paddingLeft: "12.5vw",
//           paddingRight: "12.5vw",
//           gap: "1rem",
//         }}
//         tabIndex={0}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {renderedPhotos}
//         {!hasMore && (
//           <div
//             style={{
//               scrollSnapAlign: "center",
//               flexShrink: 0,
//               width: "75vw",
//               height: "360px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "1.2rem",
//               backgroundColor: "#f0f0f0",
//               borderRadius: "8px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//             }}
//           >
//             No more photos
//           </div>
//         )}
//         {isLoading && (
//           <div
//             style={{
//               scrollSnapAlign: "center",
//               flexShrink: 0,
//               width: "75vw",
//               height: "360px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "1.2rem",
//               backgroundColor: "#f0f0f0",
//               borderRadius: "8px",
//               opacity: 0.8,
//             }}
//           >
//             Loading more photos...
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <button
//         onClick={handlePrev}
//         style={navButtonStyle("left")}
//       >
//         {"<"}
//       </button>
//       <button
//         onClick={handleNext}
//         style={navButtonStyle("right")}
//       >
//         {">"}
//       </button>

//       {/* Dots */}
//       <div style={{ display: "flex", marginTop: "1rem", gap: "0.5rem" }}>
//         {Array.from({ length: photos.length + (!hasMore ? 1 : 0) }).map((_, index) => (
//           <span
//             key={index}
//             style={{
//               width: "10px",
//               height: "10px",
//               borderRadius: "50%",
//               backgroundColor: currentIndex === index ? "#333" : "#ccc",
//               cursor: "pointer",
//               transition: "background-color 0.3s ease",
//             }}
//             onClick={() => {
//               setCurrentIndex(index);
//               scrollToIndex(index);
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// const navButtonStyle = (side) => ({
//   position: "absolute",
//   [side]: "1rem",
//   top: "50%",
//   transform: "translateY(-50%)",
//   zIndex: 10,
//   background: "rgba(0,0,0,0.5)",
//   color: "white",
//   border: "none",
//   borderRadius: "50%",
//   width: "40px",
//   height: "40px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
//   fontSize: "1.5rem",
//   paddingBottom: "4px",
// });


import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InfiniteLabPhotos({ labId }) {
  const [photos, setPhotos] = useState([]);
  const [skip, setSkip] = useState(0);
  const limit = 3;
  const loadingRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const autoSlideDelay = 3000;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadPhotos = async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${apiUrl}/api/labs/${labId}/photos?skip=${skip}&limit=${limit}`
      );

      if (res.data.length < limit) setHasMore(false);
      setPhotos((prev) => [...prev, ...res.data]);
      setSkip((prev) => prev + limit);
    } catch (err) {
      console.error("Error loading photos:", err);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  };

  const scrollToIndex = useCallback(
    (index) => {
      if (!containerRef.current || photos.length === 0) return;
      // Define a smaller image width for calculation
      const photoWidth = 500; // Fixed width in pixels for the image block
      const gapPx = parseFloat(getComputedStyle(containerRef.current).gap || "0px");
      const itemWidth = photoWidth + gapPx; // Total width for scrolling including gap

      containerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
    },
    [photos]
  );

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Calculate total items including "No more photos" and "Loading" placeholders
      const totalItems = photos.length + (!hasMore ? 1 : 0) + (isLoading && hasMore ? 1 : 0);
      const nextIndex = (prevIndex + 1) % totalItems;
      scrollToIndex(nextIndex);
      // Preload next set of photos when approaching the end of current batch
      if (nextIndex >= photos.length - 2 && hasMore && !loadingRef.current) {
        loadPhotos();
      }
      return nextIndex;
    });
  }, [photos.length, hasMore, scrollToIndex, loadPhotos, isLoading]); // Added isLoading to dependencies

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Calculate total items including "No more photos" and "Loading" placeholders
      const totalItems = photos.length + (!hasMore ? 1 : 0) + (isLoading && hasMore ? 1 : 0);
      const prevIndexCalculated = (prevIndex - 1 + totalItems) % totalItems;
      scrollToIndex(prevIndexCalculated);
      return prevIndexCalculated;
    });
  }, [photos.length, hasMore, scrollToIndex, isLoading]); // Added isLoading to dependencies

  useEffect(() => {
    loadPhotos();
  }, [labId]);

  useEffect(() => {
    const startAutoSlide = () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
      autoSlideIntervalRef.current = setInterval(() => {
        if (!isHovered && photos.length > 0) {
          handleNext();
        }
      }, autoSlideDelay);
    };
    startAutoSlide();
    return () => clearInterval(autoSlideIntervalRef.current);
  }, [isHovered, photos.length, handleNext, autoSlideDelay]);

  const renderedPhotos = useMemo(() => {
    return photos.map((photo, index) => (
      <div
        key={photo._id}
        style={{
          scrollSnapAlign: "center",
          flexShrink: 0,
          width: "500px", // Smaller fixed width
          height: "300px", // Smaller fixed height
          position: "relative",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)", // Slightly stronger shadow for depth
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
          transform: "translateZ(0)",
          pointerEvents: "none", // Allows clicks to pass through to buttons
          backgroundColor: "#fff", // White background for consistency
        }}
      >
        <img
          src={`${apiUrl}${photo.fileUrl}`}
          alt={photo.name}
          loading={index === 0 ? "eager" : "lazy"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            pointerEvents: "auto", // Re-enable pointer events for the image itself
          }}
        />
      </div>
    ));
  }, [photos]);

  const navButtonStyle = useCallback((side) => ({
    position: "absolute",
    [side]: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "rgba(0,0,0,0.5)", // Darker background for better contrast
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px", // Slightly smaller buttons
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1.5rem", // Standard arrow size
    paddingBottom: "2px", // Minor adjustment for centering arrow character
    opacity: isHovered ? 1 : 0, // Show on hover
    transition: "opacity 0.3s ease, background-color 0.3s ease", // Smooth transitions
    backdropFilter: "blur(3px)", // Stronger blur for better separation
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.7)", // Darken on hover
    },
  }), [isHovered]);


  return (
    <div
      style={{
        position: "relative",
        width: "100%", // Changed to 100% for better responsiveness within parent
        maxWidth: "960px", // Max width for larger screens to keep it contained
        margin: "2rem auto", // Center the component and add vertical margin
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        className="overflow-x-auto flex hide-scrollbar"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          width: "calc(500px + 2rem)", // Adjust container width to show one image + padding clearly
          margin: "0 auto", // Center the inner scroll container
          padding: "0 1rem", // Padding inside the scroll area to show partial next/prev image
          gap: "1rem",
          position: "relative", // Crucial for positioning arrows inside
          minHeight: "300px", // Ensure minimum height
          boxSizing: "content-box", // Ensure padding is added to the total width
        }}
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderedPhotos}
        {!hasMore && photos.length > 0 && (
          <div
            style={{
              scrollSnapAlign: "center",
              flexShrink: 0,
              width: "500px",
              height: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              color: "#666",
              backgroundColor: "#f8f8f8",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            <h3>All Caught Up!</h3>
            <p>No more photos to display.</p>
          </div>
        )}
        {isLoading && (
          <div
            style={{
              scrollSnapAlign: "center",
              flexShrink: 0,
              width: "500px",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: "#666",
              backgroundColor: "#f8f8f8",
              borderRadius: "8px",
              opacity: 0.8,
            }}
          >
            Loading more photos...
          </div>
        )}

        {/* Navigation buttons moved inside containerRef div */}
        <button
          onClick={handlePrev}
          style={navButtonStyle("left")}
          aria-label="Previous photo"
        >
          {"<"}
        </button>
        <button
          onClick={handleNext}
          style={navButtonStyle("right")}
          aria-label="Next photo"
        >
          {">"}
        </button>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", marginTop: "1.5rem", gap: "0.6rem" }}>
        {Array.from({ length: photos.length + (!hasMore && photos.length > 0 ? 1 : 0) + (isLoading && hasMore ? 1 : 0) }).map((_, index) => (
          <span
            key={index}
            style={{
              width: currentIndex === index ? "12px" : "10px", // Active dot slightly larger
              height: currentIndex === index ? "12px" : "10px",
              borderRadius: "50%",
              backgroundColor: currentIndex === index ? "#333" : "#bbb", // Darker active dot
              cursor: "pointer",
              transition: "all 0.3s ease", // Smooth transition for dot size and color
            }}
            onClick={() => {
              setCurrentIndex(index);
              scrollToIndex(index);
            }}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}