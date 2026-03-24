export default function ContactsContent() {
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
            {[
              { name: "John Mwangi", email: "john@example.com", subject: "Signal Access Issue", message: "Cannot see today's signals...", date: "2 hours ago" },
              { name: "Aisha Khan", email: "aisha@outlook.com", subject: "Course Inquiry", message: "Do you offer installment payments?", date: "Yesterday" },
            ].map((msg, i) => (
              <tr key={i} className="hover:bg-gray-800/50">
                <td className="p-6 font-medium">{msg.name}</td>
                <td className="p-6 text-gray-400">{msg.email}</td>
                <td className="p-6">{msg.subject}</td>
                <td className="p-6 max-w-xs truncate text-gray-300">{msg.message}</td>
                <td className="p-6 text-gray-400">{msg.date}</td>
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