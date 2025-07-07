"use client";
import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Assessment as ReportsIcon,
  Person as ProfileIcon,
  AutoAwesome as PujaIcon,
  StarBorder as AstrologyIcon,
  CalendarMonth as BookingIcon,
  Schedule as AppointmentIcon,
  CurrencyRupee as PaymentIcon,
  SupportAgent as SupportIcon,
  AccessTime as ScheduleIcon,
} from "@mui/icons-material";

export const getSidebarItems = (userType: "admin" | "employee" | "user") => {
  const adminItems = [
    { text: "Dashboard", icon: React.createElement(DashboardIcon), path: "/admin/dashboard" },
    { text: "Users", icon: React.createElement(UsersIcon), path: "/admin/users" },
    { text: "Employees", icon: React.createElement(UsersIcon), path: "/admin/employees" },
    { text: "Puja Services", icon: React.createElement(PujaIcon), path: "/admin/puja-services" },
    { text: "Astrology", icon: React.createElement(AstrologyIcon), path: "/admin/astrology" },
    { text: "Bookings", icon: React.createElement(BookingIcon), path: "/admin/bookings" },
    { text: "Payments", icon: React.createElement(PaymentIcon), path: "/admin/payments" },
    { text: "Reports", icon: React.createElement(ReportsIcon), path: "/admin/reports" },
    { text: "Settings", icon: React.createElement(SettingsIcon), path: "/admin/settings" },
  ];

  const employeeItems = [
    { text: "Dashboard", icon: React.createElement(DashboardIcon), path: "/employee/dashboard" },
    { text: "My Services", icon: React.createElement(PujaIcon), path: "/employee/services" },
    { text: "Appointments", icon: React.createElement(AppointmentIcon), path: "/employee/appointments" },
    { text: "Schedule", icon: React.createElement(ScheduleIcon), path: "/employee/schedule" },
    { text: "Earnings", icon: React.createElement(PaymentIcon), path: "/employee/earnings" },
    { text: "Profile", icon: React.createElement(ProfileIcon), path: "/employee/profile" },
  ];

  const userItems = [
    { text: "Dashboard", icon: React.createElement(DashboardIcon), path: "/user/dashboard" },
    { text: "Book Puja", icon: React.createElement(PujaIcon), path: "/user/book-puja" },
    { text: "Astrology", icon: React.createElement(AstrologyIcon), path: "/user/astrology" },
    { text: "My Bookings", icon: React.createElement(BookingIcon), path: "/user/bookings" },
    { text: "Appointments", icon: React.createElement(AppointmentIcon), path: "/user/appointments" },
    { text: "Payments", icon: React.createElement(PaymentIcon), path: "/user/payments" },
    { text: "Support", icon: React.createElement(SupportIcon), path: "/user/support" },
    { text: "Profile", icon: React.createElement(ProfileIcon), path: "/user/profile" },
  ];

  switch (userType) {
    case "admin":
      return adminItems;
    case "employee":
      return employeeItems;
    case "user":
      return userItems;
    default:
      return [];
  }
};

export type SidebarItem = ReturnType<typeof getSidebarItems>[0];
