"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useLoading } from "@/context/LoadingContext"; // <--- import loading context

import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  DocsIcon,
  DollarLineIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  LockIcon,
  PageIcon,
  PaperPlaneIcon,
  UserCircleIcon,
} from "../icons/index";

import { parseJwt } from "@/lib/jwt";
import { checkUserAccess } from "@/api/user";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  allowedRoles?: string[];
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; allowedRoles?: string[] }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/space",
    allowedRoles: ["Client", "Admin"],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Money Account",
    path: "/space/moneyAccount",
    allowedRoles: ["Client", "Admin"],
  },
  {
    icon: <DollarLineIcon />,
    name: "Credit Pools",
    allowedRoles: ["Client", "Admin"],
    subItems: [
      { name: "Credit Pools", path: "/space/creditPool", allowedRoles: ["Client", "Admin"] },
      { name: "Your Credit Pools", path: "/space/creditPool/myCreditPools", allowedRoles: ["Client"] },
    ],
  },
  {
    name: "Garent",
    icon: <LockIcon />,
    path: "/space/garent",
    allowedRoles: ["Admin", "Agent", "Client"],
  },
  {
    name: "Request",
    icon: <PaperPlaneIcon />,
    path: "/space/request",
    allowedRoles: ["Admin", "Agent", "Auditor"],
  },
  {
    name: "User",
    icon: <UserCircleIcon />,
    path: "/space/users",
    allowedRoles: ["Admin"],
  },
  {
    name: "Logs",
    icon: <PageIcon />,
    path: "/space/activities",
    allowedRoles: ["Admin", "Auditor"],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { setLoading } = useLoading(); // <-- get setLoading from context

  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isAgent, setIsAgent] = useState(false);
  const [isAuditor, setIsAuditor] = useState(false);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];

        let roles: string[] = [];

        if (token) {
          const decoded = parseJwt(token);
          if (decoded?.roles) {
            roles = decoded.roles;

            const isAgentRole = roles.includes("Agent");
            const isAuditorRole = roles.includes("Auditor");
            const isAdminRole = roles.includes("Admin");

            setUserRoles(roles);
            setIsAgent(isAgentRole);
            setIsAuditor(isAuditorRole);

            const accessGrantedByRequest = await checkUserAccess();
            const isOnlyClient = roles.length === 1 && roles.includes("Client");

            const finalAccess =
                isAdminRole || isAgentRole || isAuditorRole || (isOnlyClient && accessGrantedByRequest);

            setHasAccess(finalAccess);
            return;
          }
        }

        setHasAccess(false);
      } catch (error) {
        console.error("Error checking access:", error);
        setHasAccess(false);
      }
    };

    fetchAccess();
  }, []);

  const hasRole = useCallback(
      (roles?: string[]) => {
        if (!roles) return true;
        return roles.some((role) => userRoles.includes(role));
      },
      [userRoles]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { type: "main", index }));
  };

  // Navigation click handler to set loading + navigate
  const handleNavigate = async (path: string) => {
    setLoading(true);
    await router.push(path);
    // Optional delay to avoid flicker:
    setTimeout(() => setLoading(false), 300);
  };

  const renderMenuItems = (items: NavItem[]) => (
      <ul className="flex flex-col gap-4">
        {hasAccess === false && (isAgent || isAuditor || userRoles.includes("Client")) && (
            <li>
              <button
                  onClick={() => handleNavigate("/space/request/submitRequest")}
                  className="w-full flex items-center gap-2 text-white bg-brand-600 hover:bg-brand-700 transition px-4 py-2 rounded-lg text-sm"
              >
                <PaperPlaneIcon className="w-4 h-4" />
                <span>Submit a Request</span>
              </button>
            </li>
        )}

        {(userRoles.length === 0 ? items : items.filter((nav) => hasRole(nav.allowedRoles))).map((nav, index) => (
            <li key={nav.name}>
              {nav.subItems ? (
                  <>
                    <button
                        onClick={() => handleSubmenuToggle(index)}
                        className={`menu-item group ${
                            openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
                        } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                    >
                <span
                    className={`${
                        openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                      {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                      {(isExpanded || isHovered || isMobileOpen) && (
                          <ChevronDownIcon
                              className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                  openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                              }`}
                          />
                      )}
                    </button>
                    <div
                        ref={(el) => {
                          subMenuRefs.current[`main-${index}`] = el;
                        }}
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          height: openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px",
                        }}
                    >
                      <ul className="mt-2 space-y-1 ml-9">
                        {(userRoles.length === 0
                                ? nav.subItems
                                : nav.subItems.filter((subItem) => hasRole(subItem.allowedRoles))
                        ).map((subItem) => (
                            <li key={subItem.name}>
                              <button
                                  onClick={() => handleNavigate(subItem.path)}
                                  className={`menu-dropdown-item ${
                                      isActive(subItem.path)
                                          ? "menu-dropdown-item-active"
                                          : "menu-dropdown-item-inactive"
                                  }`}
                              >
                                {subItem.name}
                                <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                              <span
                                  className={`menu-dropdown-badge ${
                                      isActive(subItem.path)
                                          ? "menu-dropdown-badge-active"
                                          : "menu-dropdown-badge-inactive"
                                  }`}
                              >
                              new
                            </span>
                          )}
                                  {subItem.pro && (
                                      <span
                                          className={`menu-dropdown-badge ${
                                              isActive(subItem.path)
                                                  ? "menu-dropdown-badge-active"
                                                  : "menu-dropdown-badge-inactive"
                                          }`}
                                      >
                              pro
                            </span>
                                  )}
                        </span>
                              </button>
                            </li>
                        ))}
                      </ul>
                    </div>
                  </>
              ) : (
                  nav.path && (
                      <button
                          onClick={() => handleNavigate(nav.path!)}
                          className={`menu-item group ${
                              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                          }`}
                      >
                <span
                    className={`${
                        isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                        {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                      </button>
                  )
              )}
            </li>
        ))}
      </ul>
  );

  return (
      <aside
          className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
              isExpanded || isMobileOpen
                  ? "w-[290px]"
                  : isHovered
                      ? "w-[290px]"
                      : "w-[90px]"
          } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
          onMouseEnter={() => !isExpanded && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
          <div className="flex justify-center items-center w-full">
            <a href="/">
              {isExpanded || isHovered || isMobileOpen ? (
                  <>
                    <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
                    <Image className="hidden dark:block" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
                  </>
              ) : (
                  <Image src="/images/logo/logos.svg" alt="Logo" width={32} height={32} />
              )}
            </a>
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
            >
              {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
            </h2>
            {renderMenuItems(navItems)}
          </nav>
        </div>
      </aside>
  );
};

export default AppSidebar;
