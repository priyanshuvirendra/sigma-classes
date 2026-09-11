import { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    Save,
    X,
    RefreshCw,
    Eye,
    EyeOff,
} from "lucide-react";

function AdminCourses() {
    const emptyForm = {
        name: "",
        description: "",
        category: "",
        duration: "",
        price: "",
        imageUrl: "",
        active: true,
        startDate: "",
        mode: "",
        timing: "",
        curriculum: [""],
        faculty: [""],
        features: [""],
        tags: [""],
    };

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [editingCourse, setEditingCourse] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const token = localStorage.getItem("adminToken");

    // =========================================================
    // FETCH COURSES
    // =========================================================

    const fetchCourses = async () => {
        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            setError("Admin session expired.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/admin/courses",
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                setError("You are not authorized.");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch courses."
                );
            }

            const data = await response.json();

            setCourses(data);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to load courses."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchCourses();
    }, []);

    // =========================================================
    // FORM HELPERS
    // =========================================================

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateArrayField = (
        field,
        index,
        value
    ) => {
        setForm((prev) => {
            const updated = [...prev[field]];

            updated[index] = value;

            return {
                ...prev,
                [field]: updated,
            };
        });
    };

    const addArrayItem = (field) => {
        setForm((prev) => ({
            ...prev,
            [field]: [
                ...prev[field],
                "",
            ],
        }));
    };

    const removeArrayItem = (
        field,
        index
    ) => {
        setForm((prev) => {
            const updated = prev[field].filter(
                (_, i) => i !== index
            );

            return {
                ...prev,
                [field]:
                    updated.length > 0
                        ? updated
                        : [""],
            };
        });
    };

    // =========================================================
    // NEW COURSE
    // =========================================================

    const startNewCourse = () => {
        setEditingCourse(null);

        setForm({
            ...emptyForm,
            curriculum: [""],
            faculty: [""],
            features: [""],
            tags: [""],
        });

        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // EDIT COURSE
    // =========================================================

    const editCourse = (course) => {
        setEditingCourse(course);

        setForm({
            name: course.name || "",
            description:
                course.description || "",
            category:
                course.category || "",
            duration:
                course.duration || "",
            price:
                course.price ?? "",
            imageUrl:
                course.imageUrl || "",
            active:
                course.active ?? true,
startDate:
  course.startDate || "",

mode:
  course.mode || "",

timing:
  course.timing || "",

curriculum:
                course.curriculum?.length
                    ? course.curriculum
                    : [""],

            faculty:
                course.faculty?.length
                    ? course.faculty
                    : [""],

            features:
                course.features?.length
                    ? course.features
                    : [""],

            tags:
                course.tags?.length
                    ? course.tags
                    : [""],
        });

        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // CANCEL EDIT
    // =========================================================

    const cancelEdit = () => {
        setEditingCourse(null);

        setForm({
            ...emptyForm,
            curriculum: [""],
            faculty: [""],
            features: [""],
            tags: [""],
        });

        setError("");
    };

    // =========================================================
    // CLEAN ARRAY
    // =========================================================

    const cleanArray = (array) => {
        return array
            .map((item) => item.trim())
            .filter(Boolean);
    };

    // =========================================================
    // SAVE COURSE
    // =========================================================

    const saveCourse = async (event) => {
        event.preventDefault();

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            setError("Admin session expired.");
            return;
        }

        if (!form.name.trim()) {
            setError("Course name is required.");
            return;
        }

        if (!form.category.trim()) {
            setError("Category is required.");
            return;
        }

        if (!form.description.trim()) {
            setError(
                "Course description is required."
            );
            return;
        }

        if (
            form.price === "" ||
            Number(form.price) < 0
        ) {
            setError(
                "Please enter a valid course price."
            );
            return;
        }

        const payload = {
            name: form.name.trim(),

            description:
                form.description.trim(),

            category:
                form.category.trim(),

            duration:
                form.duration.trim(),

            price:
                Number(form.price),

            imageUrl:
                form.imageUrl.trim(),

            active:
                Boolean(form.active),

            startDate:
                form.startDate || null,
mode:
  form.mode.trim(),

timing:
  form.timing.trim(),

curriculum:
  cleanArray(form.curriculum),

            faculty:
                cleanArray(form.faculty),

            features:
                cleanArray(form.features),

            tags:
                cleanArray(form.tags),
        };

        try {
            setSaving(true);
            setError("");

            const url = editingCourse
                ? `https://sigma-classes-backend-ajkh.onrender.com/api/admin/courses/${editingCourse.id}`
                : "https://sigma-classes-backend-ajkh.onrender.com/api/admin/courses";

            const response = await fetch(url, {
                method: editingCourse
                    ? "PUT"
                    : "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${currentToken}`,
                },

                body: JSON.stringify(payload),
            });

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                setError(
                    "You are not authorized."
                );

                return;
            }

            if (!response.ok) {
                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to save course."
                );
            }

            await response.json();

            await fetchCourses();

            cancelEdit();
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to save course."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE COURSE
    // =========================================================

    const deleteCourse = async (id) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this course?"
            );

        if (!confirmed) {
            return;
        }

        const currentToken =
            localStorage.getItem("adminToken");

        try {
            setError("");

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/courses/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                setError(
                    "You are not authorized."
                );

                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to delete course."
                );
            }

            setCourses((prev) =>
                prev.filter(
                    (course) =>
                        course.id !== id
                )
            );

            if (
                editingCourse?.id === id
            ) {
                cancelEdit();
            }
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to delete course."
            );
        }
    };

    // =========================================================
    // RENDER ARRAY FIELD
    // =========================================================

    const renderArrayField = (
        field,
        label,
        placeholder
    ) => {
        return (
            <div className="admin-course-array">
                <div className="admin-course-array-header">
                    <label>{label}</label>

                    <button
                        type="button"
                        className="admin-refresh"
                        onClick={() =>
                            addArrayItem(field)
                        }
                    >
                        <Plus size={15} />
                        Add
                    </button>
                </div>

                <div className="admin-course-array-list">
                    {form[field].map(
                        (item, index) => (
                            <div
                                className="admin-course-array-row"
                                key={`${field}-${index}`}
                            >
                                <input
                                    type="text"
                                    value={item}
                                    placeholder={
                                        placeholder
                                    }
                                    onChange={(event) =>
                                        updateArrayField(
                                            field,
                                            index,
                                            event.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="admin-delete"
                                    onClick={() =>
                                        removeArrayItem(
                                            field,
                                            index
                                        )
                                    }
                                    aria-label={`Remove ${label}`}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <section className="admin-results">

            {/* =====================================================
          COURSE FORM
      ===================================================== */}

            <div className="admin-table-card">

                <div className="admin-table-header">

                    <div>
                        <span className="section-label">
                            COURSES
                        </span>

                        <h2>
                            {editingCourse
                                ? "Edit Course"
                                : "Add Course"}
                        </h2>

                        <p>
                            Create and manage courses
                            displayed on Sigma Classes.
                        </p>
                    </div>

                    <div className="admin-header-actions">

                        <button
                            type="button"
                            className="admin-refresh"
                            onClick={startNewCourse}
                        >
                            <Plus size={17} />
                            New Course
                        </button>

                        <button
                            type="button"
                            className="admin-refresh"
                            onClick={fetchCourses}
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>

                    </div>

                </div>

                {error && (
                    <div className="admin-empty">
                        {error}
                    </div>
                )}

                <form
                    className="admin-result-form"
                    onSubmit={saveCourse}
                >

                    {/* =================================================
              BASIC INFORMATION
          ================================================= */}

                    <div className="admin-course-section">

                        <span className="section-label">
                            BASIC INFORMATION
                        </span>

                        <div className="admin-form-grid">

                            <div className="admin-form-field">
                                <label>
                                    Course Name *
                                </label>

                                <input
                                    type="text"
                                    value={form.name}
                                    placeholder="SSC CGL Complete Course"
                                    onChange={(event) =>
                                        updateField(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="admin-form-field">
                                <label>
                                    Category *
                                </label>

                                <input
                                    type="text"
                                    value={form.category}
                                    placeholder="SSC"
                                    onChange={(event) =>
                                        updateField(
                                            "category",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="admin-form-field">
                                <label>
                                    Duration
                                </label>

                                <input
                                    type="text"
                                    value={form.duration}
                                    placeholder="12 Months"
                                    onChange={(event) =>
                                        updateField(
                                            "duration",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="admin-form-field">
                                <label>
                                    Price *
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    placeholder="9999"
                                    onChange={(event) =>
                                        updateField(
                                            "price",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="admin-form-field">
                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(event) =>
                                        updateField(
                                            "startDate",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="admin-form-field">
                                <label>
                                    Mode
                                </label>

                                <input
                                    type="text"
                                    value={form.mode}
                                    placeholder="Online / Offline / Hybrid"
                                    onChange={(event) =>
                                        updateField(
                                            "mode",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                            
                            <div className="admin-form-field">
  <label>
    Class Timing
  </label>

  <input
    type="text"
    value={form.timing}
    placeholder="Morning — 7:00 AM to 9:00 AM"
    onChange={(event) =>
      updateField(
        "timing",
        event.target.value
      )
    }
  />
</div>
                            <div className="admin-form-field admin-form-full">
                                <label>
                                    Image URL
                                </label>

                                <input
                                    type="url"
                                    value={form.imageUrl}
                                    placeholder="https://example.com/course.jpg"
                                    onChange={(event) =>
                                        updateField(
                                            "imageUrl",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="admin-form-field admin-form-full">
                                <label>
                                    Description *
                                </label>

                                <textarea
                                    rows="5"
                                    value={form.description}
                                    placeholder="Describe the course..."
                                    onChange={(event) =>
                                        updateField(
                                            "description",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>

                    </div>

                    {/* =================================================
              COURSE CONTENT
          ================================================= */}

                    <div className="admin-course-section">

                        <span className="section-label">
                            COURSE CONTENT
                        </span>

                        {renderArrayField(
                            "curriculum",
                            "Curriculum",
                            "e.g. Quantitative Aptitude"
                        )}

                        {renderArrayField(
                            "faculty",
                            "Faculty",
                            "e.g. Rahul Sharma"
                        )}

                        {renderArrayField(
                            "features",
                            "Features",
                            "e.g. Live Classes"
                        )}

                        {renderArrayField(
                            "tags",
                            "Tags",
                            "e.g. SSC CGL"
                        )}

                    </div>

                    {/* =================================================
              STATUS
          ================================================= */}

                    <div className="admin-course-status">

                        <div>
                            {form.active ? (
                                <Eye size={18} />
                            ) : (
                                <EyeOff size={18} />
                            )}

                            <div>
                                <strong>
                                    Course Visibility
                                </strong>

                                <span>
                                    {form.active
                                        ? "This course is visible."
                                        : "This course is hidden."}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={
                                form.active
                                    ? "admin-status-active"
                                    : "admin-status-inactive"
                            }
                            onClick={() =>
                                updateField(
                                    "active",
                                    !form.active
                                )
                            }
                        >
                            {form.active
                                ? "Active"
                                : "Inactive"}
                        </button>

                    </div>

                    {/* =================================================
              FORM ACTIONS
          ================================================= */}

                    <div className="admin-course-actions">

                        {editingCourse && (
                            <button
                                type="button"
                                className="admin-refresh"
                                onClick={cancelEdit}
                            >
                                <X size={17} />
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            className="admin-save"
                            disabled={saving}
                        >
                            <Save size={17} />

                            {saving
                                ? "Saving..."
                                : editingCourse
                                    ? "Update Course"
                                    : "Create Course"}
                        </button>

                    </div>

                </form>

            </div>


            {/* =====================================================
          COURSE LIST
      ===================================================== */}

            <div className="admin-table-card">

                <div className="admin-table-header">

                    <div>
                        <span className="section-label">
                            COURSE LIBRARY
                        </span>

                        <h2>
                            All Courses
                        </h2>

                        <p>
                            {courses.length} course
                            {courses.length !== 1
                                ? "s"
                                : ""}{" "}
                            in the database.
                        </p>
                    </div>

                </div>


                {loading ? (
                    <div className="admin-empty">
                        Loading courses...
                    </div>
                ) : courses.length === 0 ? (
                    <div className="admin-empty">
                        No courses found.
                    </div>
                ) : (
                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Course</th>
                                    <th>Category</th>
                                    <th>Duration</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {courses.map(
                                    (course) => (
                                        <tr
                                            key={course.id}
                                        >

                                            <td>
                                                #{course.id}
                                            </td>

                                            <td>
                                                <strong>
                                                    {course.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {course.category ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {course.duration ||
                                                    "—"}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    course.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        course.active
                                                            ? "admin-status-active"
                                                            : "admin-status-inactive"
                                                    }
                                                >
                                                    {course.active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td>

                                                <div className="admin-course-row-actions">

                                                    <button
                                                        type="button"
                                                        className="admin-edit"
                                                        onClick={() =>
                                                            editCourse(
                                                                course
                                                            )
                                                        }
                                                        title="Edit course"
                                                    >
                                                        <Pencil
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-delete"
                                                        onClick={() =>
                                                            deleteCourse(
                                                                course.id
                                                            )
                                                        }
                                                        title="Delete course"
                                                    >
                                                        <Trash2
                                                            size={16}
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </section>
    );
}

export default AdminCourses;