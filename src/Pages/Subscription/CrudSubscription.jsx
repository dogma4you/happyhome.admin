import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
// import Textarea from "../../Components/Textarea";
import api from "../../api/api";

export default function CrudSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [plan, setPlan] = useState(() => {
    if (location.state) {
      return location.state; 
    } else {
      return {
        title: "",
        credits: "",
        price: "",
        discount: "",
        description: ""
      };
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlan((prevPlan) => ({ ...prevPlan, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      // Update existing plan
      api
        .put(`/plans/${id}`, plan)
        .then(() => navigate("/subscription"))
        .catch((err) => console.log(err));
    } else {
      // Create a new plan
      api
        .post("/plans", plan)
        .then(() => navigate("/subscription"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Plan" : "Create New Plan"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={plan.title}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Credits"
          name="credits"
          value={plan.credits}
          onChange={handleInputChange}
          required
          allowNumbers
        />

        <Input
          label="Price"
          name="price"
          value={plan.price}
          onChange={handleInputChange}
          required
          allowNumbers
        />

        <Input
          label="Discount ($)"
          name="discount"
          value={plan.discount}
          onChange={handleInputChange}
          required
          allowNumbers
        />

        {/* <Textarea
          label="Description"
          name="description"
          value={plan.description}
          onChange={handleInputChange}
          required
        /> */}

        <Button color="bg-blue-500" text={id ? "Update Plan" : "Create Plan"} />
      </form>
    </div>
  );
}
