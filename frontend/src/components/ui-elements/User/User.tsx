import {
  ArrowRightStartOnRectangleIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../../context/AuthContext";
import { useFetchUserByEmailQuery } from "../../../redux/features/users/userSlice";
import { useSnackbar } from "../../../context/SnackbarContext";

const User = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { currentUser, logout } = useAuth();

  const { data: user = [], isLoading, isError } = useFetchUserByEmailQuery(currentUser?.email, {
    skip: !currentUser?.email,
  });

  const [theme, setTheme] = useState("Light Theme");
  const cartItems = useSelector(state => state.cart.cartItems);
  const ms = new Date().getUTCMilliseconds();

  const items = [
    {
      title: "Admin Dashboard",
      icon: <Squares2X2Icon />,
      color: "bg-indigo-300 dark:bg-indigo-800",
      href: "/dashboard",
      onclick: () => { navigateTo('/dashboard') },
    },
    {
      title: `Cart [${cartItems.length}]`,
      icon: <ShoppingBagIcon />,
      color: "bg-teal-300 dark:bg-teal-800",
      href: "/cart",
      onclick: () => { navigateTo('/cart') },
    },
    {
      title: "Favourites",
      icon: <HeartIcon />,
      color: "bg-fuchsia-300 dark:bg-fuchsia-800",
      href: "/favourites",
      onclick: () => { navigateTo('/favourites') },
    },
    // {
    //   title: theme === "light" ? "Dark theme" : "Light theme",
    //   icon: theme === "light" ? <MoonIcon /> : <SunIcon />,
    //   color: "bg-teal-300 dark:bg-teal-800",
    //   href: "/dashboard",
    //   onclick: () => onChangeThemeClick(),
    // },
    // {
    //   title: "Settings",
    //   icon: <AdjustmentsVerticalIcon />,
    //   color: "bg-fuchsia-300 dark:bg-fuchsia-800",
    //   href: "/settings",
    //   onclick: () => {},
    // },
    {
      title: "Logout",
      icon: <ArrowRightStartOnRectangleIcon />,
      color: "bg-red-300 dark:bg-red-800",
      href: "/login",
      onclick: async () => {
        await logout()
        navigateTo('/login')
        showSnackbar('Logged out Successfully!', 'success')
      },
    },
  ];

  const navigateTo = (path) => {
    navigate(path);
  };

  const onChangeThemeClick = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  return (
    <div className="relative group">
      <div className="flex items-center h-10 gap-3 rounded-lg cursor-pointer w-fit hover:bg-purple-300 dark:hover:bg-slate-800">

        <img
          src={currentUser?.photoURL != null ? currentUser?.photoURL : `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${ms}`}
          className="my-auto ml-3 rounded-full w-7 h-7"
        />
        {currentUser
          ? <p className="mr-3 font-bold text-gray-800 dark:text-gray-200 hidden sm:inline-block">{currentUser?.displayName != null ? user?.displayName : user?.displayName}</p>
          : <p className="mr-3 font-bold text-gray-800 dark:text-gray-200 hidden sm:inline-block">Hi, Bibliophile </p>
        }

      </div>
      <ul className="absolute w-72 p-2 bg-slate-50 dark:bg-gray-900 shadow-[rgba(0,_0,_0,_0.24)_0px_0px_40px] shadow-slate-400 dark:shadow-slate-700 hidden md:group-hover:flex flex-col -left-[8em] rounded-xl ">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex items-center justify-start h-16 font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
            onClick={item.onclick}
          >
            <div
              className={`h-10 w-10 ml-5 flex items-center justify-center rounded-lg ${item.color}`}
            >
              <div className="w-3/5 h -3/5 text-gray-800 dark:text-gray-200">
                {item.icon}
              </div>
            </div>
            <p className="ml-5 text-gray-600 dark:text-gray-200">
              {item.title}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
