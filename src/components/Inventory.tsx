import React, { useEffect, useState } from 'react';

interface InventoryItem {
  _id: string;
  item_name: string;
  category: string;
  purchase_date: string;
  serial_number: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Unauthorized access. Please log in again.');
        return;
      }
      const response = await fetch('https://backend-inventory-4xuz.onrender.com/api/items', {
        method: 'GET',
        headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
      });
      if (response.status === 401) {
        setError('Unauthorized access. Please log in again.');
        return;
      }
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('An error occurred while fetching items.');
    }
  };

  const addItem = async (newItem: Omit<InventoryItem, '_id'>) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    const response = await fetch('https://backend-inventory-4xuz.onrender.com/api/items', {
      method: 'POST',
      headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (response.ok) fetchItems();
  };

  const openUpdateModal = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const updateItem = async (updatedItem: InventoryItem) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    await fetch(`https://backend-inventory-4xuz.onrender.com/api/items/${updatedItem._id}`, {
      method: 'PUT',
      headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem),
    });
    fetchItems();
    setIsModalOpen(false);
  };

  const deleteItem = async (id: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    await fetch(`https://backend-inventory-4xuz.onrender.com/api/items/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    });
    fetchItems();
  };

  return (
    <div className="bg-blue-50 p-8 min-h-screen">
      {error && <p className="text-red-500">{error}</p>}

      <div className="text-center">
        <h1 className="text-3xl font-semibold text-blue-700 mb-8">Inventory Items</h1>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <li key={item._id} className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.item_name}</h2>
            <p>Category: {item.category}</p>
            <p>Purchase Date: {new Date(item.purchase_date).toLocaleDateString()}</p>
            <p>Serial Number: {item.serial_number}</p>
            <div className="mt-4">
              <button
                onClick={() => openUpdateModal(item)}
                className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500 mr-2"
              >
                Update
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Update Item</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const updatedItem = {
                  ...currentItem,
                  item_name: form.item_name.value,
                  category: form.category.value,
                  purchase_date: new Date(form.purchase_date.value).toISOString(),
                  serial_number: form.serial_number.value,
                };
                updateItem(updatedItem);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="item_name"
                defaultValue={currentItem.item_name}
                required
                className="border border-blue-300 p-2 rounded w-full"
              />
              <select
                name="category"
                defaultValue={currentItem.category}
                required
                className="border border-blue-300 p-2 rounded w-full"
              >
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
              </select>
              <input
                type="date"
                name="purchase_date"
                defaultValue={new Date(currentItem.purchase_date).toISOString().split('T')[0]}
                required
                className="border border-blue-300 p-2 rounded w-full"
              />
              <input
                type="text"
                name="serial_number"
                defaultValue={currentItem.serial_number}
                required
                className="border border-blue-300 p-2 rounded w-full"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
              >
                Update Item
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 p-2 rounded w-full hover:bg-gray-400 mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-blue-100 p-6 rounded-lg shadow-lg mt-8">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Add New Item</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const newItem = {
              item_name: form.item_name.value,
              category: form.category.value,
              purchase_date: new Date(form.purchase_date.value).toISOString(),
              serial_number: form.serial_number.value,
            };
            addItem(newItem);
            form.reset();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            required
            className="border border-blue-300 p-2 rounded w-full"
          />
          <select
            name="category"
            required
            className="border border-blue-300 p-2 rounded w-full"
          >
            <option value="">Select Category</option>
            <option value="Furniture">Furniture</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
          </select>
          <input
            type="date"
            name="purchase_date"
            required
            className="border border-blue-300 p-2 rounded w-full"
          />
          <input
            type="text"
            name="serial_number"
            placeholder="Serial Number"
            required
            className="border border-blue-300 p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inventory;
