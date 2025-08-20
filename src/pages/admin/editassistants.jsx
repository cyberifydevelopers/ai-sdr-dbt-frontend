import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { voiceset2, voiceset3 } from "../../helpers/data.js";

// Color scheme
const colors = {
  primary: "#4F46E5", // Indigo
  secondary: "#10B981", // Emerald
  danger: "#EF4444", // Red
  text: "#374151", // Gray-700
  lightText: "#6B7280", // Gray-500
  border: "#E5E7EB", // Gray-200
  background: "#F9FAFB", // Gray-50
  card: "#FFFFFF", // White
  hover: "#F9FAFB", // Gray-50
  radioSelected: "#1F2937", // Gray-800 for radio button effect
  radioBorder: "#374151", // Gray-700 for radio button border
};

const EditAssistant = () => {
  const { assistantId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    system_prompt: "",
    first_message: "",
    files: null,
    existing_file_urls: [],
    voice: "",
    voiceSet: "all",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    system_prompt: "",
    first_message: "",
    files: "",
    voice: "",
  });
  const [loading, setLoading] = useState(true);
  const audioInstance = useRef(null);

  // Combine and sort voiceset2 and voiceset3
  const allVoices = [...voiceset2, ...voiceset3].sort((a, b) =>
    a.showName.localeCompare(b.showName)
  );

  // Fetch assistant data
  useEffect(() => {
    const fetchAssistant = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/api/admin/getassistant",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(
              "Access denied: Invalid or insufficient permissions"
            );
          } else if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again");
          } else {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }

        const data = await response.json();
        const assistant = data.assistants.find(
          (a) => a.assistant_id === assistantId
        );
        if (!assistant) {
          throw new Error("Assistant not found");
        }

        setFormData({
          name: assistant.name || "",
          phone: assistant.phone || "",
          system_prompt: assistant.system_prompt || "",
          first_message: assistant.first_message || "",
          files: null,
          existing_file_urls: assistant.file_urls || [],
          voice: assistant.voice || "",
          voiceSet: "all",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assistant:", error.message);
        toast.error(error.message);
        navigate("/");
      }
    };

    fetchAssistant();
  }, [assistantId, navigate]);

  // Automatic voice selection when voiceSet changes or entering Step 2
  useEffect(() => {
    if (currentStep === 2 && !formData.voice) {
      const filteredVoices = allVoices.filter((voice) =>
        formData.voiceSet === "voiceset1"
          ? voiceset2.includes(voice)
          : formData.voiceSet === "voiceset2"
          ? voiceset3.includes(voice)
          : true
      );
      if (filteredVoices.length > 0 && filteredVoices[0]?.name) {
        setFormData((prev) => ({
          ...prev,
          voice: filteredVoices[0].name,
        }));
        setErrors((prev) => ({ ...prev, voice: "" }));
      }
    }
  }, [formData.voiceSet, currentStep]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, files: e.target.files }));
    setErrors((prev) => ({ ...prev, files: "" }));
  };

  const validateStep1 = () => {
    const newErrors = { ...errors };
    let isValid = true;
    const phoneRegex = /^\+\d{10,15}$/;
    const allowedFileTypes = ["text/plain", "application/pdf", "text/csv"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

    if (!formData.name.trim()) {
      newErrors.name = "Please enter an assistant name";
      isValid = false;
    }
    if (!formData.phone) {
      newErrors.phone = "Please select a phone number";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone =
        "Phone number must be in international format (e.g., +1234567890)";
      isValid = false;
    }
    if (!formData.system_prompt.trim()) {
      newErrors.system_prompt = "Please enter a system prompt";
      isValid = false;
    }
    if (!formData.first_message.trim()) {
      newErrors.first_message = "Please enter a first message";
      isValid = false;
    }
    if (formData.files && formData.files.length > 0) {
      for (let i = 0; i < formData.files.length; i++) {
        if (!allowedFileTypes.includes(formData.files[i].type)) {
          newErrors.files = "Only .txt, .pdf, and .csv files are allowed";
          isValid = false;
          break;
        }
        if (formData.files[i].size > maxFileSize) {
          newErrors.files = "Each file must be under 5MB";
          isValid = false;
          break;
        }
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors = { ...errors };
    let isValid = true;
    if (!formData.voice) {
      newErrors.voice = "Please select a voice";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handlePlayVoice = (audioSr) => {
    if (audioInstance.current) {
      audioInstance.current.pause();
      audioInstance.current = null;
      setIsAudioPlaying(false);
    }
    const audio = new Audio(audioSr);
    audioInstance.current = audio;
    setIsAudioPlaying(true);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      toast.error("Failed to play voice preview");
      setIsAudioPlaying(false);
    });
    audio.onended = () => {
      setIsAudioPlaying(false);
      audioInstance.current = null;
    };
  };

  const handleStopVoice = () => {
    if (audioInstance.current) {
      audioInstance.current.pause();
      audioInstance.current = null;
      setIsAudioPlaying(false);
    }
  };

  const handleStepChange = (step) => {
    if (step === currentStep) return;
    setCurrentStep(step);
    handleStopVoice();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate both steps on submit
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();

    if (!isStep1Valid) {
      setCurrentStep(1); // Switch to Step 1 if it has errors
      return;
    }
    if (!isStep2Valid) {
      setCurrentStep(2); // Switch to Step 2 if it has errors
      return;
    }

    setIsSubmitting(true);
    handleStopVoice();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("assistantName", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("systemPrompt", formData.system_prompt);
      formDataToSend.append("firstMessage", formData.first_message);
      formDataToSend.append("voice", formData.voice);
      if (formData.files) {
        for (let i = 0; i < formData.files.length; i++) {
          formDataToSend.append("files", formData.files[i]);
        }
      }
      if (formData.existing_file_urls.length > 0) {
        formDataToSend.append(
          "file_urls",
          JSON.stringify(formData.existing_file_urls)
        );
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(
        `http://localhost:8000/api/admin/update/assistant/${assistantId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("Assistant updated successfully!");
      navigate("/admin/assistants");
    } catch (error) {
      console.error("Error updating assistant:", error.message);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="mb-8 bg-white rounded-xl shadow-sm border py-4 px-6 text-center"
          style={{ borderColor: colors.border }}
        >
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            Edit Assistant
          </h1>
        </div>
        {/* Stepper Navigation */}
        <div className="mb-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleStepChange(1)}
            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
              currentStep === 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Step 1: Assistant Details
          </button>
          <button
            type="button"
            onClick={() => handleStepChange(2)}
            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
              currentStep === 2
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Step 2: Voice Selection
          </button>
        </div>
        <div
          className="rounded-xl shadow-md border p-8 transition-transform hover:scale-[1.01]"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <form onSubmit={handleSubmit} noValidate>
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="flex items-center gap-2 text-lg font-semibold mb-2"
                    style={{ color: colors.text }}
                  >
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Assistant Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    style={{
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.card,
                    }}
                    placeholder="Enter assistant name (e.g., SupportBot)"
                  />
                  {errors.name && (
                    <p
                      className="text-sm mt-2 flex items-center gap-1"
                      style={{ color: colors.danger }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-lg font-semibold mb-2"
                    style={{ color: colors.text }}
                  >
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Phone Number
                  </label>
                  <select
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    style={{
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.card,
                    }}
                  >
                    <option value="">Select a phone number</option>
                    <option value="+1234567890">+1234567890 (Demo)</option>
                    <option value="+1987654321">+1987654321</option>
                    <option value="+1123456789">+1123456789</option>
                  </select>
                  {errors.phone && (
                    <p
                      className="text-sm mt-2 flex items-center gap-1"
                      style={{ color: colors.danger }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="mb-6 md:col-span-2">
                  <label
                    htmlFor="system_prompt"
                    className="flex items-center gap-2 text-lg font-semibold mb-2"
                    style={{ color: colors.text }}
                  >
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4h.01M19 16h-4v-4h.01M12 16V8"
                      />
                    </svg>
                    System Prompt
                  </label>
                  <textarea
                    id="system_prompt"
                    value={formData.system_prompt}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    style={{
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.card,
                    }}
                    placeholder="Enter system prompt"
                    rows="5"
                  ></textarea>
                  {errors.system_prompt && (
                    <p
                      className="text-sm mt-2 flex items-center gap-1"
                      style={{ color: colors.danger }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.system_prompt}
                    </p>
                  )}
                </div>
                <div className="mb-6 md:col-span-2">
                  <label
                    htmlFor="first_message"
                    className="flex items-center gap-2 text-lg font-semibold mb-2"
                    style={{ color: colors.text }}
                  >
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4h.01M19 16h-4v-4h.01M12 16V8"
                      />
                    </svg>
                    First Message
                  </label>
                  <textarea
                    id="first_message"
                    value={formData.first_message}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    style={{
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.card,
                    }}
                    placeholder="Enter the assistant's first message"
                    rows="3"
                  ></textarea>
                  {errors.first_message && (
                    <p
                      className="text-sm mt-2 flex items-center gap-1"
                      style={{ color: colors.danger }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.first_message}
                    </p>
                  )}
                </div>
                <div className="mb-6 md:col-span-2">
                  <label
                    htmlFor="files"
                    className="flex items-center gap-2 text-lg font-semibold mb-2"
                    style={{ color: colors.text }}
                  >
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    Add New Files (Optional)
                  </label>
                  <input
                    type="file"
                    id="files"
                    multiple
                    accept=".txt,.pdf,.csv"
                    onChange={handleFileChange}
                    className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    style={{
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.card,
                    }}
                  />
                  {errors.files && (
                    <p
                      className="text-sm mt-2 flex items-center gap-1"
                      style={{ color: colors.danger }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.files}
                    </p>
                  )}
                  <p
                    className="text-sm mt-2"
                    style={{ color: colors.lightText }}
                  >
                    Supported formats: .txt, .pdf, .csv (max 5MB per file)
                  </p>
                  {formData.existing_file_urls.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium" style={{ color: colors.text }}>
                        Existing Files:
                      </p>
                      <ul className="list-disc pl-5">
                        {formData.existing_file_urls.map((url, index) => (
                          <li key={index}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm"
                              style={{ color: colors.primary }}
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <label
                  htmlFor="voice"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                  style={{ color: colors.text }}
                >
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  Voice Selection
                </label>
                <div className="mb-6">
                  <select
                    id="voiceSet"
                    value={formData.voiceSet}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        voiceSet: e.target.value,
                        voice: "",
                      }));
                      setErrors((prev) => ({ ...prev, voice: "" }));
                      handleStopVoice();
                    }}
                    className="w-full md:w-64 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    style={{
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.card,
                    }}
                  >
                    <option value="all">All Voices</option>
                    <option value="voiceset1">Voice Set 1</option>
                    <option value="voiceset2">Voice Set 2</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allVoices
                    .filter((voice) =>
                      formData.voiceSet === "voiceset1"
                        ? voiceset2.includes(voice)
                        : formData.voiceSet === "voiceset2"
                        ? voiceset3.includes(voice)
                        : true
                    )
                    .map((voice) =>
                      voice && voice.name ? (
                        <div
                          key={voice.name}
                          className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                            formData.voice === voice.name
                              ? "border-gray-800 bg-gray-50"
                              : "border-gray-300 hover:bg-gray-100"
                          }`}
                          style={{
                            borderColor:
                              formData.voice === voice.name
                                ? colors.radioBorder
                                : colors.border,
                            backgroundColor:
                              formData.voice === voice.name
                                ? colors.hover
                                : colors.card,
                          }}
                          onClick={() => {
                            console.log("Selected voice:", voice);
                            setFormData((prev) => ({
                              ...prev,
                              voice: voice.name,
                            }));
                            setErrors((prev) => ({ ...prev, voice: "" }));
                          }}
                        >
                          <div className="absolute top-3 left-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                formData.voice === voice.name
                                  ? "border-gray-800 bg-gray-800"
                                  : "border-gray-400"
                              }`}
                              style={{
                                borderColor:
                                  formData.voice === voice.name
                                    ? colors.radioBorder
                                    : colors.border,
                                backgroundColor:
                                  formData.voice === voice.name
                                    ? colors.radioSelected
                                    : "transparent",
                              }}
                            >
                              {formData.voice === voice.name && (
                                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                          <div className="ml-8 flex justify-between items-center">
                            <div>
                              <h3
                                className="font-semibold text-lg"
                                style={{ color: colors.text }}
                              >
                                {voice.showName || "Unnamed Voice"}
                              </h3>
                              <p
                                className="text-sm"
                                style={{ color: colors.lightText }}
                              >
                                {voice.gender || "Unknown"}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayVoice(voice.audioSr || "");
                                }}
                                disabled={
                                  isAudioPlaying &&
                                  formData.voice !== voice.name
                                }
                                className="p-2.5 rounded-full transition-colors hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                  backgroundColor: colors.secondary,
                                  color: "white",
                                }}
                                title={
                                  isAudioPlaying &&
                                  formData.voice !== voice.name
                                    ? "Audio playing"
                                    : "Play voice preview"
                                }
                              >
                                {isAudioPlaying &&
                                formData.voice === voice.name ? (
                                  <svg
                                    className="w-5 h-5 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.752 11.168l-3.197-2.2A1 1 0 0010 9.8v4.4a1 1 0 001.555.832l3.197-2.2a1 1 0 000-1.664z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStopVoice();
                                }}
                                disabled={
                                  !isAudioPlaying ||
                                  formData.voice !== voice.name
                                }
                                className="p-2.5 rounded-full transition-colors hover:bg-red-600 disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                  backgroundColor: colors.danger,
                                  color: "white",
                                }}
                                title="Stop voice preview"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 9h6v6H9z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                </div>
                {errors.voice && (
                  <p
                    className="text-sm mt-2 flex items-center gap-1"
                    style={{ color: colors.danger }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.voice}
                  </p>
                )}
              </div>
            )}
            <div className="flex justify-between mt-6">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => handleStepChange(1)}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-gray-300"
                  style={{ backgroundColor: colors.border, color: colors.text }}
                >
                  Back
                </button>
              )}
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={() => handleStepChange(2)}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-indigo-700 ml-auto"
                  style={{ backgroundColor: colors.primary, color: "white" }}
                >
                  Next
                </button>
              )}
              {currentStep === 2 && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.primary, color: "white" }}
                >
                  {isSubmitting ? "Updating..." : "Update Assistant"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAssistant;
