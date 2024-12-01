export const Reports = () => {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-gray-100 p-4 mb-4 rounded">
            Report Block {index + 1}
          </div>
        ))}
      </div>
    );
  };