import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

import api from "../../axios/api";

// ICONS
import { TiUserAddOutline } from "react-icons/ti";

const AddRole = () => {
  // state for role
  const [data, setData] = useState([]);
  const [role, setRoles] = useState([]);
  const [access, setAccess] = useState([]);
  const [selectedRowIndices, setSelectedRowIndices] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [roleName, setRoleName] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleRoleClick = async (role) => {
    setSelectedRole(role);
    setRoleName(role.roleName);

    try {
      const response = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/role/getpermissionsbyroleid/${
          role.roleid
        }`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      const permissionData = response.data;
      console.log("permission data", response.data);

      const updatedSelectedPermissions = {};
      const updatedSelectedRowIndices = [];

      permissionData.forEach((permission) => {
        const { pageid, permissionid } = permission;

        // Push pageid to updatedSelectedRowIndices array
        if (!updatedSelectedPermissions[pageid]) {
          updatedSelectedPermissions[pageid] = [];
          updatedSelectedRowIndices.push(pageid); // Push pageid here
        }

        updatedSelectedPermissions[pageid].push(permissionid);
      });

      setSelectedPermissions(updatedSelectedPermissions);
      setSelectedRowIndices(updatedSelectedRowIndices);
      console.log("selectedPermissions", updatedSelectedPermissions);
      console.log("selectedRowIndices", updatedSelectedRowIndices);
    } catch (error) {
      console.error("Error while fetching role permissions:", error.message);
      toast.error("Failed to fetch role permissions");
    }
  };

  const handleUpdateRole = async () => {
    try {
      const response = await api.put(
        `${import.meta.env.VITE_APP_BASE_URL}/role/updaterolepermissions`,
        {
          roleid: selectedRole.roleid,
          selectedPermissions,
        },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setSelectedRole(null);
        setRoleName("");
        setSelectedRowIndices([]);
        setSelectedPermissions({});
        fetchRole();
      } else {
        toast.error("Failed to update role permissions");
      }
    } catch (error) {
      console.error("Error while updating role permissions:", error.message);
      toast.error("Failed to update role permissions");
    }
  };

  const handleDataCheckboxChange = (event, PageID) => {
    if (event.target.checked) {
      setSelectedRowIndices((prevIndices) => [...prevIndices, PageID]);
    } else {
      setSelectedRowIndices((prevIndices) =>
        prevIndices.filter((currentIndex) => currentIndex !== PageID)
      );
    }
  };

  const handlePermissionCheckboxChange = (event, pageId, permissionId) => {
    if (event.target.checked) {
      setSelectedPermissions((prevSelectedPermissions) => ({
        ...prevSelectedPermissions,
        [pageId]: [...(prevSelectedPermissions[pageId] || []), permissionId],
      }));
    } else {
      setSelectedPermissions((prevSelectedPermissions) => {
        const updatedPermissions = { ...prevSelectedPermissions };
        const pagePermissions = updatedPermissions[pageId] || [];
        const updatedPagePermissions = pagePermissions.filter(
          (id) => id !== permissionId
        );

        if (updatedPagePermissions.length > 0) {
          updatedPermissions[pageId] = updatedPagePermissions;
        } else {
          delete updatedPermissions[pageId];
        }

        return updatedPermissions;
      });
    }
  };

  const handleAddRole = async () => {
    try {
      // Validate if roleName is not empty
      if (!roleName.trim()) {
        toast.error("Role name cannot be empty.");
        return;
      }

      // Validate if at least one page and permission are selected
      if (
        selectedRowIndices.length === 0 ||
        Object.keys(selectedPermissions).length === 0
      ) {
        toast.error("Please select at least one page and permission.");
        return;
      }

      // Create an array of userRolePagePermission objects
      const userrolepagepermission = Object.entries(
        selectedPermissions
      ).flatMap(([pageid, permissions]) =>
        permissions.map((permissionid) => ({
          pageid,
          permissionid,
        }))
      );

      console.log(
        "======checking userrolepagepermission======",
        userrolepagepermission
      );

      const response = await api.post(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/role/createrolewithpagepermission`,
        {
          roleName,
          userrolepagepermission,
        },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      console.log(
        "======== checking response for add role ======",
        response.data
      );

      if (response.data.message) {
        toast.success(response.data.message);
        fetchRole();
        setRoleName("");
        setSelectedRowIndices([]);
        setSelectedPermissions({});
      } else {
        toast.error("Failed to create role with page permission");
      }
    } catch (error) {
      console.error("Error while adding role:", error.message);
      toast.error("Failed to create role with page permission");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/pages/getpages`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        setData(response.data);
        console.log("data", response.data);
      } catch (error) {
        console.log(error, "Error While Fetching Data");
      }
    };

    fetchData();
  }, []);

  const fetchRole = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/role/role`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setRoles(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const show = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/permission/getpermission`
        );
        setAccess(show.data);
        console.log("show Permission", show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPermission();
  }, []);

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Settings/AddRole</h2>
              </div>
            </div>
          </div>

          <div className="row column4 graph">
            {/* Left Section - Roles */}
            <div className="col-md-5">
              <div className="full progress_bar_inner">
                <div className="row">
                  <div className="col-md-12">
                    <div className="msg_section">
                      <div className="msg_list_main">
                        <ul className="msg_list">
                          {role.map((data, i) => (
                            <li
                              key={i}
                              className={
                                selectedRole &&
                                selectedRole.roleid === data.roleid
                                  ? "selected cursor-pointer"
                                  : "cursor-pointer"
                              }
                              onClick={() => handleRoleClick(data)}
                            >
                              <span>
                                <span className="name_user">
                                  {data.roleName}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Add Roles */}
            <div className="col-md-7">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head flex items-center justify-between">
                  <div className="heading1 margin_0">
                    <h2>{selectedRole ? "Update Role" : "Add Role"}</h2>
                  </div>

                  {selectedRole ? (
                    <button
                      className="px-4 py-3 text-white bg-green-400 rounded-md ml-auto w-fit flex items-center gap-2"
                      onClick={handleUpdateRole}
                    >
                      <TiUserAddOutline className="h-6 w-6" />
                      <span>Update Role</span>
                    </button>
                  ) : (
                    <button
                      className="px-4 py-3 text-white bg-green-400 rounded-md ml-auto w-fit flex items-center gap-2"
                      onClick={handleAddRole}
                    >
                      <TiUserAddOutline className="h-6 w-6" />
                      <span>Add Role</span>
                    </button>
                  )}
                </div>
                {!selectedRole && (
                  <div className="full progress_bar_inner">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="full p-2">
                          <div className="form-outline mb-4">
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              placeholder="Enter Role"
                              value={roleName}
                              onChange={(e) => setRoleName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Permission Section */}
              <div className="col-md-15">
                <div className="white_shd full margin_bottom_30">
                  <div className="full graph_head">
                    <div className="heading1 margin_0">
                      <h2>Permissions</h2>
                    </div>
                  </div>
                  <div className="table_section padding_infor_info">
                    <div className="table-responsive-sm">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ paddingRight: "20px" }}>Pages</th>
                            <th style={{ paddingLeft: "20px" }}>Permissions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((page) => (
                            <tr key={page.PageID}>
                              <td>
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={selectedRowIndices.includes(
                                      page.PageID
                                    )}
                                    onChange={(event) => {
                                      handleDataCheckboxChange(
                                        event,
                                        page.PageID
                                      );
                                      console.log(page);
                                    }}
                                  />
                                  {page.PageName}
                                </div>
                              </td>
                              <td className="grid grid-cols-4">
                                {access.map((permission) => (
                                  <div
                                    className="custom-control custom-checkbox"
                                    key={permission.permissionID}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      disabled={
                                        !selectedRowIndices.includes(
                                          page.PageID
                                        )
                                      }
                                      checked={
                                        selectedPermissions[page.PageID] &&
                                        selectedPermissions[
                                          page.PageID
                                        ].includes(permission.permissionID)
                                      }
                                      onChange={(event) =>
                                        handlePermissionCheckboxChange(
                                          event,
                                          page.PageID,
                                          permission.permissionID
                                        )
                                      }
                                    />
                                    {permission.permissionName}
                                  </div>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRole;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import secureLocalStorage from "react-secure-storage";

// import api from "../../axios/api";

// // ICONS
// import { TiUserAddOutline } from "react-icons/ti";

// const AddRole = () => {
//   // state for role
//   const [data, setData] = useState([]);
//   const [role, setRoles] = useState([]);
//   const [access, setAccess] = useState([]);
//   const [selectedRowIndices, setSelectedRowIndices] = useState([]);
//   const [selectedPermissions, setSelectedPermissions] = useState({});
//   const [roleName, setRoleName] = useState("");
//   const [selectedRole, setSelectedRole] = useState(null);
//   const navigate = useNavigate();

//   const handleRoleClick = async (role) => {
//     setSelectedRole(role);
//     setRoleName(role.roleName);

//     try {
//       const response = await api.get(
//         `${import.meta.env.VITE_APP_BASE_URL}/role/getpermissionsbyroleid/${
//           role.roleid
//         }`,
//         {
//           headers: {
//             Authorization: `Bearer ${secureLocalStorage.getItem(
//               "accessToken"
//             )}`,
//           },
//         }
//       );

//       const permissionData = response.data;
//       console.log("permission data", response.data);

//       const updatedSelectedPermissions = {};
//       const updatedSelectedRowIndices = [];

//       permissionData.forEach((permission) => {
//         const { pageid, permissionid } = permission;

//         // Push pageid to updatedSelectedRowIndices array
//         if (!updatedSelectedPermissions[pageid]) {
//           updatedSelectedPermissions[pageid] = [];
//           updatedSelectedRowIndices.push(pageid); // Push pageid here
//         }

//         updatedSelectedPermissions[pageid].push(permissionid);
//       });

//       setSelectedPermissions(updatedSelectedPermissions);
//       setSelectedRowIndices(updatedSelectedRowIndices);
//       console.log("selectedPermissions", updatedSelectedPermissions);
//       console.log("selectedRowIndices", updatedSelectedRowIndices);
//     } catch (error) {
//       console.error("Error while fetching role permissions:", error.message);
//       toast.error("Failed to fetch role permissions");
//     }
//   };

//   const handleUpdateRole = async () => {
//     try {
//       const response = await api.put(
//         `${import.meta.env.VITE_APP_BASE_URL}/role/updaterolepermissions`,
//         {
//           roleid: selectedRole.roleid,
//           selectedPermissions,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${secureLocalStorage.getItem(
//               "accessToken"
//             )}`,
//           },
//         }
//       );

//       if (response.data.message) {
//         toast.success(response.data.message);
//         setSelectedRole(null);
//         setRoleName("");
//         setSelectedRowIndices([]);
//         setSelectedPermissions({});
//         fetchRole();
//       } else {
//         toast.error("Failed to update role permissions");
//       }
//     } catch (error) {
//       console.error("Error while updating role permissions:", error.message);
//       toast.error("Failed to update role permissions");
//     }
//   };

//   const handleDataCheckboxChange = (event, PageID) => {
//     if (event.target.checked) {
//       setSelectedRowIndices((prevIndices) => [...prevIndices, PageID]);
//     } else {
//       setSelectedRowIndices((prevIndices) =>
//         prevIndices.filter((currentIndex) => currentIndex !== PageID)
//       );
//     }
//   };

//   const handlePermissionCheckboxChange = (event, pageId, permissionId) => {
//     if (event.target.checked) {
//       setSelectedPermissions((prevSelectedPermissions) => ({
//         ...prevSelectedPermissions,
//         [pageId]: [...(prevSelectedPermissions[pageId] || []), permissionId],
//       }));
//     } else {
//       setSelectedPermissions((prevSelectedPermissions) => {
//         const updatedPermissions = { ...prevSelectedPermissions };
//         const pagePermissions = updatedPermissions[pageId] || [];
//         const updatedPagePermissions = pagePermissions.filter(
//           (id) => id !== permissionId
//         );

//         if (updatedPagePermissions.length > 0) {
//           updatedPermissions[pageId] = updatedPagePermissions;
//         } else {
//           delete updatedPermissions[pageId];
//         }

//         return updatedPermissions;
//       });
//     }
//   };

//   const handleAddRole = async () => {
//     try {
//       // Validate if roleName is not empty
//       if (!roleName.trim()) {
//         toast.error("Role name cannot be empty.");
//         return;
//       }

//       // Validate if at least one page and permission are selected
//       if (
//         selectedRowIndices.length === 0 ||
//         Object.keys(selectedPermissions).length === 0
//       ) {
//         toast.error("Please select at least one page and permission.");
//         return;
//       }

//       // Create an array of userRolePagePermission objects
//       const userrolepagepermission = Object.entries(
//         selectedPermissions
//       ).flatMap(([pageid, permissions]) =>
//         permissions.map((permissionid) => ({
//           pageid,
//           permissionid,
//         }))
//       );

//       console.log(
//         "======checking userrolepagepermission======",
//         userrolepagepermission
//       );

//       const response = await api.post(
//         `${
//           import.meta.env.VITE_APP_BASE_URL
//         }/role/createrolewithpagepermission`,
//         {
//           roleName,
//           userrolepagepermission,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${secureLocalStorage.getItem(
//               "accessToken"
//             )}`,
//           },
//         }
//       );

//       console.log(
//         "======== checking response for add role ======",
//         response.data
//       );

//       if (response.data.message) {
//         toast.success(response.data.message);
//         fetchRole();
//         setRoleName("");
//         setSelectedRowIndices([]);
//         setSelectedPermissions({});
//       } else {
//         toast.error("Failed to create role with page permission");
//       }
//     } catch (error) {
//       console.error("Error while adding role:", error.message);
//       toast.error("Failed to create role with page permission");
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get(
//           `${import.meta.env.VITE_APP_BASE_URL}/pages/getpages`,
//           {
//             headers: {
//               Authorization: `Bearer ${secureLocalStorage.getItem(
//                 "accessToken"
//               )}`,
//             },
//           }
//         );
//         setData(response.data);
//         console.log("data", response.data);
//       } catch (error) {
//         console.log(error, "Error While Fetching Data");
//       }
//     };

//     fetchData();
//   }, []);

//   const fetchRole = async () => {
//     try {
//       const res = await api.get(
//         `${import.meta.env.VITE_APP_BASE_URL}/role/role`,
//         {
//           headers: {
//             Authorization: `Bearer ${secureLocalStorage.getItem(
//               "accessToken"
//             )}`,
//           },
//         }
//       );
//       setRoles(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     fetchRole();
//   }, []);

//   useEffect(() => {
//     const fetchPermission = async () => {
//       try {
//         const show = await api.get(
//           `${import.meta.env.VITE_APP_BASE_URL}/permission/getpermission`
//         );
//         setAccess(show.data);
//         console.log("show Permission", show);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchPermission();
//   }, []);

//   return (
//     <>
//       <div className="midde_cont">
//         <div className="container-fluid">
//           <div className="row column_title">
//             <div className="col-md-12">
//               <div className="page_title">
//                 <h2>Settings/AddRole</h2>
//               </div>
//             </div>
//           </div>

//           <div className="row column4 graph">
//             {/* Left Section - Roles */}
//             <div className="col-md-5">
//               <div className="full progress_bar_inner">
//                 <div className="row">
//                   <div className="col-md-12">
//                     <div className="msg_section">
//                       <div className="msg_list_main">
//                         <ul className="msg_list">
//                           {role.map((data, i) => (
//                             <li
//                               key={i}
//                               className={
//                                 selectedRole &&
//                                 selectedRole.roleid === data.roleid
//                                   ? "selected cursor-pointer"
//                                   : "cursor-pointer"
//                               }
//                               onClick={() => handleRoleClick(data)}
//                             >
//                               <span>
//                                 <span className="name_user">
//                                   {data.roleName}
//                                 </span>
//                               </span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Section - Add Roles */}
//             <div className="col-md-7">
//               <div className="white_shd full margin_bottom_30">
//                 <div className="full graph_head flex items-center justify-between">
//                   <div className="heading1 margin_0">
//                     <h2>{selectedRole ? "Update Role" : "Add Role"}</h2>
//                   </div>

//                   {selectedRole ? (
//                     <button
//                       className="px-4 py-3 text-white bg-green-400 rounded-md ml-auto w-fit flex items-center gap-2"
//                       onClick={handleUpdateRole}
//                     >
//                       <TiUserAddOutline className="h-6 w-6" />
//                       <span>Update Role</span>
//                     </button>
//                   ) : (
//                     <button
//                       className="px-4 py-3 text-white bg-green-400 rounded-md ml-auto w-fit flex items-center gap-2"
//                       onClick={handleAddRole}
//                     >
//                       <TiUserAddOutline className="h-6 w-6" />
//                       <span>Add Role</span>
//                     </button>
//                   )}
//                 </div>
//                 {!selectedRole && (
//                   <div className="full progress_bar_inner">
//                     <div className="row">
//                       <div className="col-md-12">
//                         <div className="full p-2">
//                           <div className="form-outline mb-4">
//                             <input
//                               type="text"
//                               className="form-control form-control-lg"
//                               placeholder="Enter Role"
//                               value={roleName}
//                               onChange={(e) => setRoleName(e.target.value)}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Permission Section */}
//               <div className="col-md-15">
//                 <div className="white_shd full margin_bottom_30">
//                   <div className="full graph_head">
//                     <div className="heading1 margin_0">
//                       <h2>Permissions</h2>
//                     </div>
//                   </div>
//                   <div className="table_section padding_infor_info">
//                     <div className="table-responsive-sm">
//                       <table className="table table-hover">
//                         <thead>
//                           <tr>
//                             <th style={{ paddingRight: "20px" }}>Pages</th>
//                             <th style={{ paddingLeft: "20px" }}>Permissions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {data.map((page) => (
//                             <tr key={page.PageID}>
//                               <td>
//                                 <div className="custom-control custom-checkbox">
//                                   <input
//                                     type="checkbox"
//                                     className="form-check-input"
//                                     checked={selectedRowIndices.includes(
//                                       page.PageID
//                                     )}
//                                     onChange={(event) => {
//                                       handleDataCheckboxChange(
//                                         event,
//                                         page.PageID
//                                       );
//                                       console.log(page);
//                                     }}
//                                   />
//                                   {page.PageName}
//                                 </div>
//                               </td>
//                               <td className="grid grid-cols-4">
//                                 {access.map((permission) => (
//                                   <div
//                                     className="custom-control custom-checkbox"
//                                     key={permission.permissionID}
//                                   >
//                                     <input
//                                       type="checkbox"
//                                       className="form-check-input"
//                                       disabled={
//                                         !selectedRowIndices.includes(
//                                           page.PageID
//                                         )
//                                       }
//                                       checked={
//                                         selectedPermissions[page.PageID] &&
//                                         selectedPermissions[
//                                           page.PageID
//                                         ].includes(permission.permissionID)
//                                       }
//                                       onChange={(event) =>
//                                         handlePermissionCheckboxChange(
//                                           event,
//                                           page.PageID,
//                                           permission.permissionID
//                                         )
//                                       }
//                                     />
//                                     {permission.permissionName}
//                                   </div>
//                                 ))}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddRole;
