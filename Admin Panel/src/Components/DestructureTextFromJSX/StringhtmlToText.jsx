function DescriptionComponent({ description }) {
  const element = document.createElement("div");
  element.innerHTML = description;
  const text = element.textContent || element.innerText || "";

  return <div>{text.slice(0, 100)}...</div>;
}

export default DescriptionComponent;
