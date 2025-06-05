import React, { useState } from "react";
import axios from "axios";
import { HiEye, HiEyeOff } from "react-icons/hi";

const apiUrl = import.meta.env.VITE_API_URL;

const designationOptions = {
  DRDS: ["Scientist 'B'", "Scientist 'C'", "Scientist 'D'"],
  DRTC: ["Technical Officer 'A'", "Technical Officer 'B'"],
  Admin: ["Admin Officer", "Store Officer"],
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
    personalDetails: {
      name: "",
      dob: "",
      mobile: "",
      address: "",
    },
    professionalDetails: {
      designation: "",
      cadre: "",
      intercom: "",
      internetEmail: "",
      dronaEmail: "",
      pis: "",
      aebasId: "",
    },
    about: "",
    employmentPeriod: {
      from: "",
      to: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};

    if (!formData.email) {
      errs.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errs.email = "Invalid email address.";
    }

    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (!formData.personalDetails.name.trim()) {
      errs.name = "Name is required.";
    }

    // Mobile number optional but if present validate format
    if (formData.personalDetails.mobile) {
      if (!/^\d{10}$/.test(formData.personalDetails.mobile)) {
        errs.mobile = "Mobile number must be 10 digits.";
      }
    }

    // Cadre and designation
    if (formData.professionalDetails.cadre) {
      if (
        formData.professionalDetails.cadre !== "Other" &&
        !formData.professionalDetails.designation
      ) {
        errs.designation = "Designation is required.";
      }
      if (
        formData.professionalDetails.cadre === "Other" &&
        !formData.professionalDetails.designation.trim()
      ) {
        errs.designation = "Designation is required.";
      }
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCadreChange = (e) => {
    const cadre = e.target.value;
    setFormData((prev) => ({
      ...prev,
      professionalDetails: {
        ...prev.professionalDetails,
        cadre,
        designation: "",
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        about: formData.about,
        personalDetails: formData.personalDetails,
        professionalDetails: formData.professionalDetails,
        employmentPeriod: formData.employmentPeriod,
      };

      await axios.post(`${apiUrl}/api/auth/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("User saved successfully!");
      setFormData({
        email: "",
        password: "",
        role: "employee",
        personalDetails: {
          name: "",
          dob: "",
          mobile: "",
          address: "",
        },
        professionalDetails: {
          designation: "",
          cadre: "",
          intercom: "",
          internetEmail: "",
          dronaEmail: "",
          pis: "",
          aebasId: "",
        },
        about: "",
        employmentPeriod: {
          from: "",
          to: "",
        },
      });
      setErrors({});
    } catch (error) {
      if (error.response?.data?.error === "User already exists") {
        setErrors({ email: "Email ID is already registered." });
      } else {
        alert(error?.response?.data?.error || "Failed to save user.");
      }
    }
  };

  return (
    <div className="mt-14 min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-lg p-8 space-y-8"
        noValidate
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 text-center">
          Register New User
        </h2>

        {/* Email & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(e, null, "email")}
              required
              placeholder="user@example.com"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 mt-1 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange(e, null, "password")}
              required
              placeholder="••••••••"
              className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-300"
              }`}
            />

            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 mt-6 right-3 flex items-center justify-center text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              {showPassword ? (
                <HiEyeOff className="h-5 w-5" />
              ) : (
                <HiEye className="h-5 w-5" />
              )}
            </span>

            {errors.password && (
              <p className="text-red-600 mt-1 text-sm">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange(e, null, "role")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          >
            <option value="employee">Employee</option>
            {/* <option value="admin">Admin</option> */}
            <option value="director">Director</option>
            <option value="associate_director">Associate Director</option>
            <option value="pending_director">Pending Director</option>
          </select>
        </div>

        {/* Personal Details */}
        <fieldset className="border border-gray-200 rounded-lg bg-blue-50 p-6">
          <legend className="text-lg font-semibold text-gray-800 px-2">
            Personal Details
          </legend>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.personalDetails.name}
                onChange={(e) => handleChange(e, "personalDetails", "name")}
                required
                placeholder="Full Name"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.name
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-indigo-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-600 mt-1 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.personalDetails.dob}
                onChange={(e) => handleChange(e, "personalDetails", "dob")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Mobile No.
              </label>
              <input
                type="tel"
                value={formData.personalDetails.mobile}
                onChange={(e) => handleChange(e, "personalDetails", "mobile")}
                placeholder="1234567890"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.mobile
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-indigo-300"
                }`}
              />
              {errors.mobile && (
                <p className="text-red-600 mt-1 text-sm">{errors.mobile}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                value={formData.personalDetails.address}
                onChange={(e) => handleChange(e, "personalDetails", "address")}
                rows={3}
                placeholder="Street, City, State, ZIP"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Professional Details */}
        <fieldset className="border border-gray-200 rounded-lg bg-blue-50 p-6">
          <legend className="text-lg font-semibold text-gray-800 px-2">
            Professional Details
          </legend>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Cadre
              </label>
              <select
                value={formData.professionalDetails.cadre}
                onChange={handleCadreChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              >
                <option value="">Select Cadre</option>
                <option value="DRDS">DRDS</option>
                <option value="DRTC">DRTC</option>
                <option value="Admin">Admin</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.professionalDetails.cadre &&
              designationOptions[formData.professionalDetails.cadre] && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <select
                    value={formData.professionalDetails.designation}
                    onChange={(e) =>
                      handleChange(e, "professionalDetails", "designation")
                    }
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.designation
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-indigo-300"
                    }`}
                  >
                    <option value="">Select Designation</option>
                    {designationOptions[formData.professionalDetails.cadre].map(
                      (desig) => (
                        <option key={desig} value={desig}>
                          {desig}
                        </option>
                      )
                    )}
                  </select>
                  {errors.designation && (
                    <p className="text-red-600 mt-1 text-sm">
                      {errors.designation}
                    </p>
                  )}
                </div>
              )}

            {formData.professionalDetails.cadre === "Other" && (
              <div className="md:col-span-3">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.professionalDetails.designation}
                  onChange={(e) =>
                    handleChange(e, "professionalDetails", "designation")
                  }
                  placeholder="Enter Designation"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.designation
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-indigo-300"
                  }`}
                />
                {errors.designation && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.designation}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Intercom
              </label>
              <input
                type="text"
                value={formData.professionalDetails.intercom}
                onChange={(e) =>
                  handleChange(e, "professionalDetails", "intercom")
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Internet Email
              </label>
              <input
                type="email"
                value={formData.professionalDetails.internetEmail}
                onChange={(e) =>
                  handleChange(e, "professionalDetails", "internetEmail")
                }
                placeholder="internet@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                DRONA Email
              </label>
              <input
                type="email"
                value={formData.professionalDetails.dronaEmail}
                onChange={(e) =>
                  handleChange(e, "professionalDetails", "dronaEmail")
                }
                placeholder="drona@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                PIS
              </label>
              <input
                type="text"
                value={formData.professionalDetails.pis}
                onChange={(e) => handleChange(e, "professionalDetails", "pis")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Aebas ID
              </label>
              <input
                type="text"
                value={formData.professionalDetails.aebasId}
                onChange={(e) =>
                  handleChange(e, "professionalDetails", "aebasId")
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>
          </div>
        </fieldset>

        {/* About */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            About
          </label>
          <textarea
            value={formData.about}
            onChange={(e) => handleChange(e, null, "about")}
            rows={3}
            placeholder="Short bio or description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
          />
        </div>

        {/* Employment Period */}
        <fieldset className="border border-gray-200 rounded-lg bg-gray-50 p-6">
          <legend className="text-lg font-semibold text-gray-800 px-2">
            Employment Period
          </legend>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                From
              </label>
              <input
                type="date"
                value={formData.employmentPeriod.from}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employmentPeriod: {
                      ...prev.employmentPeriod,
                      from: e.target.value,
                    },
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                To
              </label>
              <input
                type="date"
                value={formData.employmentPeriod.to}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employmentPeriod: {
                      ...prev.employmentPeriod,
                      to: e.target.value,
                    },
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full py-3 text-white bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
