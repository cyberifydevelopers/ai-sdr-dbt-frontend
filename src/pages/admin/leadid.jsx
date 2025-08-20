import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const App = () => {
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({ name: "", id: null });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/get/use_leadid", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch leads");
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/use_leadid", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name }),
      });
      if (!response.ok) throw new Error("Failed to create lead");
      setFormData({ name: "", id: null });
      setShowForm(false);
      setIsEditing(false);
      fetchLeads();
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  const handleEdit = (lead) => {
    setFormData({ name: lead.name, id: lead.id });
    setShowForm(true);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/use_leadid/${formData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: formData.name }),
        }
      );
      if (!response.ok) throw new Error("Failed to update lead");
      setFormData({ name: "", id: null });
      setShowForm(false);
      setIsEditing(false);
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/use_leadid/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete lead");
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleView = (id) => {
    navigate(`/admin/lead/${id}`);
  };

  const totalLeads = leads.length;
  const lastCreated = leads.length > 0 ? leads[leads.length - 1] : null;

  return (
    <div
      className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:px-[150px] lg:py-10 xl:px-[150px] xl:py-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            List Dashboard
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700 mb-2">
              Total List
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {totalLeads}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700 mb-2">
              Last Created
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 truncate">
              {lastCreated
                ? `${lastCreated.name} (${lastCreated.created_at})`
                : "No leads yet"}
            </p>
          </div>
        </div>

        {/* Create Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setIsEditing(false);
              setFormData({ name: "", id: null });
            }}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2 shadow-md text-sm sm:text-base"
          >
            {showForm ? "Cancel" : "Create List"}
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"}
              />
            </svg>
          </button>
        </div>

        {/* Create/Edit Form with Blur Backdrop */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xs sm:max-w-md">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700 mb-4">
                {isEditing ? "Edit Lead" : "Create Lead"}
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Lead Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 w-full text-sm sm:text-base"
                  aria-label="Lead Name"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-600 hover:text-gray-800 px-3 sm:px-4 py-2 rounded-lg transition duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isEditing ? handleUpdate : handleCreate}
                    className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
                  >
                    {isEditing ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal with Blur Backdrop */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Confirm Delete
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-6">
                Are you sure you want to delete this lead?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-600 hover:text-gray-800 px-3 sm:px-4 py-2 rounded-lg transition duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm sm:text-base"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Leads List (Table) */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700">
              Lists
            </h2>
          </div>
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="hidden sm:table-row">
                <th className="p-4 sm:p-6 text-left font-semibold text-gray-700 w-[25%]">ID</th>
                <th className="p-4 sm:p-6 text-left font-semibold text-gray-700 w-[30%]">Name</th>
                <th className="p-4 sm:p-6 text-left font-semibold text-gray-700 w-[30%]">Created At</th>
                <th className="p-4 sm:p-6 text-left font-semibold text-gray-700 w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition duration-200 block sm:table-row">
                  <td className="p-4 sm:p-6 block sm:table-cell">
                    <span className="sm:hidden font-semibold">ID: </span>
                    {lead.id}
                  </td>
                  <td className="p-4 sm:p-6 block sm:table-cell">
                    <span className="sm:hidden font-semibold">Name: </span>
                    {lead.name}
                  </td>
                  <td className="p-4 sm:p-6 block sm:table-cell text-gray-600">
                    <span className="sm:hidden font-semibold">Created At: </span>
                    {lead.created_at}
                  </td>
                  <td className="p-4 sm:p-6 block sm:table-cell">
                    <span className="sm:hidden font-semibold">Actions: </span>
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleView(lead.id)}
                        className="text-blue-600 hover:text-blue-800 transition duration-200 p-2"
                        aria-label="View lead"
                      >
                        <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(lead)}
                        className="text-blue-600 hover:text-blue-800 transition duration-200 p-2"
                        aria-label="Edit lead"
                      >
                        <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(lead.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-700 transition duration-200 p-2"
                        aria-label="Delete lead"
                      >
                        <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;