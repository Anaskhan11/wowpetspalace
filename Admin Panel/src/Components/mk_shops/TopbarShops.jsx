import React from "react";

const TopbarShops = ({ tabName, setTabName }) => {
  const tabClasses =
    "px-4 py-2 text-sm font-medium text-center border-b-2 focus:outline-none";
  const activeTabClasses = "border-blue-500 text-blue-600";
  const inactiveTabClasses =
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          className={`${tabClasses} ${
            tabName === "Shop Information"
              ? activeTabClasses
              : inactiveTabClasses
          }`}
          onClick={() => setTabName("Shop Information")}
        >
          Shop Information
        </button>
        <button
          className={`${tabClasses} ${
            tabName === "Payment Setting"
              ? activeTabClasses
              : inactiveTabClasses
          }`}
          onClick={() => setTabName("Payment Setting")}
        >
          Payment Setting
        </button>
        <button
          className={`${tabClasses} ${
            tabName === "Currency Setting"
              ? activeTabClasses
              : inactiveTabClasses
          }`}
          onClick={() => setTabName("Currency Setting")}
        >
          Currency Setting
        </button>
        <button
          className={`${tabClasses} ${
            tabName === "Sending Email Setting(For SMTP)"
              ? activeTabClasses
              : inactiveTabClasses
          }`}
          onClick={() => setTabName("Sending Email Setting(For SMTP)")}
        >
          Sending Email Setting(For SMTP)
        </button>
        <button
          className={`${tabClasses} ${
            tabName === "Tax" ? activeTabClasses : inactiveTabClasses
          }`}
          onClick={() => setTabName("Tax")}
        >
          Tax
        </button>
        <button
          className={`${tabClasses} ${
            tabName === "Policy & Terms" ? activeTabClasses : inactiveTabClasses
          }`}
          onClick={() => setTabName("Policy & Terms")}
        >
          Policy & Terms
        </button>
        <button
          className={`${tabClasses} ${
            tabName === "Shipping Method"
              ? activeTabClasses
              : inactiveTabClasses
          }`}
          onClick={() => setTabName("Shipping Method")}
        >
          Shipping Method
        </button>
      </nav>
    </div>
  );
};

export default TopbarShops;
