import React, { useEffect, useState } from "react";
import { getAllMessagesAdmin, markMessageAsDone} from "../api/employees";
import { getAllCustomers } from "../api/api";


export default function AdminRequest() {
  const [messages, setMessages] = useState([]);
  const [customersMap, setCustomersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch messages
      const msgs = await getAllMessagesAdmin();
      setMessages(msgs || []);

      // Fetch customers and create email -> full name map
      const custResponse = await getAllCustomers();
      const map = {};
      custResponse.data.forEach(c => {
        map[c.email] = `${c.firstName} ${c.lastName}`;
      });
      setCustomersMap(map);

    } catch (err) {
      console.error("Error loading data", err);
      setError("Failed to load messages or customers.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await markMessageAsDone(id);
      fetchData(); // refresh after marking done
    } catch (err) {
      console.error("Failed to mark message as done", err);
      setError("Failed to mark message as done.");
    }
  };

  if (loading) return <p className="p-6">Loading messages...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📩 Customer Requests</h1>

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-md p-4 shadow-sm ${
                msg.done ? "bg-green-50 border-green-300" : "bg-white"
              }`}
            >
              <p className="font-semibold">Subject: {msg.subject}</p>
              <p className="text-gray-700 mt-1">Content: {msg.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                From: <span className="font-medium">{customersMap[msg.customerEmail] || msg.customerEmail}</span> | Sent:{" "}
                {new Date(msg.createdAt).toLocaleString()}
              </p>

              <button
                className={`mt-3 px-3 py-1 rounded text-white ${
                  msg.done ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => !msg.done && handleMarkDone(msg.id)}
                disabled={msg.done}
              >
                {msg.done ? "Done ✅" : "Mark as Done"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}