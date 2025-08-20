import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPhone } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const LeadDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastLead, setLastLead] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileno: "",
    custom_field_1: "",
    custom_field_2: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editLeadId, setEditLeadId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLeadId, setDeleteLeadId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || null;
  };

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error("No auth token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/admin/use_lead/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLeads(data.lead_ids || []);
        if (data.lead_ids && data.lead_ids.length > 0) {
          setLastLead(data.lead_ids[data.lead_ids.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      console.error("No auth token found. Please log in.");
      return;
    }

    try {
      let response;
      if (isEditMode) {
        // Update existing lead
        response = await fetch(
          `http://localhost:8000/api/admin/use_lead/${editLeadId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Create new lead
        response = await fetch(`http://localhost:8000/api/admin/use_lead/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedLead = await response.json();
      if (isEditMode) {
        setLeads(
          leads.map((lead) =>
            lead.id === editLeadId ? { ...lead, ...updatedLead } : lead
          )
        );
        setLastLead(updatedLead);
      } else {
        setLeads([...leads, updatedLead]);
        setLastLead(updatedLead);
      }

      // Reset form and close
      setFormData({
        name: "",
        email: "",
        mobileno: "",
        custom_field_1: "",
        custom_field_2: "",
      });
      setShowForm(false);
      setIsEditMode(false);
      setEditLeadId(null);
      console.log(
        isEditMode ? "Lead updated successfully!" : "Lead created successfully!"
      );
    } catch (error) {
      console.error(
        isEditMode ? "Error updating lead:" : "Error creating lead:",
        error
      );
    }
  };

  // Handle edit action
  const handleEditLead = (lead) => {
    setFormData({
      name: lead.name,
      email: lead.email,
      mobileno: lead.mobileno,
      custom_field_1: lead.custom_field_1,
      custom_field_2: lead.custom_field_2,
    });
    setIsEditMode(true);
    setEditLeadId(lead.id);
    setShowForm(true);
  };

  // Handle delete action
  const handleDeleteLead = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error("No auth token found. Please log in.");
      setShowDeleteModal(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/remove_lead/${deleteLeadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setLeads(leads.filter((lead) => lead.id !== deleteLeadId));
      setShowDeleteModal(false);
      setDeleteLeadId(null);
      console.log("Lead deleted successfully!");
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  // Handle call action
  const handleCallLead = (mobileNo) => {
    if (mobileNo) {
      window.location.href = `tel:${mobileNo}`;
    } else {
      console.error("No mobile number available for this lead.");
    }
  };

  // Navigate to CSV upload page
  const handleCSVUpload = () => {
    navigate("/admin/upload-csv");
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* First Section: Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 transition-transform transform hover:scale-105">
          <h2 className="text-xl font-bold text-gray-800">Total Leads</h2>
          <p className="text-4xl font-semibold text-blue-600">
            {loading ? "Loading..." : leads.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 transition-transform transform hover:scale-105">
          <h2 className="text-xl font-bold text-gray-800">Last Created Lead</h2>
          <p className="text-lg text-gray-600">
            {loading
              ? "Loading..."
              : lastLead
              ? `${lastLead.name} (${new Date().toLocaleDateString()})`
              : "No leads yet"}
          </p>
        </div>
      </div>

      {/* Second Section: Buttons */}
      <div className="flex justify-end gap-4 mb-10">
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setFormData({
                name: "",
                email: "",
                mobileno: "",
                custom_field_1: "",
                custom_field_2: "",
              });
              setIsEditMode(false);
              setEditLeadId(null);
            }
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          {showForm ? "Cancel" : "Create Lead"}
        </button>
        <button
          onClick={handleCSVUpload}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Upload CSV
        </button>
      </div>

      {/* Form for Creating/Editing Lead */}
      {showForm && (
        <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditMode ? "Edit Lead" : "Create New Lead"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="text"
              name="mobileno"
              value={formData.mobileno}
              onChange={handleInputChange}
              placeholder="Mobile No"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="text"
              name="custom_field_1"
              value={formData.custom_field_1}
              onChange={handleInputChange}
              placeholder="Custom Field 1"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="text"
              name="custom_field_2"
              value={formData.custom_field_2}
              onChange={handleInputChange}
              placeholder="Custom Field 2"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            {isEditMode ? "Update" : "Submit"}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this lead? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteLeadId(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLead}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-600 text-lg">
          Loading leads...
        </div>
      ) : (
        <>
          {/* Table View (XL screens and above) */}
          <div className="hidden xl:block overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-800">
                  <th className="p-4 text-left font-bold">Name</th>
                  <th className="p-4 text-left font-bold">Email</th>
                  <th className="p-4 text-left font-bold">Mobile No</th>
                  <th className="p-4 text-left font-bold">Custom Field 1</th>
                  <th className="p-4 text-left font-bold">Custom Field 2</th>
                  <th className="p-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-700">{lead.name}</td>
                    <td className="p-4 text-gray-700">{lead.email}</td>
                    <td className="p-4 text-gray-700">{lead.mobileno}</td>
                    <td className="p-4 text-gray-700">{lead.custom_field_1}</td>
                    <td className="p-4 text-gray-700">{lead.custom_field_2}</td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setDeleteLeadId(lead.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleCallLead(lead.mobileno)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaPhone />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Below XL) */}
          <div className="xl:hidden space-y-6">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500"
              >
                <p className="text-gray-700 mb-2">
                  <strong className="text-gray-800 font-semibold">Name:</strong>{" "}
                  {lead.name}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-gray-800 font-semibold">
                    Email:
                  </strong>{" "}
                  {lead.email}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-gray-800 font-semibold">
                    Mobile No:
                  </strong>{" "}
                  {lead.mobileno}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-gray-800 font-semibold">
                    Custom Field 1:
                  </strong>{" "}
                  {lead.custom_field_1}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-gray-800 font-semibold">
                    Custom Field 2:
                  </strong>{" "}
                  {lead.custom_field_2}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEditLead(lead)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setDeleteLeadId(lead.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleCallLead(lead.mobileno)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaPhone />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LeadDashboard;
