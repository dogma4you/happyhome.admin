import { useEffect, useState, useRef } from "react";
import {
  Badge,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { BellIcon } from "@heroicons/react/24/solid";
import io from "socket.io-client";
import useAuthStore from "../store/useAuthStore";
import { FaTrash, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import notificationConstants from "../utils/constant.json";

export default function Notification() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        extraHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      socketRef.current.on("notification", (newNotification) => {
        setNotifications((prevNotifications) => [
          JSON.parse(newNotification),
          ...prevNotifications,
        ]);
        setNotificationCount((prevCount) => prevCount + 1);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);

  const handleNotificationClick = () => {
    setNotificationCount(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const handleRedirect = () => {
    setIsModalOpen(false);
    navigate("/notifications");
  };

  const getNotificationType = (type) => {
    const types = notificationConstants.notificationTypes;
    return Object.keys(types).find((key) => types[key] === type);
  };

  function openNotification(notification) {
    let ctx = JSON.parse(notification.ctx);
    api
      .put(`/notifications/${notification.id}`)
      .then(() => {
        handleCloseModal();
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
  }

  return (
    <>
      {/* Notification Icon with Badge */}
      <div
        className="flex items-center gap-8"
        onClick={handleNotificationClick}
      >
        <Badge content={notificationCount} color="blue">
          <IconButton>
            <BellIcon className="h-4 w-4" />
          </IconButton>
        </Badge>
      </div>

      {/* Modal for displaying notifications */}
      <Dialog
        className="min-w-96 max-w-[600px]"
        open={isModalOpen}
        handler={handleCloseModal}
      >
        <div className="flex justify-between items-center py-2 px-1">
          <DialogHeader>Notifications</DialogHeader>
          <div
            onClick={handleRedirect}
            className="bg-green-600 px-3 py-2 flex items-center justify-center text-white rounded-md h-10 cursor-pointer"
          >
            View All Notifications
          </div>
        </div>
        <DialogBody className="max-h-[600px] overflow-y-auto" divider>
          {notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  onClick={() => openNotification(notification)}
                  className="flex items-center justify-between bg-white shadow-md rounded-md p-4 border border-gray-200 hover:bg-blue-50 transition duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <FaBell className="text-blue-500" size={20} />
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-600 transition duration-300"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <FaTrash size={20} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No new notifications</p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleCloseModal} color="blue">
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
