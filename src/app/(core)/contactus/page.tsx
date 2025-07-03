"use client";
import React, { useState } from "react";
import ContactSection from "./ContactSection";
import ContactForm from "./contactForm";
import LocationMap from "./contactLocation";

const ContactUs = () => {
  return (
    <>
      <ContactSection />
      <ContactForm />
      <LocationMap />
    </>
  );
};

export default ContactUs;
