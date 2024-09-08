import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../axios/api";

const ShowRoleInfo = () => {
  const { id: roleId } = useParams();
  const navigate = useNavigate();
  const [rolePages, setRolePages] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(roleId);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/role/getRoleInfo/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        const fetchedData = response.data.map((page) => ({
          ...page,
          Permissions: page.Permissions.map((perm) => ({
            ...perm,
            isChecked: perm.permissionID !== 0,
          })),
        }));

        setRolePages(fetchedData);
      } catch (error) {
        console.error("Error fetching role data", error);
        toast.error("Failed to fetch role information");
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/role/getroles`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles", error);
        toast.error("Failed to fetch roles");
      }
    };

    fetchRoleData();
    fetchRoles();
  }, [roleId]);

  const permissionNameToID = {
    View: 1,
    Add: 2,
    Update: 3,
    Delete: 4,
  };

  const handlePermissionChange = (pageId, permissionName) => {
    const updatedPages = rolePages.map((page) =>
      page.PageID === pageId
        ? {
            ...page,
            Permissions: page.Permissions.map((permission) =>
              permission.permissionName === permissionName
                ? {
                    ...permission,
                    isChecked: !permission.isChecked,
                    permissionID: !permission.isChecked
                      ? permissionNameToID[permissionName]
                      : 0,
                  }
                : permission
            ),
          }
        : page
    );
    setRolePages(updatedPages);
  };

  const handleUpdateRole = async () => {
    try {
      const payload = rolePages
        .map((page) => ({
          PageID: page.PageID,
          Permissions: page.Permissions.filter(
            (permission) => permission.isChecked
          ),
        }))
        .filter((page) => page.Permissions.length > 0);

      await api.put(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/role/updateRolePermissions/${roleId}`,
        {
          permissions: payload,
        }
      );

      toast.success("Role updated successfully!");
      navigate("/role");
    } catch (error) {
      console.error("Error updating role permissions", error);
      toast.error("Failed to update role permissions.");
    }
  };

  const getRandomColor = () => {
    const colors = [
      "border-2 border-l-red-500",
      "border-2 border-l-blue-500",
      "border-2 border-l-green-500",
      "border-2 border-l-yellow-500",
      "border-2 border-l-indigo-500",
      "border-2 border-l-purple-500",
      "border-2 border-l-pink-500",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/role/getRoleInfo/${selectedRoleId}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        const fetchedData = response.data.map((page) => ({
          ...page,
          Permissions: page.Permissions.map((perm) => ({
            ...perm,
            isChecked: perm.permissionID !== 0,
          })),
        }));

        setRolePages(fetchedData);
      } catch (error) {
        console.error("Error fetching role data", error);
        toast.error("Failed to fetch role information");
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/role/getroles`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles", error);
        toast.error("Failed to fetch roles");
      }
    };

    fetchRoleData();
    fetchRoles();
  }, [selectedRoleId]);

  const handleRoleClick = (roleId) => {
    setSelectedRoleId(roleId);
  };

  return (
    <div className="max-w-7xl mx-auto  mt-32 px-4 sm:px-6 lg:px-8">
      <div className="flex">
        <div className="w-1/4 mr-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Roles</h2>
          <ul className="bg-white shadow-md rounded-md divide-y divide-gray-200">
            {roles.map((role) => (
              <li
                key={role.roleid}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  selectedRoleId === role.roleid ? "bg-gray-200" : ""
                } ${getRandomColor()}`}
                onClick={() => handleRoleClick(role.roleid)}
              >
                {role.roleName}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Update Role Permissions
          </h2>
          <div className="grid grid-cols-5 mb-4">
            <h4 className="font-semibold text-lg text-gray-700 col-span-1">
              Page Name
            </h4>
            <h4 className="font-semibold text-lg text-gray-700 col-span-4">
              Permissions
            </h4>
          </div>
          {rolePages.map((page) => (
            <div
              key={page.PageID}
              className="mb-4 p-4 bg-white grid grid-cols-5 rounded shadow-sm"
            >
              <h4 className="font-semibold text-lg text-gray-700">
                {page.PageName}
              </h4>
              {page.Permissions.map((perm) => (
                <div
                  key={perm.permissionName}
                  className="flex items-center mb-2"
                >
                  <input
                    type="checkbox"
                    checked={perm.isChecked}
                    onChange={() =>
                      handlePermissionChange(page.PageID, perm.permissionName)
                    }
                    className="mr-2 w-4 h-4 cursor-pointer"
                  />
                  <label className="text-gray-600 cursor-pointer">
                    {perm.permissionName}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={handleUpdateRole}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowRoleInfo;
