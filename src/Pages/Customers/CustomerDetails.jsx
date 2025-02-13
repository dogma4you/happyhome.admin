import { useEffect, useState } from "react";
import api from '../../api/api';
import { useLocation, useParams } from "react-router-dom";
import Input from "../../Components/Input";

export default function CustomerDetails() {
  const location = useLocation();
  const params = useParams();
  console.log("🚀 ~ UserDetails ~ params:", params)
  console.log("🚀 ~ UserDetails ~ location:", location)

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    address: '',
    status: '',
  })

  useEffect(() => {
    api.get(`/admin/user/${params.id}`).then(res => {
      console.log(res.data.data);

    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-wrap gap-4">
      <Input
          label="Name"
          type="text"
          name="name"
          value={credentials.name}
          onChange={handleChange}
        />
        <Input
          label="Email"
          type="text"
          name="email"
          value={credentials.email}
          onChange={handleChange}
        />
         <Input
          label="Address"
          type="text"
          name="address"
          value={credentials.address}
          onChange={handleChange}
        />
           <Input
          label="Status"
          type="text"
          name="status"
          value={credentials.status}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-3/5 max-w-28 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-2"
        >
          Save Change
        </button>
      </form>
    </div>
  )
}
