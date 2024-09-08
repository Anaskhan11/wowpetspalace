import React from "react";

const SinglePagePermissions = ({
  page,
  permissions,
  handlePermissionChange,
}) => {
  return (
    <tr>
      <td>{page.PageName}</td>
      <td className="grid grid-cols-4">
        {permissions.map((permission) => (
          <div key={permission.permissionID}>
            <input
              type="checkbox"
              id={`${page.PageID}-${permission.permissionID}`}
              name={`${page.PageID}-${permission.permissionID}`}
              value={permission.permissionID}
              onChange={() =>
                handlePermissionChange(page.PageID, permission.permissionID)
              }
            />
            <label
              htmlFor={`${page.PageID}-${permission.permissionID}`}
              style={{ paddingLeft: "20px" }}
            >
              {permission.permissionName}
            </label>
          </div>
        ))}
      </td>
    </tr>
  );
};

export default SinglePagePermissions;
