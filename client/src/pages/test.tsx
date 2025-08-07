import { useState } from 'react';

export default function Test() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">React Test Page</h1>
      <p className="mb-4">If you can see this, React is working!</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Clicked {count} times
      </button>
    </div>
  );
}
