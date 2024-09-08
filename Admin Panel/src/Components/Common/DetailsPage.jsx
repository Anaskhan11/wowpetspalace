import React from "react";
import { useLocation } from "react-router-dom";

const DetailsPage = () => {
  const location = useLocation();
  const { data } = location.state;
  console.log(data);

  const {
    image,
    categoryName,
    title,
    description,
    first_name,
    firstName,
    lastName,
    phoneNumber,
    last_name,
    user_type,
    is_admin,
    roleName,
    status,
    breed_description,
    breed_images,
    breed_title,
    category_title,
    devicetype,
  } = data;

  return (
    <main className="max-w-7xl mx-auto my-24">
      {image && (
        <img
          src={`${import.meta.env.VITE_APP_BASE_URL}/${image}`}
          alt="article image"
          className="w-full lg:h-[600px] object-center object-cover rounded-md"
        />
      )}

      {breed_images && (
        <img
          src={`${import.meta.env.VITE_APP_BASE_URL}/${breed_images[0]}`}
          alt="article image"
          className="w-full lg:h-[600px] object-center object-cover rounded-md"
        />
      )}
      {categoryName && (
        <p className="py-1 px-2 rounded-md bg-green-700 text-white w-fit my-4">
          {categoryName}
        </p>
      )}
      {title && (
        <h1 className="text-6xl font-bold text-green-800 my-4">{title}</h1>
      )}
      {breed_title && (
        <h1 className="text-6xl font-bold text-green-800 my-4">
          {breed_title}
        </h1>
      )}
      {category_title && (
        <p className="w-fit px-2 py-1 rounded-md bg-green-800 text-white font-semibold">
          {category_title}
        </p>
      )}
      <div className="flex items-center gap-4 flex-wrap">
        {first_name && (
          <p className="text-xl p-2 rounded-md bg-yellow-400 text-white">
            <span className="font-bold">First Name: </span> {first_name}
          </p>
        )}
        {firstName && (
          <p className="text-xl p-2 rounded-md bg-yellow-400 text-white">
            <span className="font-bold">First Name: </span> {firstName}
          </p>
        )}
        {lastName && (
          <p className="text-xl p-2 rounded-md bg-yellow-400 text-white">
            <span className="font-bold">Last Name: </span> {lastName}
          </p>
        )}
        {last_name && (
          <p className="text-xl p-2 rounded-md bg-yellow-400 text-white">
            <span className="font-bold">Last Name: </span> {last_name}
          </p>
        )}
        {phoneNumber && (
          <p className="text-xl p-2 rounded-md bg-yellow-400 text-white">
            <span className="font-bold">Phone Number: </span> {phoneNumber}
          </p>
        )}
        {user_type && (
          <p className="text-xl p-2 rounded-md bg-orange-400 text-white">
            <span className="font-bold">User Type: </span> {user_type}
          </p>
        )}
        {is_admin && (
          <p className="text-xl p-2 rounded-md bg-red-400 text-white">
            <span className="font-bold">Is Admin: </span> {is_admin}
          </p>
        )}
        {roleName && (
          <p className="text-xl p-2 rounded-md bg-blue-400 text-white">
            <span className="font-bold">Role Name: </span> {roleName}
          </p>
        )}
        {status && (
          <p className="text-xl p-2 rounded-md bg-green-400 text-white">
            <span className="font-bold">Status: </span>{" "}
            {status === 1 ? "Active" : "Inactive"}
          </p>
        )}
        {devicetype && (
          <p className="text-xl p-2 rounded-md bg-green-400 text-white">
            <span className="font-bold">Device Type: </span>{" "}
            {devicetype === 1 ? "Android" : "iOS"}
          </p>
        )}
      </div>
      {description && <div dangerouslySetInnerHTML={{ __html: description }} />}
      {breed_description && (
        <div dangerouslySetInnerHTML={{ __html: breed_description }} />
      )}
    </main>
  );
};

export default DetailsPage;
