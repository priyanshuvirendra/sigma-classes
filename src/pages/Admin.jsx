import { useEffect, useMemo, useState } from "react";

import {
    Users,
    UserPlus,
    Phone,
    Trash2,

    CheckCircle2,

    Award,
    RefreshCw,
    Search,
    MessageCircle,
    X,
    LogOut,
    Check,
    ClipboardList,
    Pencil,


    ListVideo,

    Save,
    BookOpen,
    FileText,

    Plus,
    ExternalLink,
    Eye,
    EyeOff,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import AdminCourses from "./AdminCourses";
import AdminFaculty from "../components/AdminFaculty";


function Admin() {

    const navigate = useNavigate();

    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    // =========================================================
    // ADMIN TABS
    // =========================================================

    const [activeTab, setActiveTab] = useState("enquiries");




    // =========================================================
    // RESULTS MANAGEMENT
    // =========================================================

    const [results, setResults] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    const [resultsLoading, setResultsLoading] = useState(false);
    const [resultsError, setResultsError] = useState("");

    const [editingResult, setEditingResult] = useState(null);

    const [resultForm, setResultForm] = useState({
        studentId: "",
        courseId: "",
        examName: "",
        examDate: "",
        marksObtained: "",
        totalMarks: "",
        rank: "",
        remarks: "",
    });


    // =========================================================
    // STUDY MATERIAL MANAGEMENT
    // =========================================================

    const [materials, setMaterials] = useState([]);
    const [materialsLoading, setMaterialsLoading] = useState(false);
    const [materialsError, setMaterialsError] = useState("");
    const [editingMaterial, setEditingMaterial] = useState(null);

    const [materialForm, setMaterialForm] = useState({
        courseId: "",
        title: "",
        description: "",
        subject: "",
        type: "PDF",
        url: "",
        published: true,
    });

    // =========================================================
    // YOUTUBE CONTENT MANAGEMENT
    // =========================================================

    const [youtubeContents, setYoutubeContents] = useState([]);
    const [youtubeLoading, setYoutubeLoading] = useState(false);
    const [youtubeError, setYoutubeError] = useState("");
    const [editingYoutubeContent, setEditingYoutubeContent] = useState(null);

    const [youtubeSearch, setYoutubeSearch] = useState("");
    const [youtubeTypeFilter, setYoutubeTypeFilter] = useState("ALL");
    const [youtubeStatusFilter, setYoutubeStatusFilter] = useState("ALL");

    const [youtubeForm, setYoutubeForm] = useState({
        type: "VIDEO",
        youtubeUrl: "",
        title: "",
        description: "",
        category: "",
        thumbnailUrl: "",
        published: true,
        displayOrder: 0,
    });

    const filteredYoutubeContents = youtubeContents.filter((content) => {
        const search = youtubeSearch.trim().toLowerCase();

        const matchesSearch =
            !search ||
            content.title?.toLowerCase().includes(search) ||
            content.description?.toLowerCase().includes(search) ||
            content.category?.toLowerCase().includes(search);

        const matchesType =
            youtubeTypeFilter === "ALL" ||
            content.type === youtubeTypeFilter;

        const matchesStatus =
            youtubeStatusFilter === "ALL" ||
            (youtubeStatusFilter === "PUBLISHED" && content.published) ||
            (youtubeStatusFilter === "DRAFT" && !content.published);

        return matchesSearch && matchesType && matchesStatus;
    });
    // =========================================================
    // ENROLLMENT MANAGEMENT
    // =========================================================

    const [enrollments, setEnrollments] = useState([]);
    const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
    const [enrollmentsError, setEnrollmentsError] = useState("");
    const [enrollmentForm, setEnrollmentForm] = useState({
    studentId: "",
    courseId: "",
    
});

    // =========================================================
    // STUDENT MANAGEMENT
    // =========================================================

    const [registeredStudents, setRegisteredStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentsError, setStudentsError] = useState("");
    const [studentSearch, setStudentSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editStudentForm, setEditStudentForm] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [studentUpdateLoading, setStudentUpdateLoading] = useState(false);
    const [studentUpdateError, setStudentUpdateError] = useState("");
    const [deleteStudentLoading, setDeleteStudentLoading] = useState(false);
    const [deleteStudentError, setDeleteStudentError] = useState("");

    /* =========================================================
       AUTH
    ========================================================= */

    const token = localStorage.getItem("adminToken");


    const logout = () => {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");

        navigate("/admin/login");
    };


    /* =========================================================
       FETCH ENQUIRIES
    ========================================================= */

    const fetchEnquiries = async () => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {

            navigate("/admin/login");

            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/enquiries",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                }
            );


            /*
             * JWT missing / expired / invalid
             */

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                logout();

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch enquiries"
                );
            }


            const data = await response.json();

            setEnquiries(data);

        } catch (error) {

            console.error(
                "Failed to load enquiries:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    /* =========================================================
       STUDY MATERIALS: FETCH ALL
    ========================================================= */

    const fetchMaterials = async () => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            setMaterialsLoading(true);
            setMaterialsError("");

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/admin/materials",
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch study materials"
                );
            }

            setMaterials(
                await response.json()
            );

        } catch (error) {

            console.error(
                "Failed to load study materials:",
                error
            );

            setMaterialsError(
                error.message ||
                "Unable to load study materials."
            );

        } finally {

            setMaterialsLoading(false);
        }
    };

    /* =========================================================
       YOUTUBE CONTENT: FETCH ALL
    ========================================================= */

    const fetchYoutubeContents = async () => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            setYoutubeLoading(true);
            setYoutubeError("");

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/admin/youtube-content",
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch YouTube content"
                );
            }

            const data = await response.json();

            setYoutubeContents(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.error(
                "Failed to load YouTube content:",
                error
            );

            setYoutubeError(
                error.message ||
                "Unable to load YouTube content."
            );

        } finally {

            setYoutubeLoading(false);
        }
    };


    /* =========================================================
       YOUTUBE CONTENT: FORM CHANGE
    ========================================================= */

    const handleYoutubeFormChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setYoutubeForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    /* =========================================================
       YOUTUBE CONTENT: RESET FORM
    ========================================================= */

    const resetYoutubeForm = () => {

        setYoutubeForm({
            type: "VIDEO",
            youtubeUrl: "",
            title: "",
            description: "",
            category: "",
            thumbnailUrl: "",
            published: true,
            displayOrder: 0,
        });

        setEditingYoutubeContent(null);
    };

    /* =========================================================
   YOUTUBE CONTENT: SAVE
========================================================= */

    const saveYoutubeContent = async (event) => {

        event.preventDefault();

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        if (!youtubeForm.type) {
            alert("Please select a content type.");
            return;
        }

        if (!youtubeForm.youtubeUrl.trim()) {
            alert("Please enter a YouTube URL.");
            return;
        }

        if (!youtubeForm.title.trim()) {
            alert("Please enter a title.");
            return;
        }

        const payload = {
            type: youtubeForm.type,
            youtubeUrl: youtubeForm.youtubeUrl.trim(),
            title: youtubeForm.title.trim(),
            description:
                youtubeForm.description.trim() || null,
            category:
                youtubeForm.category.trim() || null,
            thumbnailUrl:
                youtubeForm.thumbnailUrl.trim() || null,
            published: Boolean(youtubeForm.published),
            displayOrder:
                youtubeForm.displayOrder === ""
                    ? 0
                    : Number(youtubeForm.displayOrder),
        };

        try {

            const url = editingYoutubeContent
                ? `https://sigma-classes-backend-ajkh.onrender.com/api/admin/youtube-content/${editingYoutubeContent.id}`
                : "https://sigma-classes-backend-ajkh.onrender.com/api/admin/youtube-content";

            const method =
                editingYoutubeContent ? "PUT" : "POST";

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                logout();
                return;
            }

            const data =
                await response.json().catch(
                    () => ({})
                );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save YouTube content"
                );
            }

            if (editingYoutubeContent) {

                setYoutubeContents((current) =>
                    current.map((content) =>
                        content.id === editingYoutubeContent.id
                            ? data
                            : content
                    )
                );

                alert(
                    "YouTube content updated successfully."
                );

            } else {

                setYoutubeContents((current) => [
                    data,
                    ...current,
                ]);

                alert(
                    "YouTube content added successfully."
                );
            }

            resetYoutubeForm();

        } catch (error) {

            console.error(
                "YouTube content save failed:",
                error
            );

            alert(
                error.message ||
                "Unable to save YouTube content."
            );
        }
    };


    /* =========================================================
       YOUTUBE CONTENT: EDIT
    ========================================================= */

    const startEditingYoutubeContent = (content) => {

        setEditingYoutubeContent(content);

        setYoutubeForm({
            type: content.type || "VIDEO",
            youtubeUrl: content.youtubeUrl || "",
            title: content.title || "",
            description: content.description || "",
            category: content.category || "",
            thumbnailUrl: content.thumbnailUrl || "",
            published: Boolean(content.published),
            displayOrder: content.displayOrder ?? 0,
        });

        setActiveTab("youtube");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    /* =========================================================
       YOUTUBE CONTENT: DELETE
    ========================================================= */

    const deleteYoutubeContent = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this YouTube content?"
        );

        if (!confirmed) {
            return;
        }

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/youtube-content/${id}`,
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
                logout();
                return;
            }

            const data =
                await response.json().catch(
                    () => ({})
                );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete YouTube content"
                );
            }

            setYoutubeContents((current) =>
                current.filter(
                    (content) =>
                        content.id !== id
                )
            );

            if (
                editingYoutubeContent?.id === id
            ) {
                resetYoutubeForm();
            }

        } catch (error) {

            console.error(
                "Delete YouTube content failed:",
                error
            );

            alert(
                error.message ||
                "Unable to delete YouTube content."
            );
        }
    };

    /* =========================================================
       YOUTUBE CONTENT: PUBLISH / UNPUBLISH
    ========================================================= */

    const toggleYoutubePublished = async (content) => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        const newPublished =
            !content.published;

        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/youtube-content/${content.id}/publish`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify({
                        published: newPublished,
                    }),
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                logout();
                return;
            }

            const data =
                await response.json().catch(
                    () => ({})
                );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update published status"
                );
            }

            setYoutubeContents((current) =>
                current.map((item) =>
                    item.id === content.id
                        ? data
                        : item
                )
            );

        } catch (error) {

            console.error(
                "YouTube publish status update failed:",
                error
            );

            alert(
                error.message ||
                "Unable to update published status."
            );
        }
    };
    /* =========================================================
       STUDY MATERIALS: FORM CHANGE
    ========================================================= */

    const handleMaterialFormChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setMaterialForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    /* =========================================================
       STUDY MATERIALS: RESET FORM
    ========================================================= */

    const resetMaterialForm = () => {

        setMaterialForm({
            courseId: "",
            title: "",
            description: "",
            subject: "",
            type: "PDF",
            url: "",
            published: true,
        });

        setEditingMaterial(null);
    };


    /* =========================================================
       STUDY MATERIALS: SAVE
    ========================================================= */

    const saveMaterial = async (event) => {

        event.preventDefault();

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        if (!materialForm.courseId) {
            alert("Please select a course.");
            return;
        }

        if (!materialForm.title.trim()) {
            alert("Please enter a material title.");
            return;
        }

        if (!materialForm.type) {
            alert("Please select a material type.");
            return;
        }

        if (!materialForm.url.trim()) {
            alert("Please enter the resource URL.");
            return;
        }

        const payload = {
            courseId: Number(
                materialForm.courseId
            ),
            title:
                materialForm.title.trim(),
            description:
                materialForm.description.trim() || null,
            subject:
                materialForm.subject.trim() || null,
            type:
                materialForm.type,
            url:
                materialForm.url.trim(),
            published:
                Boolean(materialForm.published),
        };

        try {

            const url = editingMaterial
                ? `https://sigma-classes-backend-ajkh.onrender.com/api/admin/materials/${editingMaterial.id}`
                : "https://sigma-classes-backend-ajkh.onrender.com/api/admin/materials";

            const method =
                editingMaterial ? "PUT" : "POST";

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                logout();
                return;
            }

            const data =
                await response.json().catch(
                    () => ({})
                );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save study material"
                );
            }

            if (editingMaterial) {

                setMaterials((current) =>
                    current.map((material) =>
                        material.id === editingMaterial.id
                            ? data
                            : material
                    )
                );

                alert(
                    "Study material updated successfully."
                );

            } else {

                setMaterials((current) => [
                    data,
                    ...current,
                ]);

                alert(
                    "Study material added successfully."
                );
            }

            resetMaterialForm();

        } catch (error) {

            console.error(
                "Study material save failed:",
                error
            );

            alert(
                error.message ||
                "Unable to save study material."
            );
        }
    };


    /* =========================================================
       STUDY MATERIALS: EDIT
    ========================================================= */

    const startEditingMaterial = (material) => {

        setEditingMaterial(material);

        setMaterialForm({
            courseId:
                material.course?.id
                    ? String(material.course.id)
                    : "",
            title:
                material.title || "",
            description:
                material.description || "",
            subject:
                material.subject || "",
            type:
                material.type || "PDF",
            url:
                material.url || "",
            published:
                Boolean(material.published),
        });

        setActiveTab("materials");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    /* =========================================================
       STUDY MATERIALS: DELETE
    ========================================================= */

    const deleteMaterial = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this study material?"
            );

        if (!confirmDelete) {
            return;
        }

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/materials/${id}`,
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to delete study material"
                );
            }

            setMaterials((current) =>
                current.filter(
                    (material) =>
                        material.id !== id
                )
            );

            if (editingMaterial?.id === id) {
                resetMaterialForm();
            }

        } catch (error) {

            console.error(
                "Delete study material failed:",
                error
            );

            alert(
                error.message ||
                "Unable to delete study material."
            );
        }
    };


    /* =========================================================
       STUDY MATERIALS: PUBLISH / UNPUBLISH
    ========================================================= */

    const toggleMaterialPublished = async (
        material
    ) => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        const newPublished =
            !material.published;

        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/materials/${material.id}/publish`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify({
                        published:
                            newPublished,
                    }),
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                logout();
                return;
            }

            const data =
                await response.json().catch(
                    () => ({})
                );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update published status"
                );
            }

            setMaterials((current) =>
                current.map((item) =>
                    item.id === material.id
                        ? data
                        : item
                )
            );

        } catch (error) {

            console.error(
                "Publish status update failed:",
                error
            );

            alert(
                error.message ||
                "Unable to update published status."
            );
        }
    };


    /* =========================================================
       CHECK LOGIN
    ========================================================= */

    useEffect(() => {

        if (!token) {

            navigate("/admin/login");

            return;
        }
        fetchEnquiries();

    }, []);


    /* =========================================================
       UPDATE STATUS
    ========================================================= */

    const updateStatus = async (id, status) => {

        const currentToken =
            localStorage.getItem("adminToken");


        if (!currentToken) {

            logout();

            return;
        }


        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/enquiries/${id}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${currentToken}`,
                    },

                    body: JSON.stringify({
                        status,
                    }),
                }
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                logout();

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Failed to update status"
                );
            }


            const updatedEnquiry =
                await response.json();


            setEnquiries((current) =>
                current.map((enquiry) =>
                    enquiry.id === id
                        ? updatedEnquiry
                        : enquiry
                )
            );


            setSelectedEnquiry((current) =>
                current?.id === id
                    ? updatedEnquiry
                    : current
            );

        } catch (error) {

            console.error(
                "Status update failed:",
                error
            );

            alert(
                "Unable to update enquiry status."
            );
        }
    };


    /* =========================================================
       DELETE ENQUIRY
    ========================================================= */

    const deleteEnquiry = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this enquiry?"
            );


        if (!confirmDelete) return;


        const currentToken =
            localStorage.getItem("adminToken");


        if (!currentToken) {

            logout();

            return;
        }


        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/enquiries/${id}`,
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

                logout();

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Failed to delete enquiry"
                );
            }


            setEnquiries((current) =>
                current.filter(
                    (enquiry) =>
                        enquiry.id !== id
                )
            );


            setSelectedEnquiry(null);

        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );

            alert(
                "Unable to delete enquiry."
            );
        }
    };



    /* =========================================================
       ENROLLMENTS: FETCH ALL
    ========================================================= */

    const fetchEnrollments = async () => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            setEnrollmentsLoading(true);
            setEnrollmentsError("");

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/admin/enrollments",
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch enrollments"
                );
            }

            const data = await response.json();

            setEnrollments(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.error(
                "Failed to load enrollments:",
                error
            );

            setEnrollmentsError(
                error.message ||
                "Unable to load enrollments."
            );

        } finally {

            setEnrollmentsLoading(false);
        }
    };

    /* =========================================================
       STUDENTS: FETCH ALL
    ========================================================= */

    const fetchRegisteredStudents = async () => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            setStudentsLoading(true);
            setStudentsError("");

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/admin/students",
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch students"
                );
            }

            const data = await response.json();

            setRegisteredStudents(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.error(
                "Failed to load students:",
                error
            );

            setStudentsError(
                error.message ||
                "Unable to load students."
            );

        } finally {

            setStudentsLoading(false);

        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setEditStudentForm({
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
        });
        setStudentUpdateError("");
    };

    const deleteStudent = async (student) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${student.name}?`
        );

        if (!confirmed) {
            return;
        }

        const currentToken = localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {
            setDeleteStudentLoading(true);
            setDeleteStudentError("");

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/students/${student.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${currentToken}`,
                    },
                }
            );

            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete student"
                );
            }

            // Remove student from the table
            setRegisteredStudents((currentStudents) =>
                currentStudents.filter(
                    (currentStudent) =>
                        currentStudent.id !== student.id
                )
            );

            // Close student details modal
            setSelectedStudent(null);

        } catch (error) {
            console.error("Failed to delete student:", error);

            setDeleteStudentError(
                error.message || "Unable to delete student."
            );
        } finally {
            setDeleteStudentLoading(false);
        }
    };


    const updateStudent = async (event) => {
        event.preventDefault();

        const currentToken = localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {
            setStudentUpdateLoading(true);
            setStudentUpdateError("");

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/students/${editingStudent.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify(editStudentForm),
                }
            );

            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update student");
            }

            setRegisteredStudents((previousStudents) =>
                previousStudents.map((student) =>
                    student.id === data.id ? data : student
                )
            );

            setSelectedStudent((previousStudent) =>
                previousStudent?.id === data.id ? data : previousStudent
            );

            setEditingStudent(null);
        } catch (error) {
            console.error("Failed to update student:", error);
            setStudentUpdateError(
                error.message || "Unable to update student."
            );
        } finally {
            setStudentUpdateLoading(false);
        }
    };


    /* =========================================================
       ENROLLMENTS: CREATE
    ========================================================= */

    const createEnrollment = async (event) => {

        event.preventDefault();

        if (
    !enrollmentForm.studentId ||
    !enrollmentForm.courseId
) {
    alert("Please select a studentand course.");
    return;
}

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/admin/enrollments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify({
    studentId: Number(
        enrollmentForm.studentId
    ),
    courseId: Number(
        enrollmentForm.courseId
    ),
   
}),
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                logout();
                return;
            }

            const data = await response.json().catch(
                () => ({})
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create enrollment"
                );
            }

            setEnrollments((current) => [
                data,
                ...current,
            ]);

            setEnrollmentForm({
    studentId: "",
    courseId: "",
    
});

            alert(
                "Student enrolled successfully."
            );

        } catch (error) {

            console.error(
                "Enrollment creation failed:",
                error
            );

            alert(
                error.message ||
                "Unable to create enrollment."
            );
        }
    };


    /* =========================================================
       ENROLLMENTS: STATUS
    ========================================================= */

    const updateEnrollmentStatus = async (
        id,
        status
    ) => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/enrollments/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                logout();
                return;
            }

            const data = await response.json().catch(
                () => ({})
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update enrollment status"
                );
            }

            setEnrollments((current) =>
                current.map((enrollment) =>
                    enrollment.id === id
                        ? data
                        : enrollment
                )
            );

        } catch (error) {

            console.error(
                "Enrollment status update failed:",
                error
            );

            alert(
                error.message ||
                "Unable to update enrollment status."
            );

            fetchEnrollments();
        }
    };


    /* =========================================================
       ENROLLMENTS: DELETE
    ========================================================= */

    const deleteEnrollment = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this enrollment?"
            );

        if (!confirmDelete) {
            return;
        }

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/enrollments/${id}`,
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to delete enrollment"
                );
            }

            setEnrollments((current) =>
                current.filter(
                    (enrollment) =>
                        enrollment.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete enrollment failed:",
                error
            );

            alert(
                error.message ||
                "Unable to delete enrollment."
            );
        }
    };


    /* =========================================================
       ENROLLMENT FORM CHANGE
    ========================================================= */

const handleEnrollmentFormChange = (event) => {
    const { name, value } = event.target;

    setEnrollmentForm((current) => ({
    ...current,
    [name]: value,
}));
};

    /* =========================================================
       RESULTS: FETCH ALL
    ========================================================= */

    const fetchResults = async () => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            setResultsLoading(true);
            setResultsError("");

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/admin/results",
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch results"
                );
            }

            setResults(
                await response.json()
            );

        } catch (error) {

            console.error(
                "Failed to load results:",
                error
            );

            setResultsError(
                error.message ||
                "Unable to load results."
            );

        } finally {

            setResultsLoading(false);
        }
    };


    /* =========================================================
       RESULTS: FETCH STUDENTS
    ========================================================= */

    const fetchStudents = async () => {

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/admin/results/students",
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch students"
                );
            }

            setStudents(
                await response.json()
            );

        } catch (error) {

            console.error(
                "Failed to load students:",
                error
            );

            setResultsError(
                error.message ||
                "Unable to load students."
            );
        }
    };


    /* =========================================================
       RESULTS: FETCH COURSES
    ========================================================= */

    const fetchCourses = async () => {

        try {

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/courses",
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch courses"
                );
            }

            setCourses(
                await response.json()
            );

        } catch (error) {

            console.error(
                "Failed to load courses:",
                error
            );

            setResultsError(
                error.message ||
                "Unable to load courses."
            );
        }
    };


    /* =========================================================
       RESULTS: INITIAL DATA
    ========================================================= */

    useEffect(() => {

        if (!token) {
            return;
        }

        fetchResults();
        fetchStudents();
        fetchCourses();
        fetchMaterials();
        fetchEnrollments();
        fetchRegisteredStudents();
        fetchYoutubeContents();
        

    }, []);


    /* =========================================================
       RESULTS: FORM CHANGE
    ========================================================= */

    const handleResultFormChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setResultForm((current) => ({
            ...current,
            [name]: value,
        }));
    };


    /* =========================================================
       RESULTS: RESET FORM
    ========================================================= */

    const resetResultForm = () => {

        setResultForm({
            studentId: "",
            courseId: "",
            examName: "",
            examDate: "",
            marksObtained: "",
            totalMarks: "",
            rank: "",
            remarks: "",
        });

        setEditingResult(null);
    };


    /* =========================================================
       RESULTS: SAVE
    ========================================================= */

    const saveResult = async (event) => {

        event.preventDefault();

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        if (
            !resultForm.examName.trim() ||
            resultForm.marksObtained === "" ||
            resultForm.totalMarks === ""
        ) {
            alert(
                "Exam name, marks obtained and total marks are required."
            );
            return;
        }

        const marks =
            Number(resultForm.marksObtained);

        const total =
            Number(resultForm.totalMarks);

        if (
            Number.isNaN(marks) ||
            Number.isNaN(total) ||
            marks < 0 ||
            total <= 0 ||
            marks > total
        ) {
            alert(
                "Please enter valid marks. Marks obtained cannot exceed total marks."
            );
            return;
        }

        if (
            !editingResult &&
            !resultForm.studentId
        ) {
            alert("Please select a student.");
            return;
        }

        if (!resultForm.courseId) {
            alert("Please select a course.");
            return;
        }

        if (
            resultForm.rank !== "" &&
            Number(resultForm.rank) < 1
        ) {
            alert("Rank must be at least 1.");
            return;
        }

        const payload = {
            courseId: Number(
                resultForm.courseId
            ),
            examName:
                resultForm.examName.trim(),
            examDate:
                resultForm.examDate || null,
            marksObtained: marks,
            totalMarks: total,
            rank:
                resultForm.rank === ""
                    ? null
                    : Number(resultForm.rank),
            remarks:
                resultForm.remarks.trim() || null,
        };

        if (!editingResult) {
            payload.studentId =
                Number(resultForm.studentId);
        }

        try {

            const url = editingResult
                ? `https://sigma-classes-backend-ajkh.onrender.com/api/admin/results/${editingResult.id}`
                : "https://sigma-classes-backend-ajkh.onrender.com/api/admin/results";

            const method =
                editingResult ? "PUT" : "POST";

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                logout();
                return;
            }

            const data =
                await response.json().catch(
                    () => ({})
                );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save result"
                );
            }

            if (editingResult) {

                setResults((current) =>
                    current.map((result) =>
                        result.id === editingResult.id
                            ? data
                            : result
                    )
                );

                alert(
                    "Result updated successfully."
                );

            } else {

                setResults((current) => [
                    data,
                    ...current,
                ]);

                alert(
                    "Result added successfully."
                );
            }

            resetResultForm();

        } catch (error) {

            console.error(
                "Result save failed:",
                error
            );

            alert(
                error.message ||
                "Unable to save result."
            );
        }
    };


    /* =========================================================
       RESULTS: EDIT
    ========================================================= */

    const startEditingResult = (result) => {

        setEditingResult(result);

        setResultForm({
            studentId:
                result.student?.id
                    ? String(result.student.id)
                    : "",
            courseId:
                result.course?.id
                    ? String(result.course.id)
                    : "",
            examName:
                result.examName || "",
            examDate:
                result.examDate || "",
            marksObtained:
                result.marksObtained ?? "",
            totalMarks:
                result.totalMarks ?? "",
            rank:
                result.rank ?? "",
            remarks:
                result.remarks || "",
        });

        setActiveTab("results");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    /* =========================================================
       RESULTS: DELETE
    ========================================================= */

    const deleteResult = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this result?"
            );

        if (!confirmDelete) {
            return;
        }

        const currentToken =
            localStorage.getItem("adminToken");

        if (!currentToken) {
            logout();
            return;
        }

        try {

            const response = await fetch(
                `https://sigma-classes-backend-ajkh.onrender.com/api/admin/results/${id}`,
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
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to delete result"
                );
            }

            setResults((current) =>
                current.filter(
                    (result) =>
                        result.id !== id
                )
            );

            if (
                editingResult?.id === id
            ) {
                resetResultForm();
            }

        } catch (error) {

            console.error(
                "Delete result failed:",
                error
            );

            alert(
                "Unable to delete result."
            );
        }
    };


    /* =========================================================
       RESULTS: PERCENTAGE PREVIEW
    ========================================================= */

    const resultPercentage =
        resultForm.marksObtained !== "" &&
            resultForm.totalMarks !== "" &&
            Number(resultForm.totalMarks) > 0
            ? (
                Number(
                    resultForm.marksObtained
                ) /
                Number(
                    resultForm.totalMarks
                )
            ) * 100
            : null;


    /* =========================================================
       FILTER ENQUIRIES
    ========================================================= */

    const filteredEnquiries = useMemo(() => {

        return enquiries.filter((enquiry) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            const matchesSearch =
                !searchText ||

                enquiry.name
                    ?.toLowerCase()
                    .includes(searchText) ||

                enquiry.phone
                    ?.toLowerCase()
                    .includes(searchText) ||

                enquiry.email
                    ?.toLowerCase()
                    .includes(searchText) ||

                enquiry.course
                    ?.toLowerCase()
                    .includes(searchText) ||

                enquiry.targetExam
                    ?.toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                statusFilter === "ALL" ||
                enquiry.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        enquiries,
        search,
        statusFilter,
    ]);


    /* =========================================================
       STATISTICS
    ========================================================= */

    const total =
        enquiries.length;


    const newCount =
        enquiries.filter(
            (item) =>
                item.status === "NEW"
        ).length;


    const contactedCount =
        enquiries.filter(
            (item) =>
                item.status === "CONTACTED"
        ).length;


    const convertedCount =
        enquiries.filter(
            (item) =>
                item.status === "CONVERTED"
        ).length;

    const totalStudents = registeredStudents.length;

    const totalCourses = courses.length;

    const activeEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "ACTIVE"
    ).length;

    const pendingEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "PENDING"
    ).length;

    const inactiveEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "INACTIVE"
    ).length;

    const completedEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "COMPLETED"
    ).length;

    const cancelledEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "CANCELLED"
    ).length;

    const totalYoutubeContent = youtubeContents.length;

    const publishedYoutubeVideos = youtubeContents.filter(
        (content) =>
            content.type === "VIDEO" && content.published
    ).length;

    const publishedYoutubeShorts = youtubeContents.filter(
        (content) =>
            content.type === "SHORTS" && content.published
    ).length;

    const publishedYoutubePlaylists = youtubeContents.filter(
        (content) =>
            content.type === "PLAYLIST" && content.published
    ).length;


    const draftYoutubeContent = youtubeContents.filter(
        (content) => !content.published
    ).length;

    const enrollmentTotal = enrollments.length || 1;

    const enrollmentStats = [
        {
            label: "Active",
            value: activeEnrollments,
            percentage: Math.round((activeEnrollments / enrollmentTotal) * 100),
            className: "active",
        },
        {
            label: "Pending",
            value: pendingEnrollments,
            percentage: Math.round((pendingEnrollments / enrollmentTotal) * 100),
            className: "pending",
        },
        {
            label: "Completed",
            value: completedEnrollments,
            percentage: Math.round((completedEnrollments / enrollmentTotal) * 100),
            className: "completed",
        },
        {
            label: "Inactive",
            value: inactiveEnrollments,
            percentage: Math.round((inactiveEnrollments / enrollmentTotal) * 100),
            className: "inactive",
        },
        {
            label: "Cancelled",
            value: cancelledEnrollments,
            percentage: Math.round((cancelledEnrollments / enrollmentTotal) * 100),
            className: "cancelled",
        },
    ];

    const enquiryTotal = enquiries.length || 1;

    const enquiryStats = [
        {
            label: "New",
            value: newCount,
            percentage: Math.round((newCount / enquiryTotal) * 100),
            className: "new",
        },
        {
            label: "Contacted",
            value: contactedCount,
            percentage: Math.round((contactedCount / enquiryTotal) * 100),
            className: "contacted",
        },
        {
            label: "Converted",
            value: convertedCount,
            percentage: Math.round((convertedCount / enquiryTotal) * 100),
            className: "converted",
        },
    ];
    const recentActivities = [
        ...enrollments.map((enrollment) => ({
            id: `enrollment-${enrollment.id}`,
            type: "enrollment",
            title:
                enrollment.status === "PENDING"
                    ? "New enrollment request"
                    : `Enrollment ${enrollment.status?.toLowerCase() || "updated"}`,
            name:
                enrollment.student?.name ||
                enrollment.student?.email ||
                "Student",
            date: enrollment.enrolledAt || enrollment.createdAt,
        })),

        ...enquiries.map((enquiry) => ({
            id: `enquiry-${enquiry.id}`,
            type: "enquiry",
            title: "New student enquiry",
            name: enquiry.name || enquiry.studentName || "Student",
            date: enquiry.createdAt,
        })),

        ...registeredStudents.map((student) => ({
            id: `student-${student.id}`,
            type: "student",
            title: "New student registered",
            name: student.name || student.email || "Student",
            date: student.createdAt,
        })),
    ]
        .filter((activity) => activity.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);

    const formatActivityDate = (date) => {
        if (!date) return "";

        const activityDate = new Date(date);

        if (Number.isNaN(activityDate.getTime())) return "";

        return activityDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    /* =========================================================
       NO TOKEN
    ========================================================= */

    if (!token) {

        return null;
    }


    /* =========================================================
       UI
    ========================================================= */

    return (

        <main className="admin-page">

            <div className="container">


                {/* =================================================
            HEADER
        ================================================= */}

                <div className="admin-header">

                    <div>

                        <span className="section-label">
                            ADMIN PANEL
                        </span>

                        <h1>Admin Dashboard</h1>
                        <p>Manage students, courses, enrollments, results, and enquiries.</p>

                    </div>


                    <div className="admin-header-actions">

                        <button
                            className="admin-refresh"
                            onClick={fetchEnquiries}
                            type="button"
                        >

                            <RefreshCw size={17} />

                            Refresh

                        </button>


                        <button
                            className="admin-logout"
                            onClick={logout}
                            type="button"
                        >

                            <LogOut size={17} />

                            Logout

                        </button>

                    </div>

                </div>

                {/* =================================================
    ADMIN OVERVIEW
================================================= */}

                <div className="admin-overview">
                    <div className="admin-overview-header">
                        <div>
                            <span className="section-label">
                                OVERVIEW
                            </span>

                            <h2>
                                Dashboard Overview
                            </h2>

                            <p>
                                A quick summary of your Sigma Classes
                                administration.
                            </p>
                        </div>
                    </div>

                    <div className="admin-overview-grid">
                        <button
                            type="button"
                            className="admin-overview-card"
                            onClick={() => setActiveTab("students")}
                        >
                            <div className="admin-overview-icon">
                                <Users size={21} />
                            </div>

                            <div className="admin-overview-content">
                                <span>Total Students</span>
                                <strong>{totalStudents}</strong>
                                <small>Registered students</small>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="admin-overview-card"
                            onClick={() => setActiveTab("courses")}
                        >
                            <div className="admin-overview-icon">
                                <BookOpen size={21} />
                            </div>

                            <div className="admin-overview-content">
                                <span>Total Courses</span>
                                <strong>{totalCourses}</strong>
                                <small>Active courses</small>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="admin-overview-card"
                            onClick={() => setActiveTab("enrollments")}
                        >
                            <div className="admin-overview-icon">
                                <UserPlus size={21} />
                            </div>

                            <div className="admin-overview-content">
                                <span>Active Enrollments</span>
                                <strong>{activeEnrollments}</strong>
                                <small>Currently enrolled</small>
                            </div>
                        </button>


                        <button
                            type="button"
                            className="admin-overview-card admin-overview-pending"
                            onClick={() => setActiveTab("enrollments")}
                        >
                            <div className="admin-overview-icon">
                                <UserPlus size={21} />
                            </div>

                            <div className="admin-overview-content">
                                <span>Pending Requests</span>
                                <strong>{pendingEnrollments}</strong>
                                <small>Waiting for approval</small>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="admin-overview-card"
                            onClick={() => setActiveTab("enquiries")}
                        >
                            <div className="admin-overview-icon">
                                <MessageCircle size={21} />
                            </div>

                            <div className="admin-overview-content">
                                <span>Total Enquiries</span>
                                <strong>{total}</strong>
                                <small>Student enquiries</small>
                            </div>
                        </button>

                    </div>
                    <div className="admin-recent-activity">
                        <div className="admin-recent-header">
                            <div>
                                <span className="section-label">ACTIVITY</span>
                                <h3>Recent Activity</h3>
                                <p>Latest updates from your coaching platform.</p>
                            </div>
                        </div>

                        {recentActivities.length === 0 ? (
                            <div className="admin-activity-empty">
                                <ClipboardList size={22} />
                                <span>No recent activity yet.</span>
                            </div>
                        ) : (
                            <div className="admin-activity-list">
                                {recentActivities.map((activity) => (
                                    <div className="admin-activity-item" key={activity.id}>
                                        <div className={`admin-activity-icon ${activity.type}`}>
                                            {activity.type === "enrollment" && <UserPlus size={17} />}
                                            {activity.type === "enquiry" && <MessageCircle size={17} />}
                                            {activity.type === "student" && <Users size={17} />}
                                        </div>

                                        <div className="admin-activity-content">
                                            <strong>{activity.title}</strong>
                                            <span>{activity.name}</span>
                                        </div>

                                        <time>{formatActivityDate(activity.date)}</time>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="admin-analytics-grid">
                        <div className="admin-analytics-card">
                            <div className="admin-analytics-header">
                                <div>
                                    <span className="section-label">ENROLLMENTS</span>
                                    <h3>Enrollment Status</h3>
                                </div>

                                <BookOpen size={19} />
                            </div>

                            <div className="admin-analytics-list">
                                {enrollmentStats.map((stat) => (
                                    <div className="admin-analytics-row" key={stat.label}>
                                        <div className="admin-analytics-row-top">
                                            <span>{stat.label}</span>
                                            <strong>
                                                {stat.value} <small>({stat.percentage}%)</small>
                                            </strong>
                                        </div>

                                        <div className="admin-progress-track">
                                            <div
                                                className={`admin-progress-bar ${stat.className}`}
                                                style={{ width: `${stat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-analytics-card">
                            <div className="admin-analytics-header">
                                <div>
                                    <span className="section-label">ENQUIRIES</span>
                                    <h3>Enquiry Conversion</h3>
                                </div>

                                <MessageCircle size={19} />
                            </div>

                            <div className="admin-enquiry-summary">
                                <div className="admin-enquiry-total">
                                    <strong>{enquiries.length}</strong>
                                    <span>Total Enquiries</span>
                                </div>

                                <div className="admin-conversion-rate">
                                    <strong>
                                        {enquiries.length
                                            ? Math.round((convertedCount / enquiries.length) * 100)
                                            : 0}
                                        %
                                    </strong>
                                    <span>Conversion Rate</span>
                                </div>
                            </div>

                            <div className="admin-analytics-list">
                                {enquiryStats.map((stat) => (
                                    <div className="admin-analytics-row" key={stat.label}>
                                        <div className="admin-analytics-row-top">
                                            <span>{stat.label}</span>
                                            <strong>
                                                {stat.value} <small>({stat.percentage}%)</small>
                                            </strong>
                                        </div>

                                        <div className="admin-progress-track">
                                            <div
                                                className={`admin-progress-bar ${stat.className}`}
                                                style={{ width: `${stat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="admin-quick-actions">
                        <div className="admin-quick-header">
                            <div>
                                <span className="section-label">QUICK ACTIONS</span>
                                <h3>Manage Sigma Classes</h3>
                                <p>Jump directly to the section you need.</p>
                            </div>
                        </div>

                        <div className="admin-quick-grid">
                            <button
                                type="button"
                                className="admin-quick-action"
                                onClick={() => setActiveTab("students")}
                            >
                                <div className="admin-quick-icon">
                                    <Users size={19} />
                                </div>
                                <div>
                                    <strong>Students</strong>
                                    <span>Manage registered students</span>
                                </div>
                                <ExternalLink size={16} />
                            </button>

                            <button
                                type="button"
                                className="admin-quick-action"
                                onClick={() => setActiveTab("courses")}
                            >
                                <div className="admin-quick-icon">
                                    <BookOpen size={19} />
                                </div>
                                <div>
                                    <strong>Courses</strong>
                                    <span>Add or manage courses</span>
                                </div>
                                <ExternalLink size={16} />
                            </button>

                            <button
                                type="button"
                                className="admin-quick-action"
                                onClick={() => setActiveTab("enrollments")}
                            >
                                <div className="admin-quick-icon">
                                    <UserPlus size={19} />
                                </div>
                                <div>
                                    <strong>Enrollments</strong>
                                    <span>Approve student requests</span>
                                </div>
                                <ExternalLink size={16} />
                            </button>

                            <button
                                type="button"
                                className="admin-quick-action"
                                onClick={() => setActiveTab("results")}
                            >
                                <div className="admin-quick-icon">
                                    <ClipboardList size={19} />
                                </div>
                                <div>
                                    <strong>Results</strong>
                                    <span>Manage student results</span>
                                </div>
                                <ExternalLink size={16} />
                            </button>

                            <button
                                type="button"
                                className="admin-quick-action"
                                onClick={() => setActiveTab("materials")}
                            >
                                <div className="admin-quick-icon">
                                    <FileText size={19} />
                                </div>
                                <div>
                                    <strong>Study Materials</strong>
                                    <span>Manage PDFs and videos</span>
                                </div>
                                <ExternalLink size={16} />
                            </button>

                            <button
                                type="button"
                                className="admin-quick-action"
                                onClick={() => setActiveTab("enquiries")}
                            >
                                <div className="admin-quick-icon">
                                    <MessageCircle size={19} />
                                </div>
                                <div>
                                    <strong>Enquiries</strong>
                                    <span>View and follow up enquiries</span>
                                </div>
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>


                </div>


                {/* =================================================
            ADMIN TABS
        ================================================= */}

                <div className="admin-tabs">

                    <button
                        type="button"
                        className={
                            activeTab === "enquiries"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("enquiries")
                        }
                    >
                        <Users size={17} />
                        Enquiries
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "results"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("results")
                        }
                    >
                        <ClipboardList size={17} />
                        Results
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "materials"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("materials")
                        }
                    >
                        <FileText size={17} />
                        Study Materials
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "courses"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("courses")
                        }
                    >
                        <BookOpen size={17} />
                        Courses
                    </button>


                    <button
  type="button"
  className={
    activeTab === "faculty"
      ? "active"
      : ""
  }
  onClick={() =>
    setActiveTab("faculty")
  }
>
  <Users size={17} />
  Faculty
</button>

                    <button
                        type="button"
                        className={
                            activeTab === "enrollments"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("enrollments")
                        }
                    >
                        <UserPlus size={17} />
                        Enrollments
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "students"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("students")
                        }
                    >
                        <Users size={17} />
                        Students
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "youtube"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("youtube")
                        }
                    >
                        <ListVideo size={17} />
                        YouTube
                    </button>

                </div>


                {activeTab === "enquiries" && (
                    <>
                        {/* =================================================
            STATISTICS
        ================================================= */}

                        <div className="admin-stats">


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon">

                                    <Users size={20} />

                                </div>

                                <div>

                                    <span>
                                        Total Enquiries
                                    </span>

                                    <strong>
                                        {total}
                                    </strong>

                                </div>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon">

                                    <UserPlus size={20} />

                                </div>

                                <div>

                                    <span>
                                        New
                                    </span>

                                    <strong>
                                        {newCount}
                                    </strong>

                                </div>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon">

                                    <Phone size={20} />

                                </div>

                                <div>

                                    <span>
                                        Contacted
                                    </span>

                                    <strong>
                                        {contactedCount}
                                    </strong>

                                </div>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon">

                                    <MessageCircle size={20} />

                                </div>

                                <div>

                                    <span>
                                        Converted
                                    </span>

                                    <strong>
                                        {convertedCount}
                                    </strong>

                                </div>

                            </div>


                        </div>


                        {/* =================================================
            TABLE
        ================================================= */}

                        <div className="admin-table-card">


                            <div className="admin-table-header">

                                <h2>
                                    Enquiries
                                </h2>

                                <span>
                                    {filteredEnquiries.length} of {total}
                                </span>

                            </div>


                            {/* SEARCH + FILTER */}

                            <div className="admin-toolbar">


                                <div className="admin-search">

                                    <Search size={17} />

                                    <input
                                        type="text"
                                        placeholder="Search by name, phone, email..."
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                    />


                                    {search && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSearch("")
                                            }
                                            aria-label="Clear search"
                                        >

                                            <X size={16} />

                                        </button>

                                    )}

                                </div>


                                <div className="admin-filters">


                                    <button
                                        type="button"
                                        className={
                                            statusFilter === "ALL"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setStatusFilter("ALL")
                                        }
                                    >
                                        All
                                    </button>


                                    <button
                                        type="button"
                                        className={
                                            statusFilter === "NEW"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setStatusFilter("NEW")
                                        }
                                    >
                                        New
                                    </button>


                                    <button
                                        type="button"
                                        className={
                                            statusFilter === "CONTACTED"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setStatusFilter(
                                                "CONTACTED"
                                            )
                                        }
                                    >
                                        Contacted
                                    </button>


                                    <button
                                        type="button"
                                        className={
                                            statusFilter === "CONVERTED"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setStatusFilter(
                                                "CONVERTED"
                                            )
                                        }
                                    >
                                        Converted
                                    </button>


                                </div>

                            </div>


                            {/* LOADING */}

                            {loading ? (

                                <div className="admin-empty">

                                    Loading enquiries...

                                </div>


                            ) : filteredEnquiries.length === 0 ? (

                                <div className="admin-empty">

                                    No matching enquiries found.

                                </div>


                            ) : (

                                <div className="admin-table-wrapper">

                                    <table className="admin-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Student
                                                </th>

                                                <th>
                                                    Phone
                                                </th>

                                                <th>
                                                    Course
                                                </th>

                                                <th>
                                                    Target Exam
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Date
                                                </th>

                                                <th>
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {filteredEnquiries.map(
                                                (enquiry) => (

                                                    <tr
                                                        key={enquiry.id}
                                                        className="admin-row"
                                                        onClick={() =>
                                                            setSelectedEnquiry(
                                                                enquiry
                                                            )
                                                        }
                                                    >

                                                        <td>

                                                            <strong>
                                                                {enquiry.name}
                                                            </strong>

                                                            {enquiry.email && (

                                                                <small>
                                                                    {enquiry.email}
                                                                </small>

                                                            )}

                                                        </td>


                                                        <td>

                                                            <a
                                                                href={`tel:${enquiry.phone}`}
                                                                className="admin-phone"
                                                                onClick={(event) =>
                                                                    event.stopPropagation()
                                                                }
                                                            >

                                                                <Phone size={14} />

                                                                {enquiry.phone}

                                                            </a>

                                                        </td>


                                                        <td>
                                                            {enquiry.course || "—"}
                                                        </td>


                                                        <td>
                                                            {enquiry.targetExam || "—"}
                                                        </td>


                                                        <td>

                                                            <select
                                                                className={`status-select status-${(
                                                                    enquiry.status || "NEW"
                                                                ).toLowerCase()}`}
                                                                value={
                                                                    enquiry.status || "NEW"
                                                                }
                                                                onChange={(event) => {

                                                                    event.stopPropagation();

                                                                    updateStatus(
                                                                        enquiry.id,
                                                                        event.target.value
                                                                    );

                                                                }}
                                                                onClick={(event) =>
                                                                    event.stopPropagation()
                                                                }
                                                            >

                                                                <option value="NEW">
                                                                    New
                                                                </option>

                                                                <option value="CONTACTED">
                                                                    Contacted
                                                                </option>

                                                                <option value="CONVERTED">
                                                                    Converted
                                                                </option>

                                                            </select>

                                                        </td>


                                                        <td>

                                                            {enquiry.createdAt
                                                                ? new Date(
                                                                    enquiry.createdAt
                                                                ).toLocaleDateString()
                                                                : "—"}

                                                        </td>


                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="admin-delete"
                                                                onClick={(event) => {

                                                                    event.stopPropagation();

                                                                    deleteEnquiry(
                                                                        enquiry.id
                                                                    );

                                                                }}
                                                                aria-label="Delete enquiry"
                                                            >

                                                                <Trash2 size={17} />

                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>



                    </>
                )}


                {/* =================================================
            STUDY MATERIALS MANAGEMENT
        ================================================= */}

                {activeTab === "materials" && (

                    <section className="admin-results">

                        <div className="admin-table-card">

                            <div className="admin-table-header">

                                <div>

                                    <span className="section-label">
                                        STUDY MATERIALS
                                    </span>

                                    <h2>
                                        {editingMaterial
                                            ? "Edit Study Material"
                                            : "Add Study Material"}
                                    </h2>

                                    <p>
                                        Add PDFs, YouTube videos, or external resources using links.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="admin-refresh"
                                    onClick={resetMaterialForm}
                                >
                                    <Plus size={17} />
                                    New Material
                                </button>

                            </div>

                            {materialsError && (

                                <div className="admin-empty">
                                    {materialsError}
                                </div>

                            )}

                            <form
                                className="admin-result-form"
                                onSubmit={saveMaterial}
                            >

                                <div className="admin-form-grid">

                                    <div className="admin-form-field">

                                        <label htmlFor="materialCourseId">
                                            Course
                                        </label>

                                        <select
                                            id="materialCourseId"
                                            name="courseId"
                                            value={materialForm.courseId}
                                            onChange={handleMaterialFormChange}
                                            required
                                        >

                                            <option value="">
                                                Select course
                                            </option>

                                            {courses.map(
                                                (course) => (

                                                    <option
                                                        key={course.id}
                                                        value={course.id}
                                                    >
                                                        {course.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="materialTitle">
                                            Title
                                        </label>

                                        <input
                                            id="materialTitle"
                                            name="title"
                                            type="text"
                                            placeholder="e.g. Percentage Complete Notes"
                                            value={materialForm.title}
                                            onChange={handleMaterialFormChange}
                                            required
                                        />

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="materialSubject">
                                            Subject
                                        </label>

                                        <input
                                            id="materialSubject"
                                            name="subject"
                                            type="text"
                                            placeholder="e.g. Quantitative Aptitude"
                                            value={materialForm.subject}
                                            onChange={handleMaterialFormChange}
                                        />

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="materialType">
                                            Type
                                        </label>

                                        <select
                                            id="materialType"
                                            name="type"
                                            value={materialForm.type}
                                            onChange={handleMaterialFormChange}
                                            required
                                        >

                                            <option value="PDF">
                                                PDF
                                            </option>

                                            <option value="VIDEO">
                                                YouTube Video
                                            </option>

                                            <option value="LINK">
                                                External Link
                                            </option>

                                        </select>

                                    </div>


                                    <div className="admin-form-field admin-form-field-wide">

                                        <label htmlFor="materialUrl">
                                            Resource URL
                                        </label>

                                        <input
                                            id="materialUrl"
                                            name="url"
                                            type="url"
                                            placeholder={
                                                materialForm.type === "PDF"
                                                    ? "Paste Google Drive PDF link"
                                                    : materialForm.type === "VIDEO"
                                                        ? "Paste YouTube video link"
                                                        : "Paste external resource link"
                                            }
                                            value={materialForm.url}
                                            onChange={handleMaterialFormChange}
                                            required
                                        />

                                        <small>
                                            No files are uploaded to the server. Paste the Google Drive, YouTube, or external link.
                                        </small>

                                    </div>


                                    <div className="admin-form-field admin-form-field-wide">

                                        <label htmlFor="materialDescription">
                                            Description
                                        </label>

                                        <textarea
                                            id="materialDescription"
                                            name="description"
                                            rows="4"
                                            placeholder="Briefly describe this material..."
                                            value={materialForm.description}
                                            onChange={handleMaterialFormChange}
                                        />

                                    </div>


                                    <div className="admin-form-field admin-form-field-wide">

                                        <label
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                cursor: "pointer",
                                            }}
                                        >

                                            <input
                                                type="checkbox"
                                                className="admin-checkbox"
                                                name="published"
                                                checked={materialForm.published}
                                                onChange={handleMaterialFormChange}
                                            />

                                            Publish immediately

                                        </label>

                                    </div>

                                </div>


                                <div className="admin-modal-actions">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        {editingMaterial
                                            ? <Pencil size={17} />
                                            : <Save size={17} />}

                                        {editingMaterial
                                            ? "Update Material"
                                            : "Add Material"}

                                    </button>


                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={resetMaterialForm}
                                    >
                                        Clear
                                    </button>


                                </div>

                            </form>

                        </div>


                        <div className="admin-table-card">

                            <div className="admin-table-header">

                                <div>

                                    <span className="section-label">
                                        RESOURCE LIBRARY
                                    </span>

                                    <h2>
                                        Existing Materials
                                    </h2>

                                    <p>
                                        {materials.length} material
                                        {materials.length === 1
                                            ? ""
                                            : "s"}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="admin-refresh"
                                    onClick={fetchMaterials}
                                >
                                    <RefreshCw size={17} />
                                    Refresh
                                </button>

                            </div>


                            {materialsLoading ? (

                                <div className="admin-empty">
                                    Loading study materials...
                                </div>

                            ) : materials.length === 0 ? (

                                <div className="admin-empty">
                                    No study materials have been added yet.
                                </div>

                            ) : (

                                <div className="admin-results-grid">

                                    {materials.map(
                                        (material) => (

                                            <article
                                                className="admin-result-card"
                                                key={material.id}
                                            >

                                                <div className="admin-result-card-header">

                                                    <div>

                                                        <span className="section-label">
                                                            {material.type || "MATERIAL"}
                                                        </span>

                                                        <h3>
                                                            {material.title}
                                                        </h3>

                                                    </div>

                                                    <span>
                                                        #{material.id}
                                                    </span>

                                                </div>


                                                <div className="admin-result-student">

                                                    <strong>
                                                        {material.course?.name ||
                                                            "Unknown Course"}
                                                    </strong>

                                                    <small>
                                                        {material.subject ||
                                                            "No subject specified"}
                                                    </small>

                                                </div>


                                                <div className="admin-result-course">

                                                    <BookOpen size={16} />

                                                    <span>
                                                        {material.course?.category ||
                                                            "Course Material"}
                                                    </span>

                                                </div>


                                                <div className="admin-result-meta">

                                                    <span>
                                                        Status:{" "}
                                                        {material.published
                                                            ? "Published"
                                                            : "Draft"}
                                                    </span>

                                                    <span>
                                                        Created:{" "}
                                                        {material.createdAt
                                                            ? new Date(
                                                                material.createdAt
                                                            ).toLocaleDateString()
                                                            : "—"}
                                                    </span>

                                                </div>


                                                {material.description && (

                                                    <div className="admin-result-remarks">

                                                        <span>
                                                            Description
                                                        </span>

                                                        <p>
                                                            {material.description}
                                                        </p>

                                                    </div>

                                                )}


                                                <div className="admin-result-actions">

                                                    <a
                                                        href={material.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-light"
                                                        onClick={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                    >
                                                        <ExternalLink size={16} />
                                                        Open
                                                    </a>


                                                    <button
                                                        type="button"
                                                        className="btn btn-light"
                                                        onClick={() =>
                                                            startEditingMaterial(
                                                                material
                                                            )
                                                        }
                                                    >
                                                        <Pencil size={16} />
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="btn btn-light"
                                                        onClick={() =>
                                                            toggleMaterialPublished(
                                                                material
                                                            )
                                                        }
                                                    >
                                                        {material.published
                                                            ? <EyeOff size={16} />
                                                            : <Eye size={16} />}

                                                        {material.published
                                                            ? "Unpublish"
                                                            : "Publish"}

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="admin-delete-result"
                                                        onClick={() =>
                                                            deleteMaterial(
                                                                material.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
            COURSE MANAGEMENT
        ================================================= */}

                {activeTab === "courses" && (
                    <section className="admin-results">
                        <AdminCourses />
                    </section>
                )}

                {/* =================================================
    FACULTY MANAGEMENT
================================================= */}

{activeTab === "faculty" && (
  <AdminFaculty />
)}

                {/* =================================================
    YOUTUBE CONTENT MANAGEMENT
================================================= */}

                {activeTab === "youtube" && (
                    <section className="admin-results">

                        <div className="admin-table-card">

                            <div className="admin-table-header">
                                <div>
                                    <span className="section-label">
                                        YOUTUBE CONTENT
                                    </span>

                                    <h2>
                                        {editingYoutubeContent
                                            ? "Edit YouTube Content"
                                            : "Add YouTube Content"}
                                    </h2>

                                    <p>
                                        Add videos or playlists from the official
                                        Sigma Classes YouTube channel.
                                    </p>

                                    <div className="youtube-admin-stats">
                                        <div className="youtube-admin-stat-card">
                                            <div className="youtube-admin-stat-icon">
                                                <ListVideo size={19} />
                                            </div>

                                            <div>
                                                <span>Total Content</span>
                                                <strong>{totalYoutubeContent}</strong>
                                            </div>
                                        </div>

                                        <div className="youtube-admin-stat-card">
                                            <div className="youtube-admin-stat-icon">
                                                <Eye size={19} />
                                            </div>

                                            <div>
                                                <span>Published Videos</span>
                                                <strong>{publishedYoutubeVideos}</strong>
                                            </div>
                                        </div>

                                        <div className="youtube-admin-stat-card">
                                            <div className="youtube-admin-stat-icon">
                                                <ListVideo size={19} />
                                            </div>

                                            <div>
                                                <span>Published Shorts</span>
                                                <strong>{publishedYoutubeShorts}</strong>
                                            </div>
                                        </div>

                                        <div className="youtube-admin-stat-card">
                                            <div className="youtube-admin-stat-icon">
                                                <ListVideo size={19} />
                                            </div>

                                            <div>
                                                <span>Published Playlists</span>
                                                <strong>{publishedYoutubePlaylists}</strong>
                                            </div>
                                        </div>

                                        <div className="youtube-admin-stat-card youtube-admin-stat-draft">
                                            <div className="youtube-admin-stat-icon">
                                                <EyeOff size={19} />
                                            </div>

                                            <div>
                                                <span>Draft Content</span>
                                                <strong>{draftYoutubeContent}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {youtubeError && (
                                <div className="admin-empty">
                                    {youtubeError}
                                </div>
                            )}

                            <form
                                className="admin-result-form"
                                onSubmit={saveYoutubeContent}
                            >

                                <div className="admin-form-grid">

                                    {/* Content Type */}
                                    <div className="admin-form-field">
                                        <label htmlFor="youtubeType">
                                            Content Type
                                        </label>

                                        <select
                                            id="youtubeType"
                                            name="type"
                                            value={youtubeForm.type}
                                            onChange={handleYoutubeFormChange}
                                            required
                                        >
                                            <option value="VIDEO">
                                                Video
                                            </option>

                                            <option value="SHORTS">
                                                Shorts
                                            </option>

                                            <option value="PLAYLIST">
                                                Playlist
                                            </option>
                                        </select>
                                    </div>


                                    {/* Category */}
                                    <div className="admin-form-field">
                                        <label htmlFor="youtubeCategory">
                                            Category
                                        </label>

                                        <input
                                            id="youtubeCategory"
                                            type="text"
                                            name="category"
                                            value={youtubeForm.category}
                                            onChange={handleYoutubeFormChange}
                                            placeholder="e.g. SSC CGL, Banking, Maths"
                                        />
                                    </div>


                                    {/* YouTube URL */}
                                    <div className="admin-form-field admin-form-field-full">
                                        <label htmlFor="youtubeUrl">
                                            YouTube URL
                                        </label>

                                        <input
                                            id="youtubeUrl"
                                            type="url"
                                            name="youtubeUrl"
                                            value={youtubeForm.youtubeUrl}
                                            onChange={handleYoutubeFormChange}
                                            placeholder="Paste YouTube video or playlist URL"
                                            required
                                        />

                                        <small>
                                            The YouTube ID will be extracted automatically.
                                        </small>
                                    </div>


                                    {/* Title */}
                                    <div className="admin-form-field admin-form-field-full">
                                        <label htmlFor="youtubeTitle">
                                            Title
                                        </label>

                                        <input
                                            id="youtubeTitle"
                                            type="text"
                                            name="title"
                                            value={youtubeForm.title}
                                            onChange={handleYoutubeFormChange}
                                            placeholder="Enter video or playlist title"
                                            required
                                        />
                                    </div>


                                    {/* Description */}
                                    <div className="admin-form-field admin-form-field-full">
                                        <label htmlFor="youtubeDescription">
                                            Description
                                        </label>

                                        <textarea
                                            id="youtubeDescription"
                                            name="description"
                                            value={youtubeForm.description}
                                            onChange={handleYoutubeFormChange}
                                            placeholder="Short description"
                                            rows="4"
                                        />
                                    </div>


                                    {/* Display Order */}
                                    <div className="admin-form-field">
                                        <label htmlFor="youtubeDisplayOrder">
                                            Display Order
                                        </label>

                                        <input
                                            id="youtubeDisplayOrder"
                                            type="number"
                                            name="displayOrder"
                                            min="0"
                                            value={youtubeForm.displayOrder}
                                            onChange={handleYoutubeFormChange}
                                        />
                                    </div>


                                    {/* Published */}
                                    <div className="admin-form-field">
                                        <label htmlFor="youtubePublished">
                                            Visibility
                                        </label>

                                        <select
                                            id="youtubePublished"
                                            name="published"
                                            value={String(youtubeForm.published)}
                                            onChange={(event) =>
                                                setYoutubeForm((prev) => ({
                                                    ...prev,
                                                    published:
                                                        event.target.value === "true",
                                                }))
                                            }
                                        >
                                            <option value="true">
                                                Published
                                            </option>

                                            <option value="false">
                                                Draft
                                            </option>
                                        </select>
                                    </div>

                                </div>


                                {/* Actions */}
                                <div className="admin-modal-actions">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={youtubeLoading}
                                    >
                                        {editingYoutubeContent ? (
                                            <>
                                                <Save size={17} />
                                                {youtubeLoading
                                                    ? "Updating..."
                                                    : "Update Content"}
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={17} />
                                                {youtubeLoading
                                                    ? "Adding..."
                                                    : "Add Content"}
                                            </>
                                        )}
                                    </button>


                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={resetYoutubeForm}
                                        disabled={youtubeLoading}
                                    >
                                        Clear
                                    </button>

                                </div>

                            </form>

                            {/* YOUTUBE CONTENT LIST */}

                            <div className="admin-table-card youtube-content-list-card">

                                <div className="admin-table-header">
                                    <div>
                                        <span className="section-label">
                                            CONTENT LIBRARY
                                        </span>

                                        <h2>
                                            Published & Draft Content
                                        </h2>

                                        <p>
                                            Manage the videos and playlists displayed on the student portal.
                                        </p>

                                        <div className="youtube-library-toolbar">
                                            <div className="youtube-search-box">
                                                <Search size={17} />

                                                <input
                                                    type="text"
                                                    value={youtubeSearch}
                                                    onChange={(event) =>
                                                        setYoutubeSearch(event.target.value)
                                                    }
                                                    placeholder="Search videos, playlists, or categories..."
                                                />

                                                {youtubeSearch && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setYoutubeSearch("")}
                                                        title="Clear search"
                                                    >
                                                        <X size={15} />
                                                    </button>
                                                )}
                                            </div>


                                            <select
                                                value={youtubeTypeFilter}
                                                onChange={(event) =>
                                                    setYoutubeTypeFilter(event.target.value)
                                                }
                                                aria-label="Filter by content type"
                                            >
                                                <option value="ALL">All Types</option>
                                                <option value="VIDEO">Videos</option>
                                                <option value="SHORTS">Shorts</option>
                                                <option value="PLAYLIST">Playlists</option>
                                            </select>

                                            <select
                                                value={youtubeStatusFilter}
                                                onChange={(event) =>
                                                    setYoutubeStatusFilter(event.target.value)
                                                }
                                                aria-label="Filter by content status"
                                            >
                                                <option value="ALL">All Status</option>
                                                <option value="PUBLISHED">Published</option>
                                                <option value="DRAFT">Drafts</option>
                                            </select>
                                            <div className="youtube-library-result-count">
                                                Showing <strong>{filteredYoutubeContents.length}</strong> of{" "}
                                                <strong>{youtubeContents.length}</strong> content items
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {youtubeLoading && youtubeContents.length === 0 ? (
                                    <div className="admin-empty">
                                        Loading YouTube content...
                                    </div>
                                ) : youtubeContents.length === 0 ? (
                                    <div className="admin-empty">
                                        <ListVideo size={28} />
                                        <p>
                                            No YouTube content has been added yet.
                                        </p>
                                    </div>
                                ) : (

                                    <div className="admin-table-wrapper">

                                        <table className="admin-table">

                                            <thead>
                                                <tr>
                                                    <th>Content</th>
                                                    <th>Type</th>
                                                    <th>Category</th>
                                                    <th>Order</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {filteredYoutubeContents.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6">
                                                            <div className="youtube-filter-empty">
                                                                <Search size={24} />
                                                                <strong>No content found</strong>
                                                                <span>
                                                                    Try changing your search or filters.
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredYoutubeContents.map((content) => (

                                                        <tr key={content.id}>

                                                            {/* Content */}
                                                            <td>

                                                                <div className="youtube-admin-content">

                                                                    <div className="youtube-admin-thumbnail">

                                                                        {content.thumbnailUrl ? (
                                                                            <img
                                                                                src={content.thumbnailUrl}
                                                                                alt={content.title}
                                                                            />
                                                                        ) : (
                                                                            <ListVideo size={22} />
                                                                        )}

                                                                    </div>

                                                                    <div className="youtube-admin-info">

                                                                        <strong>
                                                                            {content.title}
                                                                        </strong>

                                                                        {content.description && (
                                                                            <span>
                                                                                {content.description.length > 80
                                                                                    ? `${content.description.substring(0, 80)}...`
                                                                                    : content.description}
                                                                            </span>
                                                                        )}

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* Type */}
                                                            <td>
                                                                <span className="youtube-type-badge">
                                                                    {content.type}
                                                                </span>
                                                            </td>


                                                            {/* Category */}
                                                            <td>
                                                                {content.category || "—"}
                                                            </td>


                                                            {/* Display Order */}
                                                            <td>
                                                                {content.displayOrder ?? 0}
                                                            </td>


                                                            {/* Status */}
                                                            <td>

                                                                <button
                                                                    type="button"
                                                                    className={
                                                                        content.published
                                                                            ? "youtube-status-btn published"
                                                                            : "youtube-status-btn draft"
                                                                    }
                                                                    onClick={() =>
                                                                        toggleYoutubePublished(content)
                                                                    }
                                                                    title={
                                                                        content.published
                                                                            ? "Click to unpublish"
                                                                            : "Click to publish"
                                                                    }
                                                                >

                                                                    {content.published ? (
                                                                        <>
                                                                            <Eye size={15} />
                                                                            Published
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <EyeOff size={15} />
                                                                            Draft
                                                                        </>
                                                                    )}

                                                                </button>

                                                            </td>


                                                            {/* Actions */}
                                                            <td>

                                                                <div className="youtube-admin-actions">

                                                                    <button
                                                                        type="button"
                                                                        className="youtube-action-edit"
                                                                        onClick={() =>
                                                                            startEditingYoutubeContent(content)
                                                                        }
                                                                        title="Edit content"
                                                                    >
                                                                        <Pencil size={16} />
                                                                    </button>


                                                                    <button
                                                                        type="button"
                                                                        className="youtube-action-delete"
                                                                        onClick={() =>
                                                                            deleteYoutubeContent(content.id)
                                                                        }
                                                                        title="Delete content"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    ))


                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>


                        </div>

                    </section>
                )}


                {/* =================================================
            ENROLLMENT MANAGEMENT
        ================================================= */}

                {activeTab === "enrollments" && (
                    <section className="admin-results">

                        <div className="admin-table-card">

                            <div className="admin-table-header">

                                <div>
                                    <span className="section-label">
                                        ENROLLMENT MANAGEMENT
                                    </span>

                                    <h2>
                                        Enroll Student
                                    </h2>

                                    <p>
                                        Manually enroll a registered student into a course.
                                    </p>
                                </div>

                            </div>

                            {enrollmentsError && (
                                <div className="admin-empty">
                                    {enrollmentsError}
                                </div>
                            )}

                            <form
                                className="admin-result-form"
                                onSubmit={createEnrollment}
                            >

                                <div className="admin-form-grid">

                                    <div className="admin-form-field">
                                        <label htmlFor="enrollmentStudentId">
                                            Student
                                        </label>

                                        <select
                                            id="enrollmentStudentId"
                                            name="studentId"
                                            value={enrollmentForm.studentId}
                                            onChange={handleEnrollmentFormChange}
                                            required
                                        >
                                            <option value="">
                                                Select student
                                            </option>

                                            {students.map((student) => (
                                                <option
                                                    key={student.id}
                                                    value={student.id}
                                                >
                                                    {student.name} — {student.email}
                                                </option>
                                            ))}
                                        </select>
                                    </div>



                                    <div className="admin-form-field">
                                        <label htmlFor="enrollmentCourseId">
                                            Course
                                        </label>

                                        <select
                                            id="enrollmentCourseId"
                                            name="courseId"
                                            value={enrollmentForm.courseId}
                                            onChange={handleEnrollmentFormChange}
                                            required
                                        >
                                            <option value="">
                                                Select course
                                            </option>

                                            {courses.map((course) => (
                                                <option
                                                    key={course.id}
                                                    value={course.id}
                                                >
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

   


                                <div className="admin-modal-actions">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        <UserPlus size={17} />
                                        Enroll Student
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() =>
                                            setEnrollmentForm({
    studentId: "",
    courseId: "",
    
})
                                        }
                                    >
                                        Clear
                                    </button>

                                </div>

                            </form>

                        </div>


                        <div className="admin-table-card">

                            <div className="admin-table-header">

                                <div>
                                    <span className="section-label">
                                        ENROLLMENT RECORDS
                                    </span>

                                    <h2>
                                        All Enrollments
                                    </h2>

                                    <p>
                                        {enrollments.length} enrollment
                                        {enrollments.length === 1 ? "" : "s"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="admin-refresh"
                                    onClick={fetchEnrollments}
                                >
                                    <RefreshCw size={17} />
                                    Refresh
                                </button>

                            </div>

                            {enrollmentsLoading ? (

                                <div className="admin-empty">
                                    Loading enrollments...
                                </div>

                            ) : enrollments.length === 0 ? (

                                <div className="admin-empty">
                                    No enrollments found.
                                </div>

                            ) : (

                                <div className="admin-table-wrapper">

                                    <table className="admin-table">

                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Phone</th>
                                                <th>Course</th>
                                                <th>Enrolled At</th>
                                                <th>Status</th>
                                                <th></th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {enrollments.map((enrollment) => (

                                                <tr key={enrollment.id}>

                                                    <td>
                                                        <strong>
                                                            {enrollment.student?.name ||
                                                                "Unknown Student"}
                                                        </strong>
                                                        <small>
                                                            {enrollment.student?.email || ""}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {enrollment.student?.phone || "—"}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {enrollment.course?.name ||
                                                                "Unknown Course"}
                                                        </strong>
                                                        <small>
                                                            {enrollment.course?.category || ""}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {enrollment.enrolledAt
                                                            ? new Date(
                                                                enrollment.enrolledAt
                                                            ).toLocaleDateString()
                                                            : "—"}
                                                    </td>

                                                    <td>
                                                        {enrollment.status === "PENDING" ? (
                                                            <div className="enrollment-pending-actions">

                                                                <button
                                                                    type="button"
                                                                    className="enrollment-approve-btn"
                                                                    onClick={() =>
                                                                        updateEnrollmentStatus(
                                                                            enrollment.id,
                                                                            "ACTIVE"
                                                                        )
                                                                    }
                                                                    title="Approve enrollment"
                                                                >
                                                                    <Check size={15} />
                                                                    Approve
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="enrollment-reject-btn"
                                                                    onClick={() =>
                                                                        updateEnrollmentStatus(
                                                                            enrollment.id,
                                                                            "CANCELLED"
                                                                        )
                                                                    }
                                                                    title="Reject enrollment"
                                                                >
                                                                    <X size={15} />
                                                                    Reject
                                                                </button>

                                                            </div>
                                                        ) : (
                                                            <select
                                                                className={`status-select status-${(
                                                                    enrollment.status ||
                                                                    "ACTIVE"
                                                                ).toLowerCase()}`}
                                                                value={
                                                                    enrollment.status ||
                                                                    "ACTIVE"
                                                                }
                                                                onChange={(event) =>
                                                                    updateEnrollmentStatus(
                                                                        enrollment.id,
                                                                        event.target.value
                                                                    )
                                                                }
                                                            >
                                                                <option value="ACTIVE">
                                                                    Active
                                                                </option>

                                                                <option value="INACTIVE">
                                                                    Inactive
                                                                </option>

                                                                <option value="COMPLETED">
                                                                    Completed
                                                                </option>

                                                                <option value="CANCELLED">
                                                                    Cancelled
                                                                </option>
                                                            </select>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="admin-delete"
                                                            onClick={() =>
                                                                deleteEnrollment(
                                                                    enrollment.id
                                                                )
                                                            }
                                                            aria-label="Delete enrollment"
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </section>
                )}


                {/* =================================================
            RESULTS MANAGEMENT
        ================================================= */}

                {activeTab === "results" && (

                    <section className="admin-results">

                        <div className="admin-table-card">

                            <div className="admin-table-header">

                                <div>

                                    <span className="section-label">
                                        OFFLINE RESULTS
                                    </span>

                                    <h2>
                                        {editingResult
                                            ? "Edit Result"
                                            : "Add Result"}
                                    </h2>

                                    <p>
                                        {editingResult
                                            ? "Update the selected student's result."
                                            : "Enter an offline test or examination result."}
                                    </p>

                                </div>

                                {editingResult && (

                                    <button
                                        type="button"
                                        className="admin-refresh"
                                        onClick={resetResultForm}
                                    >
                                        Cancel Edit
                                    </button>

                                )}

                            </div>


                            {resultsError && (

                                <div className="admin-empty">
                                    {resultsError}
                                </div>

                            )}


                            <form
                                className="admin-result-form"
                                onSubmit={saveResult}
                            >

                                <div className="admin-form-grid">

                                    <div className="admin-form-field">

                                        <label htmlFor="studentId">
                                            Student
                                        </label>

                                        <select
                                            id="studentId"
                                            name="studentId"
                                            value={resultForm.studentId}
                                            onChange={handleResultFormChange}
                                            disabled={Boolean(editingResult)}
                                            required={!editingResult}
                                        >

                                            <option value="">
                                                Select student
                                            </option>

                                            {students.map(
                                                (student) => (

                                                    <option
                                                        key={student.id}
                                                        value={student.id}
                                                    >
                                                        {student.name} — {student.email}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {editingResult && (

                                            <small>
                                                Student cannot be changed while editing.
                                            </small>

                                        )}

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="courseId">
                                            Course
                                        </label>

                                        <select
                                            id="courseId"
                                            name="courseId"
                                            value={resultForm.courseId}
                                            onChange={handleResultFormChange}
                                            required
                                        >

                                            <option value="">
                                                Select course
                                            </option>

                                            {courses.map(
                                                (course) => (

                                                    <option
                                                        key={course.id}
                                                        value={course.id}
                                                    >
                                                        {course.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="examName">
                                            Exam Name
                                        </label>

                                        <input
                                            id="examName"
                                            name="examName"
                                            type="text"
                                            placeholder="e.g. SSC CGL Mock Test 01"
                                            value={resultForm.examName}
                                            onChange={handleResultFormChange}
                                            required
                                        />

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="examDate">
                                            Exam Date
                                        </label>

                                        <input
                                            id="examDate"
                                            name="examDate"
                                            type="date"
                                            value={resultForm.examDate}
                                            onChange={handleResultFormChange}
                                        />

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="marksObtained">
                                            Marks Obtained
                                        </label>

                                        <input
                                            id="marksObtained"
                                            name="marksObtained"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="78"
                                            value={resultForm.marksObtained}
                                            onChange={handleResultFormChange}
                                            required
                                        />

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="totalMarks">
                                            Total Marks
                                        </label>

                                        <input
                                            id="totalMarks"
                                            name="totalMarks"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            placeholder="100"
                                            value={resultForm.totalMarks}
                                            onChange={handleResultFormChange}
                                            required
                                        />

                                    </div>


                                    <div className="admin-form-field">

                                        <label htmlFor="rank">
                                            Rank
                                        </label>

                                        <input
                                            id="rank"
                                            name="rank"
                                            type="number"
                                            min="1"
                                            step="1"
                                            placeholder="12"
                                            value={resultForm.rank}
                                            onChange={handleResultFormChange}
                                        />

                                    </div>


                                    <div className="admin-form-field admin-form-field-wide">

                                        <label htmlFor="remarks">
                                            Remarks
                                        </label>

                                        <textarea
                                            id="remarks"
                                            name="remarks"
                                            rows="4"
                                            placeholder="Add feedback for the student..."
                                            value={resultForm.remarks}
                                            onChange={handleResultFormChange}
                                        />

                                    </div>

                                </div>


                                {resultPercentage !== null && (

                                    <div className="admin-result-preview">

                                        <strong>
                                            Percentage Preview:
                                        </strong>{" "}
                                        {resultPercentage.toFixed(2)}%

                                    </div>

                                )}


                                <div className="admin-modal-actions">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >

                                        {editingResult
                                            ? <Pencil size={17} />
                                            : <Save size={17} />}

                                        {editingResult
                                            ? "Update Result"
                                            : "Save Result"}

                                    </button>


                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={resetResultForm}
                                    >
                                        Clear
                                    </button>

                                </div>

                            </form>

                        </div>


                        <div className="admin-table-card">

                            <div className="admin-table-header">

                                <div>

                                    <span className="section-label">
                                        RESULT RECORDS
                                    </span>

                                    <h2>
                                        Existing Results
                                    </h2>

                                    <p>
                                        {results.length} result
                                        {results.length === 1
                                            ? ""
                                            : "s"}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="admin-refresh"
                                    onClick={fetchResults}
                                >
                                    <RefreshCw size={17} />
                                    Refresh
                                </button>

                            </div>


                            {resultsLoading ? (

                                <div className="admin-empty">
                                    Loading results...
                                </div>

                            ) : results.length === 0 ? (

                                <div className="admin-empty">
                                    No results have been added yet.
                                </div>

                            ) : (

                                <div className="admin-results-grid">

                                    {results.map(
                                        (result) => (

                                            <article
                                                className="admin-result-card"
                                                key={result.id}
                                            >

                                                <div className="admin-result-card-header">

                                                    <div>

                                                        <span className="section-label">
                                                            {result.course?.category ||
                                                                "RESULT"}
                                                        </span>

                                                        <h3>
                                                            {result.examName}
                                                        </h3>

                                                    </div>

                                                    <span>
                                                        #{result.id}
                                                    </span>

                                                </div>


                                                <div className="admin-result-student">

                                                    <strong>
                                                        {result.student?.name ||
                                                            "Unknown Student"}
                                                    </strong>

                                                    <small>
                                                        {result.student?.email || ""}
                                                    </small>

                                                </div>


                                                <div className="admin-result-course">

                                                    <BookOpen size={16} />

                                                    <span>
                                                        {result.course?.name ||
                                                            "Unknown Course"}
                                                    </span>

                                                </div>


                                                <div className="admin-result-metrics">

                                                    <div>

                                                        <span>
                                                            Marks
                                                        </span>

                                                        <strong>
                                                            {result.marksObtained}
                                                            {" / "}
                                                            {result.totalMarks}
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Percentage
                                                        </span>

                                                        <strong>
                                                            {Number(
                                                                result.percentage || 0
                                                            ).toFixed(2)}
                                                            %
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Rank
                                                        </span>

                                                        <strong>
                                                            {result.rank ??
                                                                "—"}
                                                        </strong>

                                                    </div>

                                                </div>


                                                <div className="admin-result-meta">

                                                    <span>
                                                        Exam Date:{" "}
                                                        {result.examDate
                                                            ? new Date(
                                                                `${result.examDate}T00:00:00`
                                                            ).toLocaleDateString()
                                                            : "—"}
                                                    </span>

                                                </div>


                                                {result.remarks && (

                                                    <div className="admin-result-remarks">

                                                        <span>
                                                            Remarks
                                                        </span>

                                                        <p>
                                                            {result.remarks}
                                                        </p>

                                                    </div>

                                                )}


                                                <div className="admin-result-actions">

                                                    <button
                                                        type="button"
                                                        className="btn btn-light"
                                                        onClick={() =>
                                                            startEditingResult(
                                                                result
                                                            )
                                                        }
                                                    >
                                                        <Pencil size={16} />
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="admin-delete-result"
                                                        onClick={() =>
                                                            deleteResult(
                                                                result.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </section>

                )}



                {/* =================================================
    STUDENT MANAGEMENT
================================================= */}

                {activeTab === "students" && (

                    <section className="admin-results">

                        <div className="admin-table-card">

                            <div className="admin-table-header">

                                <div>

                                    <span className="section-label">
                                        STUDENT MANAGEMENT
                                    </span>

                                    <h2>
                                        Registered Students
                                    </h2>

                                    <p>
                                        {registeredStudents.length} student
                                        {registeredStudents.length === 1
                                            ? ""
                                            : "s"} registered with Sigma Classes.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="admin-refresh"
                                    onClick={fetchRegisteredStudents}
                                >
                                    <RefreshCw size={17} />
                                    Refresh
                                </button>

                            </div>


                            {/* SEARCH */}

                            <div className="admin-toolbar">

                                <div className="admin-search">

                                    <Search size={17} />

                                    <input
                                        type="text"
                                        placeholder="Search by name, email or phone..."
                                        value={studentSearch}
                                        onChange={(event) =>
                                            setStudentSearch(
                                                event.target.value
                                            )
                                        }
                                    />

                                    {studentSearch && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStudentSearch("")
                                            }
                                            aria-label="Clear student search"
                                        >
                                            <X size={16} />
                                        </button>

                                    )}

                                </div>

                            </div>


                            {studentsError && (

                                <div className="admin-empty">
                                    {studentsError}
                                </div>

                            )}


                            {studentsLoading ? (

                                <div className="admin-empty">
                                    Loading students...
                                </div>

                            ) : registeredStudents.length === 0 ? (

                                <div className="admin-empty">
                                    No students have registered yet.
                                </div>

                            ) : (

                                <div className="admin-table-wrapper">

                                    <table className="admin-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Student
                                                </th>

                                                <th>
                                                    Phone
                                                </th>

                                                <th>
                                                    Enrollments
                                                </th>

                                                <th>
                                                    Registered
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {registeredStudents
                                                .filter((student) => {

                                                    const query =
                                                        studentSearch
                                                            .toLowerCase()
                                                            .trim();

                                                    if (!query) {
                                                        return true;
                                                    }

                                                    return (
                                                        student.name
                                                            ?.toLowerCase()
                                                            .includes(query) ||

                                                        student.email
                                                            ?.toLowerCase()
                                                            .includes(query) ||

                                                        student.phone
                                                            ?.toLowerCase()
                                                            .includes(query)
                                                    );

                                                })
                                                .map((student) => {

                                                    const enrollmentCount =
                                                        enrollments.filter(
                                                            (enrollment) =>
                                                                enrollment.student?.id ===
                                                                student.id
                                                        ).length;

                                                    return (

                                                        <tr
                                                            key={student.id}
                                                            className="admin-row"
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setDeleteStudentError("");
                                                            }}
                                                        >

                                                            <td>

                                                                <strong>
                                                                    {student.name}
                                                                </strong>

                                                                <small>
                                                                    {student.email}
                                                                </small>

                                                            </td>


                                                            <td>

                                                                <a
                                                                    href={`tel:${student.phone}`}
                                                                    className="admin-phone"
                                                                    onClick={(event) => event.stopPropagation()}
                                                                >
                                                                    <Phone size={14} />
                                                                    {student.phone}
                                                                </a>

                                                            </td>


                                                            <td>

                                                                <strong>
                                                                    {enrollmentCount}
                                                                </strong>

                                                            </td>


                                                            <td>

                                                                {student.createdAt
                                                                    ? new Date(
                                                                        student.createdAt
                                                                    ).toLocaleDateString()
                                                                    : "—"}

                                                            </td>

                                                        </tr>

                                                    );

                                                })}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </section>

                )}



            </div>

            {/* ===================================================
    STUDENT DETAILS MODAL
=================================================== */}

            {selectedStudent && (

                <div
                    className="admin-modal-overlay"
                    onClick={() => {
                        setSelectedStudent(null);
                        setDeleteStudentError("");
                    }}
                >

                    <div
                        className="admin-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="admin-modal-header">

                            <div>

                                <span className="section-label">
                                    STUDENT DETAILS
                                </span>

                                <h2>
                                    {selectedStudent.name}
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() =>
                                    setSelectedStudent(null)
                                }
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* STUDENT INFORMATION */}

                        <div className="admin-detail-grid">

                            <div>
                                <span>Name</span>

                                <strong>
                                    {selectedStudent.name}
                                </strong>
                            </div>


                            <div>
                                <span>Email</span>

                                <strong>
                                    {selectedStudent.email}
                                </strong>
                            </div>


                            <div>
                                <span>Phone</span>

                                <a
                                    href={`tel:${selectedStudent.phone}`}
                                >
                                    {selectedStudent.phone}
                                </a>
                            </div>


                            <div>
                                <span>Registered</span>

                                <strong>
                                    {selectedStudent.createdAt
                                        ? new Date(
                                            selectedStudent.createdAt
                                        ).toLocaleDateString()
                                        : "—"}
                                </strong>
                            </div>

                        </div>


                        {/* ENROLLMENTS */}

                        <div className="student-modal-enrollments">

                            <span className="section-label">
                                COURSE ENROLLMENTS
                            </span>

                            <h3>
                                Enrolled Courses
                            </h3>


                            {enrollments.filter(
                                (enrollment) =>
                                    enrollment.student?.id ===
                                    selectedStudent.id
                            ).length === 0 ? (

                                <div className="admin-empty">
                                    No course enrollments found.
                                </div>

                            ) : (

                                <div className="student-enrollment-list">

                                    {enrollments
                                        .filter(
                                            (enrollment) =>
                                                enrollment.student?.id ===
                                                selectedStudent.id
                                        )
                                        .map((enrollment) => (

                                            <div
                                                className="student-enrollment-item"
                                                key={enrollment.id}
                                            >

                                                <div>

                                                    <strong>
                                                        {enrollment.course?.name ||
                                                            "Unknown Course"}
                                                    </strong>

                                                    <small>
                                                        {enrollment.enrolledAt
                                                            ? `Enrolled on ${new Date(
                                                                enrollment.enrolledAt
                                                            ).toLocaleDateString()}`
                                                            : ""}
                                                    </small>

                                                </div>


                                                <span
                                                    className={`student-enrollment-status status-${(
                                                        enrollment.status ||
                                                        "UNKNOWN"
                                                    ).toLowerCase()}`}
                                                >
                                                    {enrollment.status ||
                                                        "UNKNOWN"}
                                                </span>

                                            </div>

                                        ))}

                                </div>

                            )}

                        </div>
                        <div className="admin-modal-actions">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleEditStudent(selectedStudent)}
                            >
                                <Pencil size={17} />
                                Edit Student
                            </button>

                            <button
                                type="button"
                                className="student-delete-btn"
                                onClick={() => deleteStudent(selectedStudent)}
                                disabled={deleteStudentLoading}
                            >
                                <Trash2 size={17} />
                                {deleteStudentLoading ? "Deleting..." : "Delete Student"}
                            </button>
                        </div>

                        {deleteStudentError && (
                            <div className="admin-error">
                                {deleteStudentError}
                            </div>
                        )}


                    </div>

                </div>

            )}
            {/* ===================================================
          STUDENT DETAILS MODAL
      =================================================== */}

            {selectedEnquiry && (

                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        setSelectedEnquiry(null)
                    }
                >

                    <div
                        className="admin-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        <div className="admin-modal-header">

                            <div>

                                <span className="section-label">
                                    ENQUIRY DETAILS
                                </span>

                                <h2>
                                    {selectedEnquiry.name}
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() =>
                                    setSelectedEnquiry(null)
                                }
                                aria-label="Close"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        <div className="admin-detail-grid">


                            <div>

                                <span>
                                    Phone
                                </span>

                                <a
                                    href={`tel:${selectedEnquiry.phone}`}
                                >
                                    {selectedEnquiry.phone}
                                </a>

                            </div>


                            <div>

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {selectedEnquiry.email || "—"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Course
                                </span>

                                <strong>
                                    {selectedEnquiry.course || "—"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Target Exam
                                </span>

                                <strong>
                                    {selectedEnquiry.targetExam || "—"}
                                </strong>

                            </div>


                        </div>


                        <div className="admin-detail-message">

                            <span>
                                Message
                            </span>

                            <p>
                                {selectedEnquiry.message ||
                                    "No message provided."}
                            </p>

                        </div>


                        <div className="admin-modal-actions">


                            <a
                                href={`tel:${selectedEnquiry.phone}`}
                                className="btn btn-primary"
                            >

                                <Phone size={17} />

                                Call Student

                            </a>


                            <a
                                href={`https://wa.me/${selectedEnquiry.phone.replace(
                                    /\D/g,
                                    ""
                                )}?text=${encodeURIComponent(
                                    `Hello ${selectedEnquiry.name}, this is Sigma Classes. We received your enquiry and wanted to get in touch regarding your course enquiry.`
                                )}`}
                                className="btn btn-light"
                                target="_blank"
                                rel="noreferrer"
                            >

                                <MessageCircle size={17} />

                                WhatsApp

                            </a>


                        </div>


                    </div>

                </div>

            )}

            {/* ===================================================
    EDIT STUDENT MODAL
=================================================== */}

            {editingStudent && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => setEditingStudent(null)}
                >
                    <div
                        className="admin-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="admin-modal-header">
                            <div>
                                <span className="section-label">EDIT STUDENT</span>
                                <h2>Update Student</h2>
                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() => setEditingStudent(null)}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={updateStudent}>
                            <div className="admin-form-grid">

                                <div className="admin-form-group">
                                    <label htmlFor="edit-student-name">
                                        Full Name
                                    </label>

                                    <input
                                        id="edit-student-name"
                                        type="text"
                                        value={editStudentForm.name}
                                        onChange={(event) =>
                                            setEditStudentForm({
                                                ...editStudentForm,
                                                name: event.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label htmlFor="edit-student-email">
                                        Email
                                    </label>

                                    <input
                                        id="edit-student-email"
                                        type="email"
                                        value={editStudentForm.email}
                                        onChange={(event) =>
                                            setEditStudentForm({
                                                ...editStudentForm,
                                                email: event.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label htmlFor="edit-student-phone">
                                        Phone
                                    </label>

                                    <input
                                        id="edit-student-phone"
                                        type="tel"
                                        value={editStudentForm.phone}
                                        onChange={(event) =>
                                            setEditStudentForm({
                                                ...editStudentForm,
                                                phone: event.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                            </div>

                            {studentUpdateError && (
                                <div className="admin-error">
                                    {studentUpdateError}
                                </div>
                            )}

                            <div className="admin-modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={() => setEditingStudent(null)}
                                    disabled={studentUpdateLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={studentUpdateLoading}
                                >
                                    {studentUpdateLoading ? (
                                        "Updating..."
                                    ) : (
                                        <>
                                            <Save size={17} />
                                            Update Student
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    );
}


export default Admin;