const Pagination = ({ pages, currentPage, setPage }) => {
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(pages, startPage + 3);
  const shouldShowEllipsis = startPage > 2;
  const shouldShowMorePages = pages > endPage;

  return (
    <div className="mx-auto my-4 flex justify-end">
      <ul className="flex items-center justify-end gap-4 p-2 rounded-md bg-zinc-200 shadow-md shadow-slate-300 w-fit ">
        {startPage > 1 && (
          <li>
            <button
              onClick={() => setPage(1)}
              className="font-bold text-black px-4 py-2 rounded-md"
            >
              1
            </button>
          </li>
        )}
        {shouldShowEllipsis && (
          <li>
            <span className="border-1 border-black text-gray-600 px-4 py-2 rounded-md">
              ...
            </span>
          </li>
        )}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => i + startPage
        ).map((x) => (
          <li key={x}>
            <button
              onClick={() => setPage(x)}
              className={`font-bold text-black px-4 py-2 rounded-md ${
                x === currentPage ? "font-bold bg-black text-white" : ""
              }`}
            >
              {x}
            </button>
          </li>
        ))}
        {shouldShowMorePages && (
          <li>
            <span className="border-1 border-black text-gray-600 px-4 py-2 rounded-md">
              ...
            </span>
          </li>
        )}
        {endPage < pages && (
          <li>
            <button
              onClick={() => setPage(pages)}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              {pages}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
