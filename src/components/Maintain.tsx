import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Item {
  _id: string;
  item_name: string;
}

interface MaintenanceRecord {
  _id: string;
  service_type: string;
  date_of_service: string;
  cost: number;
  item_id: string;
}

const Maintain: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchItemsAndMaintenance = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const itemsResponse = await fetch('https://backend-inventory-4xuz.onrender.com/api/items', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (!itemsResponse.ok) {
        throw new Error('Failed to fetch items');
      }

      const itemsData = await itemsResponse.json();
      setItems(itemsData);

      const maintenancePromises = itemsData.map(async (item: Item) => {
        const maintenanceResponse = await fetch(`https://backend-inventory-4xuz.onrender.com/api/maintenance/${item._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (maintenanceResponse.ok) {
          return await maintenanceResponse.json();
        } else {
          throw new Error(`Failed to fetch maintenance for item ${item._id}`);
        }
      });

      const maintenanceData = await Promise.all(maintenancePromises);
      setMaintenanceRecords(maintenanceData.flat());
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Could not fetch items or maintenance records. Please try again later.');
    }
  };

  const handleAddRecord = async (itemId: string, service_type: string, date_of_service: string, cost: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('https://backend-inventory-4xuz.onrender.com/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          service_type,
          date_of_service,
          cost,
          item_id: itemId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add maintenance record');
      }

      fetchItemsAndMaintenance();
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      setError('Failed to add maintenance record');
    }
  };

  const handleDeleteRecord = async (maintenanceId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`https://backend-inventory-4xuz.onrender.com/api/maintenance/${maintenanceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete maintenance record');
      }

      fetchItemsAndMaintenance();
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      setError('Failed to delete maintenance record');
    }
  };

  useEffect(() => {
    fetchItemsAndMaintenance();
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="w-3/5 mx-auto p-4 justify-items-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Maintenance History</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={item._id} className="mb-8">
              <h2 className="text-xl font-bold mb-2">
                {index + 1}. {item.item_name}
              </h2>

              {/* Maintenance Records Table */}
              <table className="w-full mb-4 bg-slate-100">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Service Type</th>
                    <th className="border px-4 py-2">Date of Service</th>
                    <th className="border px-4 py-2">Cost (₹)</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceRecords
                    .filter((record) => record.item_id === item._id)
                    .map((record) => (
                      <tr key={record._id}>
                        <td className="border px-4 py-2">{record.service_type}</td>
                        <td className="border px-4 py-2">{formatDate(record.date_of_service)}</td>
                        <td className="border px-4 py-2">₹{record.cost}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteRecord(record._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Add Maintenance Record Form */}
              <form
                className="flex gap-2 mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget as HTMLFormElement);
                  const serviceType = formData.get('service_type') as string;
                  const dateOfService = formData.get('date_of_service') as string;
                  const cost = parseFloat(formData.get('cost') as string);
                  handleAddRecord(item._id, serviceType, dateOfService, cost);
                }}
              >
                <input
                  type="text"
                  name="service_type"
                  placeholder="Service Type"
                  className="border px-4 py-2 rounded-lg"
                  required
                />
                <input
                  type="date"
                  name="date_of_service"
                  className="border px-4 py-2 rounded-lg"
                  required
                />
                <input
                  type="number"
                  name="cost"
                  placeholder="Cost (₹)"
                  className="border px-4 py-2 rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add Record
                </button>
              </form>
            </div>
          ))
        ) : (
          <p>No items found in your inventory.</p>
        )}
      </div>
    </div>
  );
};

export default Maintain;
