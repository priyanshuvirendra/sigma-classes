import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    targetExam: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate Indian mobile number
    const phone = formData.phone.trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      // Save enquiry in backend
      const response = await fetch(
        "http://localhost:8080/api/enquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      // WhatsApp message
      const whatsappMessage = `
Hello Sigma Classes,

I have submitted an enquiry.

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || "Not provided"}
Interested Course: ${formData.course}
Target Examination: ${formData.targetExam || "Not specified"}
Message: ${formData.message || "No additional message"}

Please contact me regarding the course.
      `.trim();

      const whatsappUrl = `https://wa.me/919471268826?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      // Show success screen
      setSubmitted(true);
    } catch (error) {
      console.error("Enquiry submission failed:", error);

      alert(
        "Unable to submit your enquiry. Please try again."
      );
    }
  };

  if (submitted) {
    return (
      <div className="enquiry-success">
        <CheckCircle2 size={42} />

        <h3>Thank you!</h3>

        <p>
          Your enquiry has been received. Our counsellor will
          contact you shortly.
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setSubmitted(false);

            setFormData({
              name: "",
              phone: "",
              email: "",
              course: "",
              targetExam: "",
              message: "",
            });
          }}
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      className="enquiry-form"
      onSubmit={handleSubmit}
    >
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your 10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            maxLength="10"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="course">
            Interested Course
          </label>

          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">
              Select a course
            </option>

            <option value="ssc-cgl">
              SSC CGL
            </option>

            <option value="ssc-chsl">
              SSC CHSL
            </option>

            <option value="banking-exams">
              Banking Exams
            </option>

            <option value="bpsc">
              BPSC
            </option>

            <option value="other">
              Other
            </option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="targetExam">
          Target Examination
        </label>

        <select
          id="targetExam"
          name="targetExam"
          value={formData.targetExam}
          onChange={handleChange}
        >
          <option value="">
            Select your target exam
          </option>

          <option value="ssc-cgl">
            SSC CGL
          </option>

          <option value="ssc-chsl">
            SSC CHSL
          </option>

          <option value="sbi-po">
            SBI PO
          </option>

          <option value="ibps-po">
            IBPS PO
          </option>

          <option value="ibps-clerk">
            IBPS Clerk
          </option>

          <option value="rrb">
            RRB
          </option>

          <option value="bpsc">
            BPSC
          </option>

          <option value="other">
            Other
          </option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="message">
          Message
        </label>

        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="Tell us what you need help with..."
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary enquiry-submit"
      >
        Submit Enquiry
        <Send size={17} />
      </button>
    </form>
  );
}

export default EnquiryForm;