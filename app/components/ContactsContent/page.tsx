'use client'
import { useEffect, useState } from "react";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ContactsContent() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts?include_read=true');
      const json = await res.json();
      if (json.success) {
        setContacts(json.contacts || []);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleReply = (contact: Contact) => {
    const mailtoLink = `mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject || 'Contact Form Response')}&body=Hi ${encodeURIComponent(contact.name)},%0A%0A`;
    window.location.href = mailtoLink;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/contacts?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete the message.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("An error occurred while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Contact Messages</h1>
        <button
          onClick={fetchContacts}
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-4 py-2 rounded-lg font-semibold"
        >
          Refresh
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
          <p className="text-gray-400 text-lg">No contact messages yet.</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-950">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Subject</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Message</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-gray-800/50 ${!contact.is_read ? 'bg-yellow-500/5' : ''}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {contact.name}
                      {!contact.is_read && (
                        <span className="w-2 h-2 bg-yellow-500 rounded-full" title="New" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{contact.email}</td>
                  <td className="p-4 text-gray-300">{contact.subject || '-'}</td>
                  <td className="p-4 max-w-xs truncate text-gray-300">{contact.message}</td>
                  <td className="p-4 text-gray-400 text-sm">{formatDate(contact.created_at)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(contact)}
                        className="text-yellow-500 hover:text-yellow-400 font-medium text-sm"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        disabled={deletingId === contact.id}
                        className="text-red-500 hover:text-red-400 font-medium text-sm disabled:opacity-50"
                      >
                        {deletingId === contact.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
