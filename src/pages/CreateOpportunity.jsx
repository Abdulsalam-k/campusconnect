import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CreateOpportunity() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    type: "Internship",
    location: "",
    mode: "Remote",
    category: "",
    skills: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  function validateForm() {
    const title = formData.title.trim();
    const company = formData.company.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();
    const category = formData.category.trim();

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (!title) {
      return "Opportunity title is required.";
    }

    if (title.length < 3) {
      return "Opportunity title must be at least 3 characters.";
    }

    if (!company) {
      return "Company name is required.";
    }

    if (company.length < 2) {
      return "Company name must be at least 2 characters.";
    }

    if (!description) {
      return "Opportunity description is required.";
    }

    if (description.length < 30) {
      return "Description must be at least 30 characters.";
    }

    if (!category) {
      return "Category is required.";
    }

    if (!location) {
      return "Location is required.";
    }

    if (!formData.deadline) {
      return "Application deadline is required.";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDeadline = new Date(
      `${formData.deadline}T00:00:00`
    );

    if (selectedDeadline < today) {
      return "Application deadline cannot be in the past.";
    }

    if (skills.length === 0) {
      return "Please provide at least one required skill.";
    }

    return "";
  }

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const cleanedSkills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const opportunityData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description.trim(),
        type: formData.type,
        location: formData.location.trim(),
        mode: formData.mode,
        category: formData.category.trim(),
        skills: cleanedSkills,
        deadline: formData.deadline,
      };

      const response = await fetch(
        "http://localhost:5000/api/opportunities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(opportunityData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create opportunity."
        );
      }

      setSuccess(
        "Opportunity created successfully!"
      );

      setFormData({
        title: "",
        company: "",
        description: "",
        type: "Internship",
        location: "",
        mode: "Remote",
        category: "",
        skills: "",
        deadline: "",
      });

      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1000);
    } catch (error) {
      console.error(
        "Creating opportunity error:",
        error.message
      );

      setError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="opportunity-form-page">
      <div className="opportunity-form-container">

        {/* ======================================
            HEADER
        ======================================= */}

        <div className="opportunity-form-header">
          <p className="form-eyebrow">
            RECRUITER PORTAL
          </p>

          <h1>Create Opportunity</h1>

          <p>
            Publish a new opportunity and connect
            with talented students on CampusConnect.
          </p>
        </div>

        {/* ======================================
            MESSAGES
        ======================================= */}

        {error && (
          <div className="form-alert form-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="form-alert form-alert-success">
            {success}
          </div>
        )}

        {/* ======================================
            FORM
        ======================================= */}

        <form
          onSubmit={handleSubmit}
          className="opportunity-form"
        >

          {/* ====================================
              BASIC INFORMATION
          ===================================== */}

          <div className="form-section">

            <div className="form-section-heading">
              <h2>Basic Information</h2>

              <p>
                Tell students about the opportunity.
              </p>
            </div>

            <div className="form-grid">

              {/* TITLE */}

              <div className="form-field form-field-full">
                <label htmlFor="title">
                  Opportunity Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer Intern"
                  required
                />
              </div>

              {/* COMPANY */}

              <div className="form-field">
                <label htmlFor="company">
                  Company
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. TechNova Africa"
                  required
                />
              </div>

              {/* CATEGORY */}

              <div className="form-field">
                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Technology"
                  required
                />
              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="form-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, requirements and what the candidate will gain..."
                rows="7"
                required
              />

              <small>
                Minimum 30 characters.
              </small>
            </div>

          </div>

          {/* ====================================
              OPPORTUNITY DETAILS
          ===================================== */}

          <div className="form-section">

            <div className="form-section-heading">
              <h2>Opportunity Details</h2>

              <p>
                Provide the key details students
                need to know.
              </p>
            </div>

            <div className="form-grid">

              {/* TYPE */}

              <div className="form-field">
                <label htmlFor="type">
                  Opportunity Type
                </label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>
                </select>
              </div>

              {/* MODE */}

              <div className="form-field">
                <label htmlFor="mode">
                  Work Mode
                </label>

                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  required
                >
                  <option value="Remote">
                    Remote
                  </option>

                  <option value="On-site">
                    On-site
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>
                </select>
              </div>

              {/* LOCATION */}

              <div className="form-field">
                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lagos"
                  required
                />
              </div>

              {/* DEADLINE */}

              <div className="form-field">
                <label htmlFor="deadline">
                  Application Deadline
                </label>

                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />
              </div>

            </div>

            {/* SKILLS */}

            <div className="form-field">
              <label htmlFor="skills">
                Required Skills
              </label>

              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, CSS, Git"
                required
              />

              <small>
                Separate each skill with a comma.
              </small>
            </div>

          </div>

          {/* ====================================
              ACTIONS
          ===================================== */}

          <div className="form-actions">

            <button
              type="button"
              className="form-cancel-button"
              onClick={() =>
                navigate("/recruiter-dashboard")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Opportunity"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateOpportunity;