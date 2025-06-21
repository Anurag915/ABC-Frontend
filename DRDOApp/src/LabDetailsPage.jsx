// src/components/LabDetailsPage.jsx (Example Parent Component)
import React from 'react';
import InfiniteLabPhotos from './InfiniteLabPhotos'; // Adjust path as needed
import NoticesAndCirculars from './NoticesAndCirculars'; // Adjust path as needed

function LabDetailsPage({ labId }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row', // Arrange children horizontally
        flexWrap: 'wrap', // Allow items to wrap to the next line on smaller screens
        justifyContent: 'center', // Center items horizontally
        alignItems: 'flex-start', // Align items to the top
        gap: '2rem', // Space between the gallery and notices
        padding: '2rem', // Overall padding for the section
        maxWidth: '1200px', // Max width for the whole content area
        margin: '0 auto', // Center the content area
      }}
    >
      {/* Gallery Component */}
      <div style={{ flex: '2', minWidth: '550px', maxWidth: '750px' }}> {/* Gallery takes more space */}
        <InfiniteLabPhotos labId={labId} />
      </div>

      {/* Notices and Circulars Component */}
      <NoticesAndCirculars labId={labId} />
    </div>
  );
}

export default LabDetailsPage;