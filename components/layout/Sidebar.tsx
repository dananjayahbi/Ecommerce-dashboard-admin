"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  ShoppingBag,
  Settings,
  LayoutDashboard as LayoutDashboard,
  Inbox,
  FileText,
  MessageSquare,
  CreditCard,
  User2,
} from "lucide-react";
import Image from "next/image";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  isActive,
  onClick,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 text-sm font-semibold tracking-wider ${
        isActive
          ? "bg-blue-500 text-white rounded"
          : "text-gray-800 hover:bg-gray-100 rounded"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

type SidebarProps = {
  collapsed?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div
      className={`h-screen bg-white ${
        collapsed ? "w-16" : "w-60"
      } fixed left-0 flex flex-col shadow-sm transition-all duration-300`}
    >
      <div className="p-4">
        <h1
          className={`text-xl font-extrabold text-blue-500 ${
            collapsed ? "hidden" : "block"
          }`}
        >
          DashStack
        </h1>
        {collapsed && <LayoutDashboard className="mx-auto text-blue-500" size={24} />}
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="mb-4">
          {collapsed ? (
            <>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard">
                  <BarChart3
                    size={18}
                    className={
                      pathname === "/dashboard"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard/products">
                  <ShoppingBag
                    size={18}
                    className={
                      pathname === "/dashboard/products"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard/inbox">
                  <Inbox
                    size={18}
                    className={
                      pathname === "/dashboard/inbox"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard/orders">
                  <FileText
                    size={18}
                    className={
                      pathname === "/dashboard/orders"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard/stock">
                  <ShoppingBag
                    size={18}
                    className={
                      pathname === "/dashboard/stock"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
            </>
          ) : (
            <>
              <NavItem
                icon={<BarChart3 size={18} />}
                label="Dashboard"
                href="/dashboard"
                isActive={pathname === "/dashboard"}
              />
              <NavItem
                icon={<ShoppingBag size={18} />}
                label="Products"
                href="/dashboard/products"
                isActive={pathname === "/dashboard/products"}
              />
              <NavItem
                icon={<Inbox size={18} />}
                label="Inbox"
                href="/dashboard/inbox"
                isActive={pathname === "/dashboard/inbox"}
              />
              <NavItem
                icon={<FileText size={18} />}
                label="Order Lists"
                href="/dashboard/orders"
                isActive={pathname === "/dashboard/orders"}
              />
              <NavItem
                icon={<ShoppingBag size={18} />}
                label="Product Stock"
                href="/dashboard/stock"
                isActive={pathname === "/dashboard/stock"}
              />
            </>
          )}
        </div>

        <div className="px-4 py-2">
          <div className="border-t border-gray-200 w-full"></div>
        </div>

        <div className={`${collapsed ? "hidden" : "px-4 opacity-60 mb-2"}`}>
          <span className="text-xs font-bold tracking-wider text-gray-800">
            PAGES
          </span>
        </div>

        <div className="mb-4">
          {collapsed ? (
            <>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard/contact">
                  <MessageSquare
                    size={18}
                    className={
                      pathname === "/dashboard/contact"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard/invoice">
                  <CreditCard
                    size={18}
                    className={
                      pathname === "/dashboard/invoice"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard/team">
                  <User2
                    size={18}
                    className={
                      pathname === "/dashboard/team"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
            </>
          ) : (
            <>
              <NavItem
                icon={<MessageSquare size={18} />}
                label="Contact"
                href="/dashboard/contact"
                isActive={pathname === "/dashboard/contact"}
              />
              <NavItem
                icon={<CreditCard size={18} />}
                label="Invoice"
                href="/dashboard/invoice"
                isActive={pathname === "/dashboard/invoice"}
              />
              <NavItem
                icon={<User2 size={18} />}
                label="Team"
                href="/dashboard/team"
                isActive={pathname === "/dashboard/team"}
              />
            </>
          )}
        </div>

        <div className="mt-auto">
          {collapsed ? (
            <>
              <div className="flex justify-center py-2.5">
                <Link href="/dashboard/settings">
                  <Settings
                    size={18}
                    className={
                      pathname === "/dashboard/settings"
                        ? "text-blue-500"
                        : "text-gray-800 hover:text-blue-500"
                    }
                  />
                </Link>
              </div>
            </>
          ) : (
            <>
              <NavItem
                icon={<Settings size={18} />}
                label="Settings"
                href="/dashboard/settings"
                isActive={pathname === "/dashboard/settings"}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
