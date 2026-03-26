'use client'
import { useEffect, useState } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export default function ContactsContent() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null); // for loading state

  const getContactInfor = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/contacts');
      const json = await res.json();
      setContacts(json);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  useEffect(() => {
    getContactInfor();
  }, []);

  // Reply using mailto
  const handleReply = (contact: Contact) => {
    const mailtoLink = `mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}&body=Hi ${encodeURIComponent(contact.name)},%0A%0A${encodeURIComponent("Thank you for your message.")}%0A%0A--- Original Message ---%0A${encodeURIComponent(contact.message)}`;
    window.location.href = mailtoLink;
  };

  // Delete contact
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`http://localhost:3000/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Optimistic update
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete the message.");
        // Refetch on failure
        await getContactInfor();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("An error occurred while deleting.");
      await getContactInfor();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Contact Messages</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr>
              <th className="text-left p-6">Name</th>
              <th className="text-left p-6">Email</th>
              <th className="text-left p-6">Subject</th>
              <th className="text-left p-6">Message</th>
              <th className="text-left p-6">Date</th>
              <th className="text-left p-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-800/50">
                <td className="p-6 font-medium">{contact.name}</td>
                <td className="p-6 text-gray-400">{contact.email}</td>
                <td className="p-6">{contact.subject}</td>
                <td className="p-6 max-w-xs truncate text-gray-300">{contact.message}</td>
                <td className="p-6 text-gray-400">{contact.date}</td>
                <td className="p-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleReply(contact)}
                      className="text-yellow-500 hover:underline font-medium"
                    >
                      Reply
                    </button>

                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={deletingId === contact.id}
                      className="text-red-500 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}



// // app/api/contacts/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";

// // Example: delete from your database (replace with your actual DB logic)
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const id = parseInt(params.id);

//   try {
//     // TODO: Delete from your database here
//     // await db.contact.delete({ where: { id } });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
//   }
// }