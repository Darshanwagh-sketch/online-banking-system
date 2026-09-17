import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staffService';
import { Search, UserCheck } from 'lucide-react';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await staffService.getCustomers();
      if (res.success) setCustomers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Customer Directory</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Search and view customer profiles in the banking network.</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>DOB</th>
                <th>Address</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
                    No customers found matching search term.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: '#3A86FF' }}>#CUST-{c.id}</td>
                    <td style={{ fontWeight: 700, color: '#F8FAFC' }}>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.dateOfBirth || 'N/A'}</td>
                    <td>{c.address || 'N/A'}</td>
                    <td style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
