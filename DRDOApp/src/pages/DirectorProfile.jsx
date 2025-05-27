import { useEffect, useState } from "react";
import axios from "axios";

const apiUri = import.meta.env.VITE_API_URL;

const DirectorProfile = () => {
  const [director, setDirector] = useState(null);
  const [about, setAbout] = useState("");

  const labId = "6831e91d804bf498865b819d";

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const response = await axios.get(`${apiUri}/api/labs/${labId}`);
        const currentDirector = response.data.currentDirector || null;
        setDirector(currentDirector);
        setAbout(
          currentDirector?.about ||
            currentDirector?.user?.about ||
            response.data.about ||
            ""
        );
      } catch (error) {
        console.error("Error fetching lab info:", error);
      }
    };

    fetchLab();
  }, []);

  if (!director) {
    return <div className="text-center mt-10">Loading director profile...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Image and Name Side by Side */}
      <div className="flex items-center gap-6 mb-8">
        {director.photo && (
          <img
            src={`${apiUri}${director.photo}`}
            alt="Director"
            className="w-40 h-48 object-cover rounded-lg shadow-md"
          />
        )}
        {(director.image || director.user?.photo) && (
          <img
            src={`${apiUri}${director.image || director.user.photo}`}
            alt="Director"
            className="w-40 h-48 object-cover rounded-lg shadow-md"
          />
        )}

        <h2 className="text-3xl font-bold text-gray-800">
          {director.name || "N/A"}
        </h2>
      </div>

      {/* About Section */}
      <div>
        <h3 className="text-2xl font-semibold text-[#003168] mb-3">About</h3>
        <p className="text-lg text-gray-700 leading-relaxed text-justify">
          {director.about ||
            director.user?.about ||
            "No information provided yet."}
        </p>
      </div>
    </div>
  );
};

export default DirectorProfile;
