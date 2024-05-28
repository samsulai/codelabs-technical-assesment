"use client";

import { Loader } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface User {
  name: {
    first: string;
    last: string;
  };
  email: string;
  gender: string;
  dob: {
    age: number;
  };
  nat: string;
  picture: {
    thumbnail: string;
  };
}

const fetchUsers = async () => {
  const res = await fetch('https://randomuser.me/api/?results=5');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const UserItem: React.FC<{ user: User }> = React.memo(({ user }) => {
  return (
    <li className="flex items-center p-4 border-b border-gray-200">
      <img src={user.picture.thumbnail} alt="User Thumbnail" className="w-12 h-12 rounded-full mr-4" />
      <div>
        <p className="font-semibold">{user.name.first} {user.name.last}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-600">Gender: {user.gender}</p>
        <p className="text-sm text-gray-600">Age: {user.dob.age}</p>
        <p className="text-sm text-gray-600">Nationality: {user.nat}</p>
      </div>
    </li>
  );
});

const UserList: React.FC = () => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    ageRange: '',
    nationality: '',
    gender: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await fetchUsers();
        setUsers(data.results);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    
    if (filters.searchQuery) {
      filtered = filtered.filter(user =>
        `${user.name.first} ${user.name.last}`.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

   
    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
      filtered = filtered.filter(user => user.dob.age >= minAge && user.dob.age <= (maxAge || Infinity));
    }

   
    if (filters.nationality) {
      filtered = filtered.filter(user => user.nat === filters.nationality);
    }

    
    if (filters.gender) {
      filtered = filtered.filter(user => user.gender === filters.gender);
    }

    return filtered;
  }, [users, filters]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">
   <Loader className="h-16 w-16 animate-spin"/>
    </div>;
  if (isError) return <div className="text-center py-4 text-red-500">Error fetching data</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Codelabs Technical Assesment</h2>
     
      <input
        type="text"
        name="searchQuery"
        placeholder="Search by name..."
        value={filters.searchQuery}
        onChange={handleFilterChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

     
      <div className="flex flex-wrap mb-4 gap-4">
        
        <select
          name="ageRange"
          value={filters.ageRange}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Ages</option>
          <option value="0-20">0 - 20</option>
          <option value="21-40">21 - 40</option>
          <option value="41-60">41 - 60</option>
          <option value="61-100">61+</option>
        </select>

       
        <select
          name="nationality"
          value={filters.nationality}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Nationalities</option>
          <option value="AU">Australia</option>
          <option value="BR">Brazil</option>
          <option value="CA">Canada</option>
          <option value="CH">Switzerland</option>
          <option value="DE">Germany</option>
          <option value="DK">Denmark</option>
          <option value="ES">Spain</option>
          <option value="FI">Finland</option>
          <option value="FR">France</option>
          <option value="GB">United Kingdom</option>
          <option value="IE">Ireland</option>
          <option value="IN">India</option>
          <option value="IR">Iran</option>
          <option value="MX">Mexico</option>
          <option value="NL">Netherlands</option>
          <option value="NO">Norway</option>
          <option value="NZ">New Zealand</option>
          <option value="RS">Serbia</option>
          <option value="TR">Turkey</option>
          <option value="UA">Ukraine</option>
          <option value="US">United States</option>
        </select>

       
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            checked={filters.gender === 'male'}
            onChange={handleFilterChange}
            className="h-4 w-4"
          />
          <label htmlFor="male" className="mr-4">Male</label>

          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            checked={filters.gender === 'female'}
            onChange={handleFilterChange}
            className="h-4 w-4"
          />
          <label htmlFor="female">Female</label>
        </div>
      </div>

     
      {filteredUsers.length > 0 ? (
        <ul className="bg-white shadow-md rounded-lg">
          {filteredUsers.map((user, index) => (
            <UserItem key={index} user={user} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-4 text-gray-600">Oops, no users match the selected criteria.</div>
      )}
    </div>
  );
};

export default UserList;
