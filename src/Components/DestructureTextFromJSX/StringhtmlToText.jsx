const DescriptionComponent = ({ description, options }) => {
  const element = document.createElement("div");
  element.innerHTML = description;
  const text = element.textContent || element.innerText || "";

  return (
    <div className="description-truncate">
      {options ? text.slice(options.start, options.end) : text}...
    </div>
  );
};

export default DescriptionComponent;
