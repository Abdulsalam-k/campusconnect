import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

function EditOpportunity() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH OPPORTUNITY
  // ==========================================

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/opportunities/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch opportunity."
          );
        }

        const opportunity = result.data;

        setFormData({
          title: opportunity.title || "",
          company: opportunity.company || "",
          description:
            opportunity.description || "",
          type:
            opportunity.type || "Internship",
          location:
            opportunity.location || "",
          mode:
            opportunity.mode || "Remote",
          category:
            opportunity.category || "",
          skills: Array.isArray(
            opportunity.skills
          )
            ? opportunity.skills.join(", ")
            : "",
          deadline:
            opportunity.deadline || "",
        });
      } catch (error) {
        console.error(
          "Fetching opportunity error:",
          error.message
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunity();
  }, [id]);

  // ==========================================
  // HANDLE INPUT
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
    const description =
      formData.description.trim();
    const location =
      formData.location.trim();
    const category =
      formData.category.trim();

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
  // SCROLL TO TOP
  // ==========================================

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================
  // SUBMIT UPDATE
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);

      scrollToTop();

      return;
    }

    try {
      setSaving(true);

      const cleanedSkills =
        formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

      const opportunityData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        description:
          formData.description.trim(),
        type: formData.type,
        location:
          formData.location.trim(),
        mode: formData.mode,
        category:
          formData.category.trim(),
        skills: cleanedSkills,
        deadline: formData.deadline,
      };

      const response = await fetch(
        `${API_URL}/api/opportunities/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            opportunityData
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update opportunity."
        );
      }

      setSuccess(
        "Opportunity updated successfully!"
      );

      /*
        Return the user to the top of the page
        so the success message is immediately visible.
      */

      scrollToTop();

      /*
        Give the user enough time to clearly see
        the success message before redirecting.
      */

      setTimeout(() => {
        navigate(
          "/recruiter-dashboard"
        );
      }, 3000);
    } catch (error) {
      console.error(
        "Updating opportunity error:",
        error.message
      );

      setError(
        error.message ||
          "Something went wrong."
      );

      scrollToTop();
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="opportunity-form-page">
        <div className="opportunity-form-container">

          <div className="dashboard-loading">
            <h2>
              Loading opportunity...
            </h2>

            <p>
              Please wait while we retrieve
              the opportunity details.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // FETCH ERROR
  // ==========================================

  if (
    error &&
    !formData.title
  ) {
    return (
      <div className="opportunity-form-page">
        <div className="opportunity-form-container">

          <div className="dashboard-error">
            <h2>
              Edit Opportunity
            </h2>

            <p>{error}</p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  "/recruiter-dashboard"
                )
              }
            >
              Back to Dashboard
            </button>
          </div>

        </div>
      </div>
    );
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

          <h1>
            Edit Opportunity
          </h1>

          <p>
            Update the details of your
            CampusConnect opportunity.
          </p>
        </div>

        {/* ======================================
            ALERTS
        ======================================= */}

        {error && (
          <div className="form-alert form-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="form-alert form-alert-success">
            <strong>
              ✓ {success}
            </strong>
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
              <h2>
                Basic Information
              </h2>

              <p>
                Update the main information
                about this opportunity.
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
                placeholder="Describe the opportunity..."
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
              <h2>
                Opportunity Details
              </h2>

              <p>
                Keep the opportunity
                information accurate and up
                to date.
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
                Separate each skill with a
                comma.
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
                navigate(
                  "/recruiter-dashboard"
                )
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditOpportunity;