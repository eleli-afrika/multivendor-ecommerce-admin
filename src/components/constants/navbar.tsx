import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Links } from "../../Data/links";
import close from "../../assets/close.png";
import menu from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import {
    MessageRounded,
    NotificationsActive,
    KeyboardArrowDown,
} from "@mui/icons-material";
import { adminProps } from "../../interface/common";

const Navbar: React.FC = () => {
    const [toggle, setToggle] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<adminProps | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const openMenu = Boolean(anchorEl);

    const activePath = useMemo(() => location.pathname, [location.pathname]);



    const loadAdminFromStorage = () => {
        const storedAdmin = localStorage.getItem("admin");
        const storedToken = localStorage.getItem("adminToken");

        if (storedAdmin && storedToken) {
            try {
                setUser(JSON.parse(storedAdmin));
            } catch (error) {
                console.error("Failed to parse admin from localStorage:", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        loadAdminFromStorage();
    }, [location.pathname]);

    useEffect(() => {
        const handleStorageChange = () => {
            loadAdminFromStorage();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        setAnchorEl(null);
        setToggle(false);
        navigate("/login");
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorEl(null);
    };

    return (
        <nav
            className={`fixed top-0 z-20 w-full px-5 transition-all duration-300 ${scrolled ? "bg-white shadow-custom" : "bg-white shadow-sm"
                }`}
        >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between py-3">
                <Link
                    to="/"
                    className="flex items-center gap-2"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <img src={logo} alt="logo" className="logo object-contain" />
                </Link>

                <div className="hidden items-center gap-8 sm:flex">
                    <ul className="flex list-none flex-row gap-8">
                        {Links.map((nav) => {
                            const isActive = activePath === nav.url;

                            return (
                                <li key={nav.name}>
                                    <Link
                                        to={nav.url}
                                        className={`text-[18px] font-medium capitalize transition ${isActive
                                            ? "text-primary-orange"
                                            : "text-black hover:text-primary-orange"
                                            }`}
                                    >
                                        {nav.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <IconButton
                                sx={{
                                    color: "#DC5F00",
                                    backgroundColor: "#eee",
                                    "&:hover": { backgroundColor: "#e5e5e5" },
                                }}
                                onClick={() => navigate("/messages")}
                            >
                                <MessageRounded />
                            </IconButton>

                            <IconButton
                                sx={{
                                    color: "#DC5F00",
                                    backgroundColor: "#eee",
                                    "&:hover": { backgroundColor: "#e5e5e5" },
                                }}
                                onClick={() => navigate("/notifications")}
                            >
                                <NotificationsActive />
                            </IconButton>

                            <button
                                onClick={handleOpenUserMenu}
                                className="flex items-center gap-2 rounded-md bg-[#eee] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e5e5e5]"
                            >
                                <span>{user.adminname}</span>
                                <KeyboardArrowDown fontSize="small" />
                            </button>

                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseUserMenu}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                transformOrigin={{ vertical: "top", horizontal: "right" }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleCloseUserMenu();
                                        navigate("/");
                                    }}
                                >
                                    <Typography>{user.adminname}</Typography>
                                </MenuItem>

                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <button
                            className="rounded bg-primary-orange px-4 py-2 text-white transition hover:bg-secondary-orange"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>
                    )}
                </div>

                <div className="flex flex-1 justify-end items-center sm:hidden">
                    <IconButton
                        sx={{
                            color: "#991b1b",
                            backgroundColor: "#eee",
                            "&:hover": { backgroundColor: "#e5e5e5" },
                        }}
                        onClick={() => setToggle((prev) => !prev)}
                    >
                        <img
                            src={toggle ? close : menu}
                            alt="menu"
                            className="h-6 w-6 object-contain"
                        />
                    </IconButton>

                    <div
                        className={`absolute right-0 top-20 z-10 mx-4 my-2 min-w-[280px] rounded-xl bg-white p-6 shadow-xl ${!toggle ? "hidden" : "flex"
                            }`}
                    >
                        <div className="flex w-full flex-col gap-4">
                            <ul className="flex list-none flex-col gap-4">
                                {Links.map((nav) => {
                                    const isActive = activePath === nav.url;

                                    return (
                                        <li key={nav.name}>
                                            <Link
                                                to={nav.url}
                                                className={`text-[16px] font-medium capitalize ${isActive ? "text-primary-orange" : "text-black"
                                                    }`}
                                                onClick={() => setToggle(false)}
                                            >
                                                {nav.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            {user ? (
                                <div className="mt-2 flex flex-col gap-3 border-t pt-4">
                                    <div className="text-sm font-medium text-gray-700">
                                        {user.adminname}
                                    </div>

                                    <button
                                        className="rounded bg-gray-100 px-4 py-2 text-left text-sm hover:bg-gray-200"
                                        onClick={() => {
                                            setToggle(false);
                                            navigate("/messages");
                                        }}
                                    >
                                        Messages
                                    </button>

                                    <button
                                        className="rounded bg-gray-100 px-4 py-2 text-left text-sm hover:bg-gray-200"
                                        onClick={() => {
                                            setToggle(false);
                                            navigate("/notifications");
                                        }}
                                    >
                                        Notifications
                                    </button>

                                    <button
                                        className="rounded bg-primary-orange px-4 py-2 text-left text-sm text-white hover:bg-secondary-orange"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="mt-2 rounded bg-primary-orange px-4 py-2 text-white hover:bg-secondary-orange"
                                    onClick={() => {
                                        setToggle(false);
                                        navigate("/login");
                                    }}
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;