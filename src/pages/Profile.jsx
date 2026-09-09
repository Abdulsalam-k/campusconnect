import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

function Profile() {
  const { user, token, login } = useAuth();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    education: "",
    department: "",
    location: "",
    bio: "",
    skills: "",
  });

  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] =
    useState(null);
  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [removingImage, setRemovingImage] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  // ==========================================
  // LOAD USER DATA
  // ==========================================

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load your profile."
          );
        }

        const currentUser = result.data;

        setFormData({
          name: currentUser.name || "",
          education:
            currentUser.education || "",
          department:
            currentUser.department || "",
          location:
            currentUser.location || "",
          bio: currentUser.bio || "",
          skills: Array.isArray(
            currentUser.skills
          )
            ? currentUser.skills.join(", ")
            : "",
        });

        setProfileImage(
          currentUser.profileImage || ""
        );

        setImagePreview(
          currentUser.profileImage || ""
        );

        login(currentUser, token);
      } catch (error) {
        console.error(
          "Loading profile error:",
          error.message
        );

        setError(
          error.message ||
            "Failed to load your profile."
        );

        // Fallback to locally stored user.
        if (user) {
          setFormData({
            name: user.name || "",
            education:
              user.education || "",
            department:
              user.department || "",
            location:
              user.location || "",
            bio: user.bio || "",
            skills: Array.isArray(
              user.skills
            )
              ? user.skills.join(", ")
              : "",
          });

          setProfileImage(
            user.profileImage || ""
          );

          setImagePreview(
            user.profileImage || ""
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  // ==========================================
  // CLEAN TEMPORARY PREVIEW
  // ==========================================

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

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
  // HANDLE TEXT INPUT
  // ==========================================

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // ==========================================
  // HANDLE IMAGE SELECTION
  // ==========================================

  function handleImageChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, PNG or WebP image."
      );

      setSelectedImage(null);
      event.target.value = "";

      scrollToTop();
      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setError(
        "Profile image must not exceed 2MB."
      );

      setSelectedImage(null);
      event.target.value = "";

      scrollToTop();
      return;
    }

    // Remove previous temporary preview URL.
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(previewUrl);

    setError("");
    setSuccess("");
  }

  // ==========================================
  // VALIDATE PROFILE
  // ==========================================

  function validateProfile() {
    const name =
      formData.name.trim();

    const education =
      formData.education.trim();

    const department =
      formData.department.trim();

    const location =
      formData.location.trim();

    const bio =
      formData.bio.trim();

    const skills =
      formData.skills
        .split(",")
        .map((skill) =>
          skill.trim()
        )
        .filter(Boolean);

    if (!name) {
      return "Name is required.";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters.";
    }

    if (education.length > 150) {
      return "Education must not exceed 150 characters.";
    }

    if (department.length > 150) {
      return "Department must not exceed 150 characters.";
    }

    if (location.length > 100) {
      return "Location must not exceed 100 characters.";
    }

    if (bio.length > 1000) {
      return "Bio must not exceed 1000 characters.";
    }

    if (skills.length > 20) {
      return "You can add a maximum of 20 skills.";
    }

    return "";
  }

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateProfile();

    if (validationError) {
      setError(validationError);
      scrollToTop();
      return;
    }

    if (!token) {
      setError(
        "You are not authenticated. Please log in again."
      );

      scrollToTop();
      return;
    }

    try {
      setSaving(true);

      const skillsArray =
        formData.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean);

      const profileFormData =
        new FormData();

      profileFormData.append(
        "name",
        formData.name.trim()
      );

      profileFormData.append(
        "education",
        formData.education.trim()
      );

      profileFormData.append(
        "department",
        formData.department.trim()
      );

      profileFormData.append(
        "location",
        formData.location.trim()
      );

      profileFormData.append(
        "bio",
        formData.bio.trim()
      );

      skillsArray.forEach(
        (skill) => {
          profileFormData.append(
            "skills",
            skill
          );
        }
      );

      if (selectedImage) {
        profileFormData.append(
          "profileImage",
          selectedImage,
          selectedImage.name
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/auth/profile`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: profileFormData,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update profile."
        );
      }

      // Update AuthContext and localStorage.
      login(
        result.data,
        token
      );

      setProfileImage(
        result.data.profileImage || ""
      );

      setImagePreview(
        result.data.profileImage || ""
      );

      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      setSuccess(
        result.message ||
          "Your profile has been updated successfully."
      );

      scrollToTop();
    } catch (error) {
      console.error(
        "Profile update error:",
        error.message
      );

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

      scrollToTop();
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // REMOVE PROFILE IMAGE
  // ==========================================

  async function handleRemoveImage() {
    if (!token) {
      setError(
        "You are not authenticated. Please log in again."
      );

      scrollToTop();
      return;
    }

    if (!profileImage) {
      setError(
        "You do not have a profile photo to remove."
      );

      scrollToTop();
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to remove your profile photo?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingImage(true);

      setError("");
      setSuccess("");

      const response =
        await fetch(
          `${API_URL}/api/auth/profile-image`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to remove profile photo."
        );
      }

      const updatedUser = {
        ...user,
        profileImage: "",
      };

      login(
        updatedUser,
        token
      );

      setProfileImage("");
      setImagePreview("");
      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      setSuccess(
        result.message ||
          "Profile photo removed successfully."
      );

      scrollToTop();
    } catch (error) {
      console.error(
        "Remove profile image error:",
        error.message
      );

      setError(
        error.message ||
          "Failed to remove profile photo."
      );

      scrollToTop();
    } finally {
      setRemovingImage(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-header">

          <p className="page-label">
            MY PROFILE
          </p>

          <h1>
            Loading your profile...
          </h1>

        </div>
      </div>
    );
  }

  // ==========================================
  // ROLE LABEL
  // ==========================================

  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "recruiter"
      ? "Recruiter"
      : "Student";

  // ==========================================
  // SKILLS
  // ==========================================

  const skills =
    formData.skills
      .split(",")
      .map((skill) =>
        skill.trim()
      )
      .filter(Boolean);

  // ==========================================
  // PROFILE INITIAL
  // ==========================================

  const profileInitial =
    formData.name
      ? formData.name
          .charAt(0)
          .toUpperCase()
      : "U";

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-header">

        <p className="page-label">
          MY PROFILE
        </p>

        <h1>
          Manage your profile
        </h1>

        <p>
          Keep your CampusConnect profile updated so
          people can learn more about you.
        </p>

      </div>

      {/* PROFILE LAYOUT */}

      <div className="profile-layout">

        {/* PROFILE FORM */}

        <section className="profile-form-card">

          <div className="profile-section-heading">

            <h2>
              Personal Information
            </h2>

            <p>
              Update the information shown on your
              CampusConnect profile.
            </p>

          </div>

          {/* PROFILE IMAGE */}

          <div className="profile-image-upload-section">

            <div className="profile-image-preview">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={`${formData.name || "User"} profile`}
                  onError={() => {
                    setImagePreview("");
                  }}
                />
              ) : (
                <span>
                  {profileInitial}
                </span>
              )}

            </div>

            <div className="profile-image-upload-content">

              <h3>
                Profile photo
              </h3>

              <p>
                Add a professional photo so people
                can recognize you on CampusConnect.
              </p>

              <div className="profile-image-actions">

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="profile-image-file-input"
                  id="profileImage"
                />

                <label
                  htmlFor="profileImage"
                  className="profile-image-select-button"
                >
                  Choose photo
                </label>

                {profileImage && (
                  <button
                    type="button"
                    className="profile-image-remove-button"
                    onClick={
                      handleRemoveImage
                    }
                    disabled={
                      removingImage ||
                      saving
                    }
                  >
                    {removingImage
                      ? "Removing..."
                      : "Remove photo"}
                  </button>
                )}

              </div>

              <small>
                JPG, PNG or WebP · Maximum 2MB
              </small>

            </div>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                maxLength="100"
                required
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={
                  user?.email || ""
                }
                disabled
              />

              <small>
                Your email address cannot be changed
                here.
              </small>

            </div>

            {/* ROLE */}

            <div className="form-group">

              <label htmlFor="role">
                Account Role
              </label>

              <input
                id="role"
                type="text"
                value={roleLabel}
                disabled
              />

              <small>
                Your account role is managed by
                CampusConnect.
              </small>

            </div>

            {/* DEPARTMENT */}

            <div className="form-group">

              <label htmlFor="department">
                Department
              </label>

              <input
                id="department"
                name="department"
                type="text"
                value={
                  formData.department
                }
                onChange={handleChange}
                placeholder="e.g. Information Technology"
                maxLength="150"
              />

            </div>

            {/* EDUCATION */}

            <div className="form-group">

              <label htmlFor="education">
                Education
              </label>

              <input
                id="education"
                name="education"
                type="text"
                value={
                  formData.education
                }
                onChange={handleChange}
                placeholder="e.g. B.Tech Information Technology"
                maxLength="150"
              />

            </div>

            {/* LOCATION */}

            <div className="form-group">

              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={
                  formData.location
                }
                onChange={handleChange}
                placeholder="e.g. Akure, Nigeria"
                maxLength="100"
              />

            </div>

            {/* SKILLS */}

            <div className="form-group">

              <label htmlFor="skills">
                Skills
              </label>

              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Node.js, MongoDB"
              />

              <small>
                Separate each skill with a comma.
              </small>

            </div>

            {/* BIO */}

            <div className="form-group">

              <label htmlFor="bio">
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                rows="6"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell people a little about yourself..."
                maxLength="1000"
              />

              <small>
                Maximum 1000 characters.
              </small>

            </div>

            {/* ERROR */}

            {error && (
              <div className="profile-message profile-message-error">

                <strong>
                  ✕
                </strong>

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="profile-message profile-message-success">

                <strong>
                  ✓
                </strong>

                <span>
                  {success}
                </span>

              </div>
            )}

            {/* SAVE */}

            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>

        </section>

        {/* PROFILE PREVIEW */}

        <aside className="profile-preview-card">

          <div className="profile-avatar profile-avatar-image">

            {imagePreview ? (
              <img
                src={imagePreview}
                alt={`${formData.name || "User"} profile`}
                onError={() => {
                  setImagePreview("");
                }}
              />
            ) : (
              profileInitial
            )}

          </div>

          <p className="profile-preview-role">
            {roleLabel}
          </p>

          <h2>
            {formData.name ||
              "Your Name"}
          </h2>

          <p className="profile-preview-email">
            {user?.email ||
              "your@email.com"}
          </p>

          {formData.education && (
            <p>
              🎓 {formData.education}
            </p>
          )}

          {formData.department && (
            <p>
              🏫 {formData.department}
            </p>
          )}

          {formData.location && (
            <p>
              📍 {formData.location}
            </p>
          )}

          {formData.bio && (
            <div className="profile-preview-bio">

              <h3>
                About
              </h3>

              <p>
                {formData.bio}
              </p>

            </div>
          )}

          {skills.length > 0 && (
            <div className="profile-preview-skills">

              <h3>
                Skills
              </h3>

              <div className="profile-skills-list">

                {skills.map(
                  (skill, index) => (
                    <span
                      className="skill-tag"
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </div>
          )}

        </aside>

      </div>
    </div>
  );
}

export default Profile;