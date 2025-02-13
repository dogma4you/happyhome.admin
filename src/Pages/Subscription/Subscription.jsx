import { useEffect, useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"; // Pencil icon
import api from "../../api/api";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import useModal from "../../store/useModal";

export default function Subscription() {
  const { setModalDetails, resetModalDetails } = useModal();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  const getSubscriptionPlans = () => {
    api
      .get("/plans")
      .then((res) => {
        setSubscriptionPlans(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    setModalDetails({
      isVisible: true,
      image: "warning",
      button1Text: "Cancel",
      button2Text: "Delete",
      button1Color: "bg-gray-500",
      button2Color: "bg-red-500",
      button1OnClick: () => resetModalDetails(),
      button2OnClick: () => {
        api
          .delete(`/plans/${id}`)
          .then(() => getSubscriptionPlans())
          .catch((err) => console.log(err))
          .finally(() => resetModalDetails());
      },
      onClose: () => resetModalDetails(),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Unlock Price</h1>
        <Button
          color="bg-green-500"
          text="Create new plan"
          onClick={() => navigate("/subscription/create")}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id} // Using plan ID for key
            className="relative flex items-center justify-between border border-blue-500 p-4 px-8 rounded-lg bg-white shadow-md"
          >
            <div className="flex flex-col items-center justify-center text-blue-500 font-bold mr-4">
              <p className="text-sm">CREDITS</p>
              <p className="text-2xl">{plan.credits}</p>
            </div>

            <div className="flex-1">
              <h2 className="text-md text-orange-500 font-bold">
                {plan.title}
              </h2>
              <p className="text-sm text-gray-500">{plan.description}</p>
              <p className="text-sm text-gray-500">
                Created at: {new Date(plan.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-blue-500">
                ${plan.price} {/* Displaying price */}
              </p>
              <p className="text-sm text-gray-500">
                Discount: ${plan.discount}
              </p>
              <p className="text-sm text-gray-500">
                {plan.published ? "Published" : "Unpublished"}
              </p>
            </div>

            <FaPencilAlt
              data-tooltip-id="tooltip"
              data-tooltip-content="Edit Plan"
              className="absolute top-2 right-2 cursor-pointer text-blue-500"
              onClick={() =>
                navigate(`/subscription/${plan.id}/edit`, { state: plan })
              }
            />
            <FaTrashAlt
              data-tooltip-id="tooltip"
              data-tooltip-content="Delete Plan"
              className="absolute top-8 right-2 cursor-pointer text-blue-500"
              onClick={() => handleDelete(plan.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
