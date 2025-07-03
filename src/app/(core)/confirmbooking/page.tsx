"use client";
import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaDownload,
  FaShare,
  FaPrint,
  FaPhoneAlt,
  FaEnvelope,
  FaQuestionCircle,
  FaClock,
  FaMapMarkerAlt,
  FaLanguage,
  FaUser,
  FaMobile,
  FaEnvelopeOpen,
  FaLocationArrow,
  FaMapPin,
} from "react-icons/fa";
import { fetchBookingDetails } from "./action";
import { jsPDF } from "jspdf";
import Loader from "@/app/utils/loader";
import Link from "next/link";

const BookingSuccess = () => {
  interface BookingDetails {
    id: number;
    BookId: string;
    payments: {
      transactionId: string;
      status: string;
      amount: number;
      method?: string;
      createdAt: string;
    }[];
    cart: {
      pujaService: {
        title: string;
      };
      selected_date: string;
      selected_time: string;
      package: {
        location: string;
        language: string;
        type: string;
        description: string;
      };
    };
    user: {
      username: string;
      email: string;
      contact: string;
    };
    addresses: {
      addressline: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      addressline2?: string;
    };
  }

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams("");

  const userId = Number(urlParams?.get("userId"));
  const cartId = urlParams?.get("cartId");

  useEffect(() => {
    if (!userId || !cartId) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const data = await fetchBookingDetails(userId, cartId);
        if (data) {
          setBookingDetails(data);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();

    // Remove userId and cartId from the URL (without reloading the page)
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, window.location.pathname);
      // Remove the cart item from localStorage
      window.localStorage.removeItem("cart");
    }
  }, [userId, cartId]);

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("OKPUJA Service Booking Invoice", 20, 20);

    // Booking Details Section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      `Booking ID: OK${bookingDetails?.id}-${bookingDetails?.BookId}`,
      20,
      40
    );
    doc.text(
      `Transaction ID: ${bookingDetails?.payments[0]?.transactionId}`,
      20,
      50
    );
    doc.text(`Payment Status: ${bookingDetails?.payments[0]?.status}`, 20, 60);

    // Payment Information Section
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Amount Paid: RS. ${((bookingDetails?.payments?.[0]?.amount ?? 0) / 100).toFixed(
        2
      )}`,
      20,
      85
    );
    doc.text(
      `Payment Method: ${bookingDetails?.payments[0]?.method || "NET BANKING"}`,
      20,
      95
    );
    doc.text(
      `Payment Date: ${new Date(
        bookingDetails?.payments[0]?.createdAt ?? ""
      ).toLocaleString()}`,
      20,
      105
    );

    // Service Details Section
    doc.setFont("helvetica", "bold");
    doc.text("Service Details", 20, 120);
    doc.setFont("helvetica", "normal");
    doc.text(`Puja Name: ${bookingDetails?.cart?.pujaService?.title}`, 20, 130);
    doc.text(
      `Date & Time: ${new Date(
        bookingDetails?.cart?.selected_date ?? ""
      ).toLocaleDateString()} | ${bookingDetails?.cart?.selected_time}`,
      20,
      140
    );
    doc.text(`Location: ${bookingDetails?.cart?.package?.location}`, 20, 150);
    doc.text(`Language: ${bookingDetails?.cart?.package?.language}`, 20, 160);
    doc.text("Package Details:", 20, 170);
    const html = bookingDetails?.cart?.package?.description;
    const div = document.createElement("div");
    div.innerHTML = html || "";
    doc.text(div.textContent || "", 20, 180);
    doc.text(`No. of Pandit: ${noOfPandits || "N/A"}`, 20, 190);
    doc.text(`Puja Duration: ${pujaDuration || "N/A"}`, 20, 200);

    // User Information Section
    doc.setFont("helvetica", "bold");
    doc.text("User Information", 110, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`User Name: ${bookingDetails?.user?.username}`, 110, 85);
    doc.text(`Email: ${bookingDetails?.user?.email}`, 110, 95);
    doc.text(`Mobile: ${bookingDetails?.user?.contact}`, 110, 105);

    // Address Information Section
    doc.setFont("helvetica", "bold");
    doc.text("Address Information", 110, 120);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Address: ${bookingDetails?.addresses?.addressline}, ${bookingDetails?.addresses?.city}, ${bookingDetails?.addresses?.state}, ${bookingDetails?.addresses?.country}, ${bookingDetails?.addresses?.postalCode}`,
      110,
      130
    );
    doc.text(
      `Landmark: ${bookingDetails?.addresses?.addressline2 || "N/A"}`,
      110,
      140
    );

    // Footer Section
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing OKPUJA!", 20, 220);
    doc.text("For any inquiries, please contact our support team.", 20, 230);

    // Save the file
    doc.save("OKPUJA_Service_Booking_Invoice.pdf");
  };

  const handleShareDetails = () => {
    const shareData = {
      title: "Puja Booking Details",
      text: `Puja Booking ID: OK${bookingDetails?.id}-${
        bookingDetails?.BookId
      }\nTransaction ID: ${
        bookingDetails?.payments[0]?.transactionId
      }\nAmount Paid: ₹${
        (bookingDetails?.payments?.[0]?.amount ?? 0) / 100
      }\nPayment Status: ${bookingDetails?.payments[0]?.status}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Sharing is not supported in your browser");
    }
  };

  // switch case for noOfPandits and pujaDuration
  let noOfPandits: number | string;
  let pujaDuration: string;
  switch (bookingDetails?.cart?.package?.type) {
    case "Basic":
      noOfPandits = 1;
      pujaDuration = "1.5 hrs";
      break;
    case "Standard":
      noOfPandits = 2;
      pujaDuration = "2 hrs - 2.5 hrs";
      break;
    case "Premium":
      noOfPandits = "3-5";
      pujaDuration = "2.5 hrs - 3.5 hrs";
      break;
    default:
      noOfPandits = 1;
      pujaDuration = "1.5 hrs";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
        <Loader />
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100 p-4">
        <FaQuestionCircle className="text-orange-600 text-5xl mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
          Booking Information Not Found
        </h1>
        <p className="text-gray-600 text-md md:text-lg text-center max-w-md">
          We couldn&apos;t retrieve your booking details. Please contact our support
          team for assistance.
        </p>
        <Link
          href="/"
          className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors text-center"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <header className="bg-transparent shadow-md py-4 h-20"></header>
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="text-center mb-8 md:mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-30 animate-pulse"></div>
            <FaCheckCircle className="text-green-600 text-5xl md:text-6xl mx-auto mb-4 relative z-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
            Puja Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-md md:text-lg px-2">
            Thank you for choosing OKPUJA. We&apos;re honored to serve you on this
            auspicious occasion.
          </p>
          <div className="mt-3 md:mt-4 bg-orange-100 rounded-lg py-2 px-4 inline-block">
            <p className="text-gray-700">
              Your booking ID is{" "}
              <span className="font-semibold text-orange-600">
                OK{bookingDetails?.id}-{bookingDetails?.BookId}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-2 border-gray-100">
            Transaction Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                icon: <FaCheckCircle className="text-orange-500" />,
                label: "Booking ID",
                value: `OK${bookingDetails?.id}-${bookingDetails?.BookId}`,
              },
              {
                icon: <FaClock className="text-orange-500" />,
                label: "Transaction ID",
                value: bookingDetails?.payments[0]?.transactionId,
              },
              {
                icon: <FaDownload className="text-orange-500" />,
                label: "Amount Paid",
                value: `₹ ${bookingDetails?.payments[0]?.amount / 100}`,
              },
              {
                icon: <FaShare className="text-orange-500" />,
                label: "Payment Method",
                value: bookingDetails?.payments[0]?.method || "NET BANKING",
              },
              {
                icon: <FaClock className="text-orange-500" />,
                label: "Payment Date",
                value: new Date(
                  bookingDetails?.payments[0]?.createdAt
                ).toLocaleString(),
              },
              {
                icon: <FaCheckCircle className="text-orange-500" />,
                label: "Payment Status",
                value: bookingDetails?.payments[0]?.status,
                valueClass:
                  bookingDetails?.payments[0]?.status === "captured"
                    ? "text-green-600 font-medium"
                    : "text-orange-600 font-medium",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50"
              >
                <span className="mt-1">{item.icon}</span>
                <div>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                  <p
                    className={`text-gray-800 font-medium ${
                      item.valueClass || ""
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-2 border-gray-100">
            Booking Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                icon: <FaCheckCircle className="text-orange-500" />,
                label: "Puja Name",
                value: bookingDetails?.cart?.pujaService?.title,
              },
              {
                icon: <FaClock className="text-orange-500" />,
                label: "Date & Time",
                value: `${new Date(
                          bookingDetails?.cart?.selected_date ?? ""
                        ).toLocaleDateString()} | ${
                          bookingDetails?.cart?.selected_time
                        }`,
              },
              {
                icon: <FaMapMarkerAlt className="text-orange-500" />,
                label: "Location",
                value: bookingDetails?.cart?.package?.location,
              },
              {
                icon: <FaLanguage className="text-orange-500" />,
                label: "Language",
                value: bookingDetails?.cart?.package?.language,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50"
              >
                <span className="mt-1">{item.icon}</span>
                <div>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                  <p className="text-gray-800 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 border-gray-100">
            <div className="flex items-start space-x-3 mb-3">
              <span className="mt-1 text-orange-500">
                <FaCheckCircle />
              </span>
              <div>
                <p className="text-gray-500 text-sm">Package Details</p>
                <div
                  className="text-gray-800 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: bookingDetails?.cart?.package?.description,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50">
                <span className="mt-1 text-orange-500">
                  <FaUser />
                </span>
                <div>
                  <p className="text-gray-500 text-sm">No. of Pandit</p>
                  <p className="text-gray-800 font-medium">{noOfPandits}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50">
                <span className="mt-1 text-orange-500">
                  <FaClock />
                </span>
                <div>
                  <p className="text-gray-500 text-sm">Puja Duration</p>
                  <p className="text-gray-800 font-medium">{pujaDuration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-2 border-gray-100">
            Address Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                icon: <FaUser className="text-orange-500" />,
                label: "Name",
                value: bookingDetails?.user?.username,
              },
              {
                icon: <FaMobile className="text-orange-500" />,
                label: "Mobile",
                value: bookingDetails?.user?.contact,
              },
              {
                icon: <FaEnvelopeOpen className="text-orange-500" />,
                label: "Email",
                value: bookingDetails?.user?.email,
              },
              {
                icon: <FaMapPin className="text-orange-500" />,
                label: "Pincode",
                value: bookingDetails?.addresses?.postalCode,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50"
              >
                <span className="mt-1">{item.icon}</span>
                <div>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                  <p className="text-gray-800 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50">
              <span className="mt-1 text-orange-500">
                <FaLocationArrow />
              </span>
              <div>
                <p className="text-gray-500 text-sm">Complete Address</p>
                <p className="text-gray-800 font-medium">
                  {bookingDetails?.addresses?.addressline},
                  {bookingDetails?.addresses?.city},
                  {bookingDetails?.addresses?.state},
                  {bookingDetails?.addresses?.country}
                </p>
                {bookingDetails?.addresses?.addressline2 && (
                  <p className="text-gray-600 mt-1">
                    <span className="text-gray-500">Landmark:</span>{" "}
                    {bookingDetails?.addresses?.addressline2}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-orange-200 transition-all hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
            <FaCheckCircle className="text-orange-500 mr-2" /> Next Steps
          </h2>
          <p className="text-gray-700">
            Our team will contact you within 24 hours to confirm all details and
            provide any additional instructions needed for your puja ceremony.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 md:mb-12">
          <button
            className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto"
            onClick={handleDownloadReceipt}
          >
            <FaDownload /> Download Receipt
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-white border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors w-full sm:w-auto"
            onClick={handleShareDetails}
          >
            <FaShare /> Share Details
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-2 border-gray-100 text-center">
            Need Assistance?
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
            <a
              href="tel:+91XXXXXXXXXX"
              className="flex items-center gap-2 hover:text-orange-600 transition-colors"
            >
              <div className="bg-orange-100 p-2 rounded-full">
                <FaPhoneAlt className="text-orange-600" />
              </div>
              <span className="text-gray-700">+91-XXXXX-XXXXX</span>
            </a>
            <a
              href="mailto:support@okpuja.com"
              className="flex items-center gap-2 hover:text-orange-600 transition-colors"
            >
              <div className="bg-orange-100 p-2 rounded-full">
                <FaEnvelope className="text-orange-600" />
              </div>
              <span className="text-gray-700">support@okpuja.com</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 hover:text-orange-600 transition-colors"
            >
              <div className="bg-orange-100 p-2 rounded-full">
                <FaQuestionCircle className="text-orange-600" />
              </div>
              <span className="text-orange-600 hover:underline">View FAQs</span>
            </a>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm pb-8">
          © {new Date().getFullYear()} OKPUJA. All rights reserved.
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;
