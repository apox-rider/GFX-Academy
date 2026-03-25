'use client'
import { useEffect, useState } from "react";

interface Contact{
  id:number
  name:string;
  email:string;
  subject:string;
  message:string;
  date:string;
  Action:string;
}

export default function ContactsContent() {
  const [contacts,setContact]=useState<Contact[]>([])

  const getContactInfor=()=>{
      fetch('http://localhost:3000/api/contacts')
      .then(res=>res.json())
      .then(json=>setContact(json))
  }
  useEffect(()=>{
    getContactInfor()
  },[])
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
              <th className="text-left p-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            { contacts.map((contact, id) => (
              <tr key={id} className="hover:bg-gray-800/50">
                <td className="p-6 font-medium">{contact.name}</td>
                <td className="p-6 text-gray-400">{contact.email}</td>
                <td className="p-6">{contact.subject}</td>
                <td className="p-6 max-w-xs truncate text-gray-300">{contact.message}</td>
                <td className="p-6 text-gray-400">{contact.date}</td>
                <td className="p-6">
                  <button className="text-yellow-500 hover:underline">Reply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}