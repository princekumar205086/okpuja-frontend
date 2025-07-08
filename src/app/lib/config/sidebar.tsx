"use client";
import React from "react";
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Assessment as ReportsIcon,
  Person as ProfileIcon,
  AutoAwesome as PujaIcon,
  StarBorder as AstrologyIcon,
  CalendarMonth as BookingIcon,
  Schedule as ScheduleIcon,
  CurrencyRupee as PaymentIcon,
  SupportAgent as SupportIcon,
  Article as BlogIcon,
  PhotoLibrary as GalleryIcon,
  Policy as CmsIcon,
  Campaign as PromoIcon,
  Event as EventIcon,
  Work as JobIcon,
  Gavel as TermsIcon,
} from "@mui/icons-material";

export const getSidebarItems = (userType: "admin" | "employee" | "user") => {
  const adminItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },

    // Bookings & Payments
    { text: "Bookings", icon: <BookingIcon />, path: "/admin/bookings" },
    { text: "Payments", icon: <PaymentIcon />, path: "/admin/payments" },

    // Manage Services
    { text: "Puja Services", icon: <PujaIcon />, path: "/admin/puja-services" },
    { text: "Astrology Services", icon: <AstrologyIcon />, path: "/admin/astrology-services" },

    // Content
    { text: "Blog", icon: <BlogIcon />, path: "/admin/blog" },
    { text: "Gallery", icon: <GalleryIcon />, path: "/admin/gallery" },

    // Promo & CMS
    { text: "Promotions", icon: <PromoIcon />, path: "/admin/promotions" },
    { text: "CMS & Policies", icon: <CmsIcon />, path: "/admin/cms-policies" },

    // Support & Jobs
    { text: "Support", icon: <SupportIcon />, path: "/admin/support" },
    { text: "Events", icon: <EventIcon />, path: "/admin/events" },
    { text: "Job Openings", icon: <JobIcon />, path: "/admin/jobs" },

    // Users & Settings
    { text: "Users", icon: <UsersIcon />, path: "/admin/users" },
    { text: "Employees", icon: <UsersIcon />, path: "/admin/employees" },

    { text: "Reports", icon: <ReportsIcon />, path: "/admin/reports" },
    { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
  ];

  const employeeItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/employee/dashboard" },
    { text: "Assigned Bookings", icon: <BookingIcon />, path: "/employee/bookings" },
    { text: "Payments", icon: <PaymentIcon />, path: "/employee/payments" },
    { text: "Schedule", icon: <ScheduleIcon />, path: "/employee/schedule" },
    { text: "Profile", icon: <ProfileIcon />, path: "/employee/profile" },
  ];

  const userItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/user/dashboard" },
    { text: "Book Puja", icon: <PujaIcon />, path: "/user/book-puja" },
    { text: "Astrology", icon: <AstrologyIcon />, path: "/user/astrology" },
    { text: "My Bookings", icon: <BookingIcon />, path: "/user/bookings" },
    { text: "Payments", icon: <PaymentIcon />, path: "/user/payments" },
    { text: "My Promo Codes", icon: <PromoIcon />, path: "/user/promos" },
    { text: "Blog", icon: <BlogIcon />, path: "/user/blog" },
    { text: "Gallery", icon: <GalleryIcon />, path: "/user/gallery" },
    { text: "Events", icon: <EventIcon />, path: "/user/events" },
    { text: "Support", icon: <SupportIcon />, path: "/user/support" },
    { text: "Profile", icon: <ProfileIcon />, path: "/user/profile" },
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
