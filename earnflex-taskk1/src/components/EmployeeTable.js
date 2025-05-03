import React, { useEffect, useState } from 'react';
import { fetchEmployees } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';


const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const getData = async () => {
      const data = await fetchEmployees();
      setEmployees(data || []);
    };
    getData();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filtered = employees.filter((emp) =>
    emp.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = filtered.sort((a, b) => {
    const aValue = a[sortKey] || '';
    const bValue = b[sortKey] || '';
    return sortOrder === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const paginated = sorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(sorted.length / rowsPerPage);

  const renderSortIcon = (key) => {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? ' 🔼' : ' 🔽';
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">Workers</h3>
        <input
          className="form-control w-25"
          placeholder="Search by first name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>
                Name {renderSortIcon('firstName')}
              </th>
              <th onClick={() => handleSort('lastName')} style={{ cursor: 'pointer' }}>
      Last Name {renderSortIcon('lastName')}
    </th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                Email {renderSortIcon('email')}
              </th>
              <th onClick={() => handleSort('city')} style={{ cursor: 'pointer' }}>
                City {renderSortIcon('city')}
              </th>
              <th onClick={() => handleSort('country')} style={{ cursor: 'pointer' }}>
                Country {renderSortIcon('country')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {paginated.length > 0 ? (
    paginated.map((emp, idx) => (
      <tr key={idx}>
        <td>
          <div className="d-flex align-items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random`}
              alt="avatar"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <div>
              <p className="fw-bold mb-0">{emp.firstName}</p>
            </div>
          </div>
        </td>
        <td>{emp.lastName}</td>
        <td>{emp.email}</td>
        <td>
          <span className="badge bg-info text-dark">{emp.city}</span>
        </td>
        <td>
          <span className="badge bg-secondary">{emp.country}</span>
        </td>
        <td>
          <button className="btn btn-outline-primary btn-sm">View</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center py-4">
        No employees found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="fw-bold">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
