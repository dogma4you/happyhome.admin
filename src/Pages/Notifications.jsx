import { useEffect, useState } from "react";
import api from "../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import notificationConstants from "../utils/constant.json";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notificationsData, setNotificationsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications();
  }, []);

  function getNotifications() {
    api
      .get("/notifications")
      .then((res) => {
        setNotificationsData(res.data.data);
      })
      .catch((err) => console.log(err));
  }

  const getNotificationType = (type) => {
    const types = notificationConstants.notificationTypes;
    return Object.keys(types).find((key) => types[key] === type);
  };

  function seeNotification(notification) {
    if(notification.seen == 0){
      let ctx = JSON.parse(notification.ctx);
    api
      .put(`/notifications/${notification.id}`)
      .then(() => {
        getNotifications();
        if (getNotificationType(ctx.type) == "offer") {
          navigate(`/offer/${ctx.ref}`);
        } else if (getNotificationType(ctx.type) == "purchase") {
          navigate(`/contract/${ctx.ref}`);
        } else if (getNotificationType(ctx.type) == "transaction") {
          navigate(`/transactions`, { state: { notificationID: ctx.ref } });
        } else if (getNotificationType(ctx.type) == "registration") {
          navigate(`/customers`, { state: { notificationID: ctx.ref } });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }else{
      return
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 text-center mb-8">
        Notifications
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 text-sm uppercase tracking-wider">
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">User</th>
              <th className="py-4 px-6 text-left">Title</th>
              <th className="py-4 px-6 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {notificationsData.map((notification) => (
              <tr
                key={notification.id}
                className="border-t border-gray-200 hover:bg-blue-50 transition duration-300 ease-in-out cursor-pointer"
                onClick={() => seeNotification(notification)}
              >
                <td className="py-4 px-6 text-center">
                  {notification.seen ? (
                    <FaEye className="text-green-500" title="Seen" />
                  ) : (
                    <FaEyeSlash className="text-red-500" title="Unseen" />
                  )}
                </td>
                <td className="py-4 px-6 text-gray-700 font-medium">
                  {notification.user}
                </td>
                <td className="py-4 px-6 font-semibold text-blue-600">
                  {notification.title}
                </td>
                <td className="py-4 px-6 text-gray-500">
                  {notification.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
