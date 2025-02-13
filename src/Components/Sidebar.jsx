import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  // ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  UsersIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentChartBarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import logo from "../Images/MainLogo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function Sidebar() {
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  const tabs = {
    section1: [
      {
        name: "Dashboard",
        icon: PresentationChartBarIcon,
        link: "/",
      },
      {
        name: "Employees",
        icon: UsersIcon,
        link: "/employees",
      },
      {
        name: "Customers",
        icon: UsersIcon,
        link: "/customers",
      },
      {
        name: "Contracts",
        icon: DocumentIcon,
        link: "/contracts/listed",
      },
      {
        name: "Offers",
        icon: DocumentTextIcon,
        link: "/offers",
      },
      {
        name: "Transactions",
        icon: DocumentChartBarIcon,
        link: "/transactions",
      },
      {
        name: "Unlock Price",
        icon: CreditCardIcon,
        link: "/subscription",
      },
      {
        name: "Notifications",
        icon: InboxIcon,
        link: "/notifications",
      },
      {
        name: "Subscriptions",
        icon: CreditCardIcon,
        link: "/subscriptions/book",
      }
      // {
      //   name: "CMS",
      //   icon: ShoppingBagIcon,
      //   submenu: [
      //     { name: "FAQ", link: "/cms/faq" },
      //     { name: "What's New", link: "/cms/whats-new" },
      //     { name: "Main Page", link: "/cms/main-page" },
      //     { name: "Top - Section", link: "/cms/top-section" },
      //     { name: "What we do - seller", link: "/cms/what-we-do-seller" },
      //     { name: "What we do - buyer", link: "/cms/what-we-do-buyer" },
      //   ],
      // },
    ],
    section2: [
      {
        name: "Settings",
        icon: Cog6ToothIcon,
        link: "/settings",
      },
      {
        name: "Payment",
        icon: CreditCardIcon,
        link: "/payment",
      },
      {
        name: "Account",
        icon: UserCircleIcon,
        link: "/account/account-details",
      },
      {
        name: "Logout",
        icon: PowerIcon,
        link: "/login",
      },
    ],
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/offer")) {
      setActiveTab("/offers");
    } else if (path.includes("/employee")) {
      setActiveTab("/employees");
    } else if (path.includes("/contract")) {
      setActiveTab("/contracts/listed");
    } 
    
    
    
    else {
      setActiveTab(path);
    }
  }, [location]);

  const [activeTab, setActiveTab] = useState("/");
  const [open, setOpen] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const renderListItem = (item, index) => {
    const Icon = item.icon;
    return (
      <ListItem
        key={index}
        onClick={() => handleClick(item)}
        className={activeTab === item.link ? "bg-blue-gray-50" : ""}
      >
        <ListItemPrefix>
          <Icon className="h-5 w-5" />
        </ListItemPrefix>
        {item.name}
      </ListItem>
    );
  };
  const renderAccordion = (item, index) => {
    return (
      <Accordion
        key={index}
        open={open === index + 1}
        icon={
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`mx-auto h-4 w-4 transition-transform ${
              open === index + 1 ? "rotate-180" : ""
            }`}
          />
        }
      >
        <ListItem className="p-0" selected={open === index + 1}>
          <AccordionHeader
            onClick={() => handleOpen(index + 1)}
            className="border-b-0 p-3"
          >
            <ListItemPrefix>
              <item.icon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              {item.name}
            </Typography>
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          <List className="p-0">
            {item.submenu.map((subItem, subIndex) => (
              <ListItem key={subIndex} onClick={() => handleClick(subItem)}>
                {subItem.name}
              </ListItem>
            ))}
          </List>
        </AccordionBody>
      </Accordion>
    );
  };

  const handleClick = (item) => {
    if (item.link) {
      if (item.name === "Logout") {
        logout();
        navigate("/login");
      } else {
        setActiveTab(item.link);
        navigate(item.link);
      }
    } else {
      console.log(`No link defined for ${item.name}`);
    }
  };

  return (
    <Card className="min-h-screen w-full max-w-[20rem] p-4 shadow shadow-blue-gray-700 rounded-none overflow-auto">
      <div className="mb-2 p-4">
        <Typography className="cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" />
        </Typography>
      </div>
      <List className="flex flex-col justify-between h-full">
        <div>
          <div>
            {tabs.section1.map((item, index) =>
              item.submenu
                ? renderAccordion(item, index)
                : renderListItem(item, index)
            )}
          </div>
        </div>
        <div>
          <hr className="my-2 border-blue-gray-50" />
          {tabs.section2.map((item, index) =>
            item.submenu
              ? renderAccordion(item, index)
              : renderListItem(item, index)
          )}
        </div>
      </List>
    </Card>
  );
}
